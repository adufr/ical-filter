import { ICalCalendar, type ICalEventData } from 'ical-generator'
import ical, { type VEvent } from 'node-ical'
import { z } from 'zod'

const querySchema = z.object({
  name: z.string(),
  url: z.url(),
  rules: z.union([
    stringToJSONSchema.pipe(ruleSchema),
    z.array(stringToJSONSchema.pipe(ruleSchema)),
  ]),
})

export default defineEventHandler(async (event) => {
  let { name, url, rules } = await getValidatedQuery(event, (query) =>
    querySchema.parse(query),
  )

  rules = Array.isArray(rules) ? rules : ([rules] as Rule[])

  try {
    // 1. fetch and parse the calendar
    const ics = await ical.async.fromURL(url)
    const icsEvents = Object.values(ics).filter(
      (item): item is VEvent => item?.type === 'VEVENT',
    )

    // 2. filter events based on rules
    const filteredEvents = applyRulesFilters(icsEvents, rules as Rule[])

    // 3. return data as ics
    const calendar = new ICalCalendar({ name })
    calendar.timezone('Europe/Paris')

    for (const event of filteredEvents) {
      calendar.createEvent(event as unknown as ICalEventData)
    }

    setResponseHeader(event, 'content-type', 'text/calendar')
    return calendar.toString()
  } catch (error) {
    console.error('Error fetching ICS:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch calendar data',
    })
  }
})

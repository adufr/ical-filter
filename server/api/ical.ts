import type { ICalEventData } from 'ical-generator'
import type { VEvent } from 'node-ical'
import type { Rule } from '~/types'
import { ICalCalendar } from 'ical-generator'
import ical from 'node-ical'
import { z } from 'zod'
import { applyRulesFilters } from '~/utils/rules'
import { ruleSchema } from '~/utils/schemas'

const querySchema = z.object({
  name: z.string(),
  url: z.string().url(),
  rules: z.union([
    ruleSchema,
    z.array(ruleSchema),
  ]),
})

export default defineEventHandler(async (event) => {
  let { name, url, rules } = await getValidatedQuery(event, query => querySchema.parse(query))

  rules = Array.isArray(rules) ? rules : ([rules] as Rule[])

  try {
    // 1. fetch and parse the calendar
    const ics = await ical.async.fromURL(url)
    const icsEvents = Object.values(ics).filter((item): item is VEvent => item.type === 'VEVENT')

    // 2. filter events based on rules
    const filteredEvents = applyRulesFilters(icsEvents, rules)

    // 3. return data as ics
    const calendar = new ICalCalendar({ name })
    calendar.timezone('Europe/Paris')

    for (const event of filteredEvents) {
      calendar.createEvent(event as unknown as ICalEventData)
    }

    setResponseHeader(event, 'content-type', 'text/calendar')
    return calendar.toString()
  }
  catch (error) {
    console.error('Error fetching ICS:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch calendar data' })
  }
})

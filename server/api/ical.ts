import { ICalCalendar, type ICalEventData } from 'ical-generator'
import ical, { type VEvent } from 'node-ical'
import { z } from 'zod'

const querySchema = z.object({
  name: z.string(),
  url: z.url(),
  rules: z
    .union([
      stringToJSONSchema.pipe(ruleSchema),
      z.array(stringToJSONSchema.pipe(ruleSchema)),
    ])
    .optional(),
  replacements: z
    .union([
      stringToJSONSchema.pipe(replaceRuleSchema),
      z.array(stringToJSONSchema.pipe(replaceRuleSchema)),
    ])
    .optional(),
})

export default defineEventHandler(async (event) => {
  const { name, url, rules, replacements } = await getValidatedQuery(
    event,
    (query) => querySchema.parse(query),
  )

  const filterRules = Array.isArray(rules)
    ? rules
    : rules
      ? [rules]
      : ([] as Rule[])
  const replaceRules = Array.isArray(replacements)
    ? replacements
    : replacements
      ? [replacements]
      : ([] as ReplaceRule[])

  try {
    // 1. fetch and parse the calendar
    const ics = await ical.async.fromURL(url)
    const icsEvents = Object.values(ics).filter(
      (item): item is VEvent => item?.type === 'VEVENT',
    )

    // 2. filter and transform events based on rules
    const filteredEvents =
      filterRules.length > 0
        ? applyRulesFilters(icsEvents, filterRules)
        : icsEvents
    const transformedEvents = applyReplaceRules(filteredEvents, replaceRules)

    // 3. return data as ics
    const calendar = new ICalCalendar({ name })
    calendar.timezone('Europe/Paris')

    for (const filteredEvent of transformedEvents) {
      calendar.createEvent(filteredEvent as unknown as ICalEventData)
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

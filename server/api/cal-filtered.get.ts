import type { VEvent } from 'node-ical'
import type { Rule } from '~/types'
import { ICalCalendar } from 'ical-generator'
import ical from 'node-ical'
import { z } from 'zod'
import { applyRulesFilters } from '~/utils/rules'

const stringToJSONSchema = z.string()
  .transform((str, ctx): z.infer<ReturnType<typeof JSON.parse>> => {
    try {
      return JSON.parse(str)
    }
    catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return z.NEVER
    }
  })

const ruleSchema = stringToJSONSchema.pipe(
  z.object({
    f: z.enum(['s', 'd', 'l']),
    t: z.enum(['c', '=', '!', 's', 'e']),
    cs: z.boolean(),
    v: z.string(), // TODO: make rule optional and filter out all rules with empty values
  }),
)

const querySchema = z.object({
  format: z.enum(['json', 'ics']),
  name: z.string(),
  url: z.string().url(),
  rules: z.union([
    ruleSchema,
    z.array(ruleSchema),
  ]),
})

export default defineEventHandler(async (event) => {
  let { format, name, url, rules } = await getValidatedQuery(event, query => querySchema.parse(query))

  rules = Array.isArray(rules) ? rules : ([rules] as Rule[])

  // --------------------------------------------------------------------------
  // 1. fetch and parse the calendar

  const response = await fetch(url.toString())

  if (!response.ok)
    throw createError({ statusCode: response.status, statusMessage: 'Failed to fetch calendar data' })

  const responseAsText = await response.text()

  const ics = ical.sync.parseICS(responseAsText)
  const icsEvents = Object.values(ics).filter((item): item is VEvent => item.type === 'VEVENT')

  // --------------------------------------------------------------------------
  // 2. filter events based on rules

  // TODO: move to a util file and add unit tests
  const filteredEvents = applyRulesFilters(icsEvents, rules)

  // --------------------------------------------------------------------------
  // 3. return data

  if (format === 'ics') {
    const calendar = new ICalCalendar({ name })

    for (const event of filteredEvents) {
      calendar.createEvent({
        start: event.start,
        end: event.end,
        summary: event.summary,
      })
    }

    setResponseHeader(event, 'content-type', 'text/calendar')
    return calendar.toString()
  }

  return { events: filteredEvents }
})

import type { VEvent } from 'node-ical'
import type { Event } from '~/types'
import { ICalCalendar } from 'ical-generator'
import ical from 'node-ical'
import { z } from 'zod'

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
    a: z.enum(['i', 'e']),
    v: z.string(),
  }),
)

const querySchema = z.object({
  url: z.string().url(),
  rules: z.union([
    ruleSchema,
    z.array(ruleSchema),
  ]),
})

export default defineEventHandler(async (event) => {
  let { url, rules } = await getValidatedQuery(event, query => querySchema.parse(query))

  rules = Array.isArray(rules) ? rules : [rules]

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
  const filteredEvents = icsEvents.filter((event) => {
    for (const rule of rules) {
      const include = rule.a === 'i' // i ->  include | e -> exclude

      let fieldValue: string

      switch (rule.f) {
        case 's':
          fieldValue = event.summary
          break
        case 'd':
          fieldValue = event.description
          break
        case 'l':
          fieldValue = event.location
          break
      }

      switch (rule.t) {
        case 'c':
          if (fieldValue?.includes(rule.v))
            return include
          break
        case '=':
          if (fieldValue !== rule.v)
            return include
          break
        case '!':
          if (fieldValue === rule.v)
            return include
          break
        case 's':
          if (!fieldValue?.startsWith(rule.v))
            return include
          break
        case 'e':
          if (!fieldValue?.endsWith(rule.v))
            return include
          break
      }
    }

    return false
  })

  // --------------------------------------------------------------------------
  // 3. build the icalendar to respond with

  const calendar = new ICalCalendar({ name: 'ICalFilter' })

  for (const event of filteredEvents) {
    calendar.createEvent({
      start: event.start,
      end: event.end,
      summary: event.summary,
    })
  }

  setResponseHeader(event, 'content-type', 'text/calendar')
  return calendar.toString()
})

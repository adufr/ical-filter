import type { VEvent } from 'node-ical'
import ical from 'node-ical'
import { z } from 'zod'

const querySchema = z.object({
  url: z.string().url(),
})

export default defineEventHandler(async (event) => {
  const { url } = await getValidatedQuery(event, query => querySchema.parse(query))

  // --------------------------------------------------------------------------
  // 1. fetch and parse the calendar

  const response = await fetch(url.toString())

  if (!response.ok)
    throw createError({ statusCode: response.status, statusMessage: 'Failed to fetch calendar data' })

  const responseAsText = await response.text()

  const ics = ical.sync.parseICS(responseAsText)
  const icsEvents = Object.values(ics).filter((item): item is VEvent => item.type === 'VEVENT')

  // --------------------------------------------------------------------------
  // 2. return data

  return { events: icsEvents }
})

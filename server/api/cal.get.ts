import type { VEvent } from 'node-ical'
import ical from 'node-ical'
import { z } from 'zod'

const querySchema = z.object({
  url: z.string().url(),
})

export default defineEventHandler(async (event) => {
  const { url } = await getValidatedQuery(event, query => querySchema.parse(query))

  try {
    const ics = await ical.async.fromURL(url)
    const icsEvents = Object.values(ics).filter((item): item is VEvent => item.type === 'VEVENT')

    return { events: icsEvents }
  }
  catch (error) {
    console.error('Error fetching ICS:', error)
    throw createError({ statusCode: 400, statusMessage: 'Failed to fetch calendar data' })
  }
})

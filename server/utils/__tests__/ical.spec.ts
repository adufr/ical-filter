import { ICalCalendar } from 'ical-generator'
import ical, { type VEvent } from 'node-ical'
import { describe, expect, it } from 'vitest'

import { getSourceCalendarTimezone, mapVEventToICalEventData } from '../ical'

function parseCalendar(source: string) {
  return ical.sync.parseICS(source)
}

function parseFirstEvent(source: string) {
  const calendar = parseCalendar(source)
  const event = Object.values(calendar).find(
    (item): item is VEvent => item?.type === 'VEVENT',
  )

  if (!event) {
    throw new Error('Expected a VEVENT in the parsed calendar')
  }

  return { calendar, event }
}

function renderEvent(
  event: VEvent,
  options?: Parameters<typeof mapVEventToICalEventData>[1],
) {
  const calendar = new ICalCalendar({ name: 'Timezone test' })
  calendar.createEvent(mapVEventToICalEventData(event, options))
  return calendar.toString()
}

describe('mapVEventToICalEventData', () => {
  it('round-trips timed events with an explicit event timezone', () => {
    const { event } = parseFirstEvent(`BEGIN:VCALENDAR
BEGIN:VEVENT
UID:explicit-timezone
DTSTART;TZID=America/New_York:20260306T100000
DTEND;TZID=America/New_York:20260306T110000
SUMMARY:Breakfast
END:VEVENT
END:VCALENDAR`)

    const rendered = renderEvent(event)

    expect(rendered).toContain('UID:explicit-timezone')
    expect(rendered).toContain('DTSTART;TZID=America/New_York:20260306T100000')
    expect(rendered).toContain('DTEND;TZID=America/New_York:20260306T110000')
  })

  it('uses the source calendar timezone when the event has no timezone', () => {
    const { calendar, event } = parseFirstEvent(`BEGIN:VCALENDAR
X-WR-TIMEZONE:America/New_York
BEGIN:VEVENT
UID:calendar-timezone
DTSTART:20260306T100000
DTEND:20260306T110000
SUMMARY:Standup
END:VEVENT
END:VCALENDAR`)

    const rendered = renderEvent(event, {
      sourceTimezone: getSourceCalendarTimezone(calendar.vcalendar),
    })

    expect(rendered).toContain('DTSTART;TZID=America/New_York:20260306T100000')
    expect(rendered).toContain('DTEND;TZID=America/New_York:20260306T110000')
  })

  it('uses the manual fallback timezone for floating events', () => {
    const { event } = parseFirstEvent(`BEGIN:VCALENDAR
BEGIN:VEVENT
UID:fallback-timezone
DTSTART:20260306T100000
DTEND:20260306T110000
SUMMARY:Lunch
END:VEVENT
END:VCALENDAR`)

    const rendered = renderEvent(event, {
      fallbackTimezone: 'Europe/Paris',
    })

    expect(rendered).toContain('DTSTART;TZID=Europe/Paris:20260306T100000')
    expect(rendered).toContain('DTEND;TZID=Europe/Paris:20260306T110000')
  })

  it('keeps floating events floating when no timezone can be resolved', () => {
    const { event } = parseFirstEvent(`BEGIN:VCALENDAR
BEGIN:VEVENT
UID:floating
DTSTART:20260306T100000
DTEND:20260306T110000
SUMMARY:Gym
END:VEVENT
END:VCALENDAR`)

    const rendered = renderEvent(event)

    expect(rendered).toContain('DTSTART:20260306T100000')
    expect(rendered).toContain('DTEND:20260306T110000')
    expect(rendered).not.toContain('TZID=')
  })

  it('keeps all-day events as date values', () => {
    const { event } = parseFirstEvent(`BEGIN:VCALENDAR
BEGIN:VEVENT
UID:all-day
DTSTART;VALUE=DATE:20260306
DTEND;VALUE=DATE:20260307
SUMMARY:Day off
END:VEVENT
END:VCALENDAR`)

    const rendered = renderEvent(event, {
      fallbackTimezone: 'Europe/Paris',
    })

    expect(rendered).toContain('DTSTART;VALUE=DATE:20260306')
    expect(rendered).toContain('DTEND;VALUE=DATE:20260307')
  })
})

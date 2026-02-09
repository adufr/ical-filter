import { describe, expect, it } from 'vitest'

describe('getCalendarUrl', () => {
  it('serializes rules and replacements in query params', () => {
    const url = getCalendarUrl({
      id: 'calendar-id',
      name: 'Filtered calendar',
      url: 'https://example.com/calendar.ics',
      rules: [{ f: 's', t: 'c', cs: true, v: 'foo' }],
      replacements: [{ f: 's', cs: false, from: 'boo', to: 'bar' }],
    })
    const query = new URLSearchParams(url.split('?')[1])

    expect(query.get('name')).toBe('Filtered calendar')
    expect(query.get('url')).toBe('https://example.com/calendar.ics')
    expect(query.getAll('rules')).toEqual([
      JSON.stringify({ f: 's', t: 'c', cs: true, v: 'foo' }),
    ])
    expect(query.getAll('replacements')).toEqual([
      JSON.stringify({ f: 's', cs: false, from: 'boo', to: 'bar' }),
    ])
  })

  it('omits replacements when there are none', () => {
    const url = getCalendarUrl({
      id: 'calendar-id',
      name: 'Filtered calendar',
      url: 'https://example.com/calendar.ics',
      rules: [{ f: 's', t: 'c', cs: true, v: 'foo' }],
      replacements: [],
    })
    const query = new URLSearchParams(url.split('?')[1])

    expect(query.getAll('replacements')).toHaveLength(0)
  })
})

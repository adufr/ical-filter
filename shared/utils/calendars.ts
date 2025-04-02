import type { Calendar } from '~/types'

export function getCalendarUrl(calendar: Calendar) {
  const queryParams = new URLSearchParams()
  queryParams.set('name', calendar.name)
  queryParams.set('url', calendar.url)

  const r = calendar.rules.map((rule) => ({
    f: rule.f,
    t: rule.t,
    cs: rule.cs,
    v: rule.v,
  }))
  for (const rule of r) queryParams.append('rules', JSON.stringify(rule))

  return `/api/ical?${queryParams.toString()}`
}

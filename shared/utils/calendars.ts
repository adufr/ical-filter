import type { Calendar } from '../types/index'

export function getCalendarUrl(calendar: Calendar) {
  const queryParams = new URLSearchParams()
  queryParams.set('name', calendar.name)
  queryParams.set('url', calendar.url)
  if (calendar.timezone) {
    queryParams.set('timezone', calendar.timezone)
  }

  const r = calendar.rules.map((rule) => ({
    f: rule.f,
    t: rule.t,
    cs: rule.cs,
    v: rule.v,
  }))
  for (const rule of r) queryParams.append('rules', JSON.stringify(rule))

  const replacements = (calendar.replacements ?? []).map((replacement) => ({
    f: replacement.f,
    cs: replacement.cs,
    from: replacement.from,
    to: replacement.to,
  }))
  for (const replacement of replacements) {
    queryParams.append('replacements', JSON.stringify(replacement))
  }

  return `/api/ical?${queryParams.toString()}`
}

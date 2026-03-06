import type { ICalEventData } from 'ical-generator'
import type { ParameterValue, VCalendar, VEvent } from 'node-ical'

type ExportTimezoneOptions = {
  fallbackTimezone?: string
  sourceTimezone?: string
}

function toPlainText(value: ParameterValue | undefined) {
  return typeof value === 'string' ? value : value?.val
}

function isUtcTimezone(timezone?: string) {
  if (!timezone) return false

  const lowerCaseTimezone = timezone.toLowerCase()
  return (
    lowerCaseTimezone === 'utc' ||
    lowerCaseTimezone === 'etc/utc' ||
    lowerCaseTimezone === 'etc/gmt'
  )
}

const ianaTimezoneValidationCache = new Map<string, boolean>()

function hasValidIanaTimezone(timezone: string) {
  const cached = ianaTimezoneValidationCache.get(timezone)
  if (cached !== undefined) return cached

  let valid: boolean
  try {
    Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date())
    valid = true
  } catch {
    valid = false
  }

  ianaTimezoneValidationCache.set(timezone, valid)
  return valid
}

const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>()

function getDateTimeFormatter(timezone: string) {
  let formatter = dateTimeFormatCache.get(timezone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
    dateTimeFormatCache.set(timezone, formatter)
  }
  return formatter
}

function toCalendarDateInTimezone(date: Date, timezone: string) {
  const parts = Object.fromEntries(
    getDateTimeFormatter(timezone)
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )

  return new Date(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )
}

function toAllDayCalendarDate(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}

function toFloatingCalendarDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  )
}

function toTimedCalendarDate(date: Date, timezone?: string) {
  if (!timezone || isUtcTimezone(timezone)) {
    return date
  }

  if (!hasValidIanaTimezone(timezone)) {
    return date
  }

  return toCalendarDateInTimezone(date, timezone)
}

export function getSourceCalendarTimezone(vcalendar?: VCalendar) {
  return vcalendar?.['WR-TIMEZONE']
}

export function resolveEventTimezone(
  event: VEvent,
  options: ExportTimezoneOptions = {},
) {
  return (
    event.start.tz ??
    event.end?.tz ??
    options.sourceTimezone ??
    options.fallbackTimezone
  )
}

export function mapVEventToICalEventData(
  event: VEvent,
  options: ExportTimezoneOptions = {},
): ICalEventData {
  const isAllDay = Boolean(event.start.dateOnly)
  const timezone = isAllDay ? undefined : resolveEventTimezone(event, options)
  const isFloating = !isAllDay && !timezone
  const start = isAllDay
    ? toAllDayCalendarDate(event.start)
    : isFloating
      ? toFloatingCalendarDate(event.start)
      : toTimedCalendarDate(event.start, event.start.tz)

  const mappedEvent: ICalEventData = {
    id: event.uid,
    start,
    summary: toPlainText(event.summary) ?? '',
    description: toPlainText(event.description),
    location: toPlainText(event.location),
    stamp: event.dtstamp,
    created: event.created,
    lastModified: event.lastmodified,
    recurrenceId: event.recurrenceid,
    url: event.url,
  }

  if (event.end) {
    const end = isAllDay
      ? toAllDayCalendarDate(event.end)
      : isFloating
        ? toFloatingCalendarDate(event.end)
        : toTimedCalendarDate(event.end, event.end.tz ?? event.start.tz)

    mappedEvent.end = end
  }

  if (isAllDay) {
    mappedEvent.allDay = true
    return mappedEvent
  }

  if (timezone) {
    mappedEvent.timezone = timezone
  } else {
    mappedEvent.floating = true
  }

  return mappedEvent
}

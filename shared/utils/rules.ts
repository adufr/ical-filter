import type { ParameterValue, VEvent } from 'node-ical'

function toPlainText(value: ParameterValue | undefined): string | undefined {
  return typeof value === 'string' ? value : value?.val
}

function getEventFieldValue(
  event: VEvent,
  field: RuleField,
): string | undefined {
  switch (field) {
    case ruleFields.summary:
      return toPlainText(event.summary)
    case ruleFields.description:
      return toPlainText(event.description)
    case ruleFields.location:
      return toPlainText(event.location)
    default:
      return undefined
  }
}

function setEventFieldValue(event: VEvent, field: RuleField, value: string) {
  switch (field) {
    case ruleFields.summary:
      if (typeof event.summary === 'string' || !event.summary) {
        event.summary = value
      } else {
        event.summary = { ...event.summary, val: value }
      }
      return
    case ruleFields.description:
      if (typeof event.description === 'string' || !event.description) {
        event.description = value
      } else {
        event.description = { ...event.description, val: value }
      }
      return
    case ruleFields.location:
      if (typeof event.location === 'string' || !event.location) {
        event.location = value
      } else {
        event.location = { ...event.location, val: value }
      }
  }
}

function cloneEvent(event: VEvent): VEvent {
  const clonedEvent: VEvent = {
    ...event,
    summary:
      event.summary && typeof event.summary === 'object'
        ? { ...event.summary }
        : event.summary,
    description:
      event.description && typeof event.description === 'object'
        ? { ...event.description }
        : event.description,
    location:
      event.location && typeof event.location === 'object'
        ? { ...event.location }
        : event.location,
  }

  return clonedEvent
}

function escapeRegExp(value: string) {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
}

function toUniqueFlags(flags: string) {
  return Array.from(new Set(flags)).join('')
}

function parseRegexLiteral(value: string) {
  const match = value.match(/^\/(.+)\/([dgimsuvy]*)$/)
  if (!match) return null

  const pattern = match[1]
  if (pattern === undefined) return null

  const flags = match[2] ?? ''
  return { pattern, flags }
}

function withCaseSensitivityFlag(flags: string, isCaseSensitive: boolean) {
  let nextFlags = flags

  if (isCaseSensitive) {
    nextFlags = nextFlags.replaceAll('i', '')
  } else if (!nextFlags.includes('i')) {
    nextFlags += 'i'
  }

  return nextFlags
}

function createRegex(pattern: string, flags: string) {
  try {
    return new RegExp(pattern, toUniqueFlags(flags))
  } catch {
    return null
  }
}

function toRegexFromLiteral(value: string, isCaseSensitive: boolean) {
  const literalRegex = parseRegexLiteral(value)
  if (!literalRegex) return null

  let flags = withCaseSensitivityFlag(literalRegex.flags, isCaseSensitive)

  if (!flags.includes('g')) {
    flags += 'g'
  }

  return createRegex(literalRegex.pattern, flags)
}

function toRegexFromRuleValue(value: string, isCaseSensitive: boolean) {
  const literalRegex = parseRegexLiteral(value)

  if (literalRegex) {
    const flags = withCaseSensitivityFlag(literalRegex.flags, isCaseSensitive)
    return createRegex(literalRegex.pattern, flags)
  }

  const flags = isCaseSensitive ? '' : 'i'
  return createRegex(value, flags)
}

function replaceText(value: string, replacement: ReplaceRule) {
  const regexFromLiteral = toRegexFromLiteral(replacement.from, replacement.cs)
  if (regexFromLiteral) {
    return value.replaceAll(regexFromLiteral, replacement.to)
  }

  if (replacement.cs) {
    return value.replaceAll(replacement.from, replacement.to)
  }

  const pattern = new RegExp(escapeRegExp(replacement.from), 'gi')
  return value.replaceAll(pattern, replacement.to)
}

export function applyRuleFilter(icsEvents: VEvent[], rule: Rule) {
  const regexPattern =
    rule.t === ruleTypes.regex ? toRegexFromRuleValue(rule.v, rule.cs) : null

  return icsEvents.filter((event) => {
    const fieldValue = getEventFieldValue(event, rule.f)
    if (fieldValue === undefined) return false

    const value = rule.cs ? rule.v : rule.v.toLowerCase()
    const compareValue = rule.cs ? fieldValue : fieldValue?.toLowerCase()

    switch (rule.t) {
      case ruleTypes.contains:
        return compareValue?.includes(value)
      case ruleTypes.equals:
        return compareValue === value
      case ruleTypes.notEquals:
        return compareValue !== value
      case ruleTypes.startsWith:
        return compareValue?.startsWith(value)
      case ruleTypes.endsWith:
        return compareValue?.endsWith(value)
      case ruleTypes.regex:
        if (!regexPattern) return false
        regexPattern.lastIndex = 0
        return regexPattern.test(fieldValue)
      default:
        return false
    }
  })
}

export function applyRulesFilters(icsEvents: VEvent[], rules: Rule[]) {
  return rules.flatMap((rule) => applyRuleFilter(icsEvents, rule))
}

export function applyReplaceRules(
  icsEvents: VEvent[],
  replacements: ReplaceRule[],
) {
  const filteredReplacements = replacements.filter(
    (replacement) => replacement.from.length > 0,
  )
  if (filteredReplacements.length === 0) return icsEvents

  const updatedEvents = icsEvents.map((event) => cloneEvent(event))

  for (const replacement of filteredReplacements) {
    for (const event of updatedEvents) {
      const currentValue = getEventFieldValue(event, replacement.f)
      if (currentValue === undefined) continue

      const nextValue = replaceText(currentValue, replacement)
      if (nextValue !== currentValue) {
        setEventFieldValue(event, replacement.f, nextValue)
      }
    }
  }

  return updatedEvents
}

import type { ParameterValue, VEvent } from 'node-ical'

function toPlainText(value: ParameterValue | undefined): string | undefined {
  return typeof value === 'string' ? value : value?.val
}

export function applyRuleFilter(icsEvents: VEvent[], rule: Rule) {
  return icsEvents.filter((event) => {
    let fieldValue: string | undefined

    switch (rule.f) {
      case ruleFields.summary:
        fieldValue = toPlainText(event.summary)
        break
      case ruleFields.description:
        fieldValue = toPlainText(event.description)
        break
      case ruleFields.location:
        fieldValue = toPlainText(event.location)
        break
      default:
        return false
    }

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
      default:
        return false
    }
  })
}

export function applyRulesFilters(icsEvents: VEvent[], rules: Rule[]) {
  return rules.flatMap((rule) => applyRuleFilter(icsEvents, rule))
}

import type { VEvent } from 'node-ical'
import { type Rule, ruleFields, ruleTypes } from '~/types'

export function applyRuleFilter(icsEvents: VEvent[], rule: Rule) {
  return icsEvents.filter((event) => {
    let fieldValue: string | undefined

    switch (rule.f) {
      case ruleFields.summary:
        fieldValue = event.summary
        break
      case ruleFields.description:
        fieldValue = event.description
        break
      case ruleFields.location:
        fieldValue = event.location
        break
      default:
        return false
    }

    switch (rule.t) {
      case ruleTypes.contains:
        return fieldValue?.includes(rule.v)
      case ruleTypes.equals:
        return fieldValue === rule.v
      case ruleTypes.notEquals:
        return fieldValue !== rule.v
      case ruleTypes.startsWith:
        return fieldValue?.startsWith(rule.v)
      case ruleTypes.endsWith:
        return fieldValue?.endsWith(rule.v)
      default:
        return false
    }
  })
}

export function applyRulesFilters(icsEvents: VEvent[], rules: Rule[]) {
  return rules.flatMap(rule => applyRuleFilter(icsEvents, rule))
}

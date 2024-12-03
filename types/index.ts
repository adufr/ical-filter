export interface Event {
  start: Date
  end: Date
  user: string
}

export const ruleFields = {
  summary: 's',
  description: 'd',
  location: 'l',
} as const
type RuleField = keyof typeof ruleFields

// TODO: regex
export const ruleTypes = {
  contains: 'c',
  equals: '=',
  notEquals: '!',
  startsWith: 's',
  endsWith: 'e',
} as const
type RuleType = keyof typeof ruleTypes

export const ruleActions = {
  include: 'i',
  exclude: 'e',
} as const
type RuleAction = keyof typeof ruleActions

export interface Rule {
  field: RuleField
  type: RuleType
  action: RuleAction
  value: string
}

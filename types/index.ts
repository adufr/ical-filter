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
export type RuleField = typeof ruleFields[keyof typeof ruleFields]

// TODO: regex
export const ruleTypes = {
  contains: 'c',
  equals: '=',
  notEquals: '!',
  startsWith: 's',
  endsWith: 'e',
} as const
export type RuleType = typeof ruleTypes[keyof typeof ruleTypes]

export const ruleActions = {
  include: 'i',
  exclude: 'e',
} as const
export type RuleAction = typeof ruleActions[keyof typeof ruleActions]

export interface Rule {
  f: RuleField
  t: RuleType
  a: RuleAction
  v: string
}

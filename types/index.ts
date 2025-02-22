export interface Event {
  start: Date;
  end: Date;
  user: string;
}

export const ruleFields = {
  summary: "s",
  description: "d",
  location: "l",
} as const;
export type RuleField = (typeof ruleFields)[keyof typeof ruleFields];

// TODO: regex
export const ruleTypes = {
  contains: "c",
  equals: "=",
  notEquals: "!",
  startsWith: "s",
  endsWith: "e",
} as const;
export type RuleType = (typeof ruleTypes)[keyof typeof ruleTypes];

export interface Rule {
  f: RuleField;
  t: RuleType;
  cs: boolean;
  v: string;
}

export interface Calendar {
  id?: string;
  url: string;
  name: string;
  rules: Rule[];
}

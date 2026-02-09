import { z } from 'zod'

export const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof JSON.parse>> => {
    try {
      return JSON.parse(str)
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return z.NEVER
    }
  })

export const ruleSchema = z.object({
  f: z.enum(ruleFields),
  t: z.enum(ruleTypes),
  cs: z.boolean(),
  v: z.string(),
})

export type RuleSchema = z.output<typeof ruleSchema>

export const replaceRuleSchema = z.object({
  f: z.enum(ruleFields),
  cs: z.boolean(),
  from: z.string(),
  to: z.string(),
})

export type ReplaceRuleSchema = z.output<typeof replaceRuleSchema>

export const formSchema = z.object({
  url: z.url(),
  name: z.string().min(1),
  rules: z.array(ruleSchema).default([]),
  replacements: z.array(replaceRuleSchema).default([]),
})

export type FormSchema = z.output<typeof formSchema>

import { z } from "zod";
import { ruleFields, ruleTypes } from "~/types";

export const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof JSON.parse>> => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

export const ruleSchema = z.object({
  f: z.nativeEnum(ruleFields),
  t: z.nativeEnum(ruleTypes),
  cs: z.boolean(),
  v: z.string(),
});

export type RuleSchema = z.output<typeof ruleSchema>;

export const formSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1),
  rules: z.array(ruleSchema),
});

export type FormSchema = z.output<typeof formSchema>;

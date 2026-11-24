import * as z from 'zod/mini'

/** Error messages are i18n keys resolved by the UI (see `ui.errors`). */
const required = z.string().check(z.trim(), z.minLength(1, 'required'))

export const metaFormSchema = z.object({
  projectName: required,
  author: required,
  identifier: z.string(),
  version: z.string(),
  date: z.string(),
  organization: z.string(),
  purpose: z.string(),
})

export type MetaForm = z.infer<typeof metaFormSchema>

const scale = z.coerce.number().check(z.int(), z.minimum(1), z.maximum(5))

export const riskFormSchema = z.object({
  title: required,
  type: z.enum(['product', 'project']),
  probability: scale,
  impact: scale,
  mitigation: z.string(),
  owner: z.string(),
})

export type RiskFormInput = z.input<typeof riskFormSchema>
export type RiskForm = z.output<typeof riskFormSchema>

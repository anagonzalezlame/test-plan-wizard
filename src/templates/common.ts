import { docStrings, type DocDict } from '../i18n/doc'
import { labelOf, type CatalogKey } from '../data/catalogs'
import { rankedRisks, riskLevel } from '../lib/risk'
import { totalEffort } from '../lib/effort'
import type { Lang, Plan, RiskType } from '../types/plan'
import { table } from './blocks'
import type { Block } from './types'

export interface Ctx {
  plan: Plan
  d: DocDict
  labels: (catalog: CatalogKey, values: string[]) => string[]
}

export function makeCtx(plan: Plan, lang: Lang): Ctx {
  return {
    plan,
    d: docStrings[lang],
    labels: (catalog, values) => values.map((v) => labelOf(catalog, v, lang)),
  }
}

export function riskTable({ plan, d }: Ctx, type?: RiskType): Block[] {
  const withType = !type
  const headers = [
    d.h.id,
    d.h.risk,
    ...(withType ? [d.h.type] : []),
    d.h.probability,
    d.h.impact,
    d.h.level,
    d.h.mitigation,
    d.h.owner,
  ]
  const rows = rankedRisks(plan.risks)
    .filter(({ risk }) => !type || risk.type === type)
    .map(({ risk, code, score }) => [
      code,
      risk.title,
      ...(withType ? [d.riskType[risk.type]] : []),
      String(risk.probability),
      String(risk.impact),
      `${d.riskLevel[riskLevel(score)]} (${score})`,
      risk.mitigation,
      risk.owner,
    ])
  return table(headers, rows)
}

export const stakeholderTable = ({ plan, d }: Ctx, label?: string) =>
  table(
    [d.h.name, d.h.role, d.h.interest],
    plan.stakeholders.map((s) => [s.name, s.role, s.interest]),
    label,
  )

export const communicationTable = ({ plan, d }: Ctx, label?: string) =>
  table(
    [d.h.what, d.h.audience, d.h.channel, d.h.frequency],
    plan.communication.map((c) => [c.what, c.audience, c.channel, c.frequency]),
    label,
  )

export const teamTable = ({ plan, d }: Ctx) =>
  table(
    [d.h.role, d.h.name, d.h.responsibilities],
    plan.resources.team.map((m) => [m.role, m.name, m.responsibilities]),
  )

export const environmentTable = ({ plan, d }: Ctx) =>
  table(
    [d.h.environment, d.h.description],
    plan.resources.environments.map((e) => [e.name, e.description]),
  )

export function activityTable({ plan, d }: Ctx): Block[] {
  const rows = plan.schedule.activities.map((a) => [a.name, a.effort, a.owner])
  const blocks = table([d.h.activity, d.h.effort, d.h.owner], rows)
  const total = totalEffort(plan.schedule.activities)
  const tbl = blocks[0]
  if (tbl?.kind === 'table' && total > 0) tbl.rows.push([d.h.total, String(total), ''])
  return blocks
}

export const milestoneTable = ({ plan, d }: Ctx) =>
  table(
    [d.h.milestone, d.date],
    plan.schedule.milestones.map((m) => [m.name, m.date]),
  )

export const approvalTable = ({ plan, d }: Ctx) =>
  table(
    [d.h.name, d.h.role, d.h.signature, d.date],
    plan.schedule.approvals.map((a) => [a.name, a.role, '', '']),
  )

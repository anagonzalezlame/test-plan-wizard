import type { Lang, Plan } from '../types/plan'
import { makeCtx } from './common'
import { buildIeee829 } from './ieee829'
import { buildIso29119 } from './iso29119'
import type { PlanDocument, Section } from './types'

export function buildDocument(plan: Plan, lang: Lang): PlanDocument {
  const ctx = makeCtx(plan, lang)
  const { d } = ctx
  const { meta } = plan
  const sections = plan.standard === 'iso29119' ? buildIso29119(ctx) : buildIeee829(ctx)

  return {
    title: `${d.testPlan}: ${meta.projectName.trim() || d.untitled}`,
    meta: [
      { label: d.identifier, value: meta.identifier },
      { label: d.version, value: meta.version },
      { label: d.date, value: meta.date },
      { label: d.author, value: meta.author },
      { label: d.organization, value: meta.organization },
      { label: d.standard, value: d.standards[plan.standard] },
    ].filter((m) => m.value.trim()),
    sections,
    footer: d.footer,
    pending: d.pending,
  }
}

/** Adds "1", "1.2"… numbering following the heading levels. */
export function numberSections(sections: Section[]): { section: Section; number: string }[] {
  let major = 0
  let minor = 0
  return sections.map((section) => {
    if (section.level === 1) {
      major += 1
      minor = 0
      return { section, number: `${major}` }
    }
    minor += 1
    return { section, number: `${major}.${minor}` }
  })
}

export type { PlanDocument, Section, Block } from './types'

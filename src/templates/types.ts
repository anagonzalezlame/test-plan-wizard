import type { StepId } from '../lib/steps'

export type Block =
  | { kind: 'text'; label?: string; text: string }
  | { kind: 'list'; label?: string; items: string[] }
  | { kind: 'table'; label?: string; headers: string[]; rows: string[][] }

export interface Section {
  id: string
  title: string
  /** 1 = top-level heading, 2 = subsection. */
  level: 1 | 2
  /** Pure grouping headings carry no content and are not counted for completeness. */
  container?: boolean
  /** Wizard step where the content of this section is edited. */
  step: StepId
  blocks: Block[]
}

export interface PlanDocument {
  title: string
  meta: { label: string; value: string }[]
  sections: Section[]
  footer: string
  pending: string
}

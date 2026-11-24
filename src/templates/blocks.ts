import type { Block, Section } from './types'
import type { StepId } from '../lib/steps'

const clean = (items: string[]) => items.map((s) => s.trim()).filter(Boolean)

export function text(value: string, label?: string): Block[] {
  const t = value.trim()
  return t ? [{ kind: 'text', text: t, label }] : []
}

export function list(items: string[], label?: string): Block[] {
  const c = clean(items)
  return c.length ? [{ kind: 'list', items: c, label }] : []
}

export function table(headers: string[], rows: string[][], label?: string): Block[] {
  const r = rows.filter((row) => row.some((cell) => cell.trim()))
  return r.length ? [{ kind: 'table', headers, rows: r, label }] : []
}

export function section(
  id: string,
  title: string,
  step: StepId,
  blocks: Block[] = [],
  level: 1 | 2 = 2,
): Section {
  return { id, title, step, blocks, level }
}

export function heading(id: string, title: string, step: StepId): Section {
  return { id, title, step, blocks: [], level: 1, container: true }
}

import { numberSections, type Section } from '../templates'

export interface Completeness {
  done: number
  total: number
  percent: number
  missing: { number: string; section: Section }[]
}

/** Counts every content section (grouping headings excluded) that has at least one block. */
export function completeness(sections: Section[]): Completeness {
  const tracked = numberSections(sections).filter(({ section }) => !section.container)
  const missing = tracked.filter(({ section }) => section.blocks.length === 0)
  const done = tracked.length - missing.length
  return {
    done,
    total: tracked.length,
    percent: tracked.length ? Math.round((done / tracked.length) * 100) : 0,
    missing,
  }
}

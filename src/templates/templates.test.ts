import { emptyPlan } from '../data/emptyPlan'
import { samplePlan } from '../data/samplePlan'
import { completeness } from '../lib/completeness'
import { toMarkdown } from '../lib/markdown'
import { buildDocument, numberSections } from '.'

describe.each(['iso29119', 'ieee829'] as const)('%s template', (standard) => {
  it.each(['es', 'en'] as const)('the sample plan fills every section (%s)', (lang) => {
    const doc = buildDocument({ ...samplePlan(lang), standard }, lang)
    const stats = completeness(doc.sections)
    expect(stats.missing.map((m) => m.section.id)).toEqual([])
    expect(stats.percent).toBe(100)
  })

  it('an empty plan is mostly pending', () => {
    const stats = completeness(buildDocument({ ...emptyPlan(), standard }, 'es').sections)
    expect(stats.percent).toBeLessThan(10)
    expect(stats.total).toBeGreaterThan(15)
  })
})

describe('buildDocument', () => {
  it('uses the document language for titles and catalog labels', () => {
    const plan = samplePlan('es')
    const es = toMarkdown(buildDocument(plan, 'es'))
    const en = toMarkdown(buildDocument(plan, 'en'))
    expect(es).toContain('## 4. Registro de riesgos')
    expect(es).toContain('- Valores límite')
    expect(en).toContain('## 4. Risk register')
    expect(en).toContain('- Boundary value analysis')
  })

  it('keeps custom (non-catalog) entries verbatim', () => {
    const plan = emptyPlan()
    plan.strategy.techniques = ['boundary', 'Mutation testing']
    const md = toMarkdown(buildDocument(plan, 'en'))
    expect(md).toContain('- Boundary value analysis\n- Mutation testing')
  })

  it('numbers sections hierarchically', () => {
    const doc = buildDocument(samplePlan('en'), 'en')
    const numbers = numberSections(doc.sections).map((n) => n.number)
    expect(numbers.slice(0, 4)).toEqual(['1', '1.1', '1.2', '2'])
  })

  it('splits risks by type in ISO and adds a type column in IEEE', () => {
    const plan = samplePlan('en')
    const iso = buildDocument(plan, 'en').sections.find((s) => s.id === 'risks.project')!
    const isoTable = iso.blocks[0]
    expect(isoTable.kind).toBe('table')
    if (isoTable.kind === 'table') {
      expect(isoTable.rows).toHaveLength(2)
      expect(isoTable.rows[0][0]).toBe('R-04')
    }

    const ieee = buildDocument({ ...plan, standard: 'ieee829' }, 'en').sections.find(
      (s) => s.id === 'management.risks',
    )!
    const ieeeTable = ieee.blocks[0]
    expect(ieeeTable.kind).toBe('table')
    if (ieeeTable.kind === 'table') {
      expect(ieeeTable.headers).toContain('Type')
      expect(ieeeTable.rows).toHaveLength(5)
    }
  })
})

describe('toMarkdown', () => {
  it('renders metadata, pending placeholders and escapes table pipes', () => {
    const plan = emptyPlan()
    plan.meta.projectName = 'Demo'
    plan.meta.author = 'QA'
    plan.stakeholders = [{ id: '1', name: 'A | B', role: 'PO', interest: 'line\nbreak' }]
    const md = toMarkdown(buildDocument(plan, 'en'))
    expect(md.startsWith('# Test plan: Demo\n')).toBe(true)
    expect(md).toContain('**Author:** QA')
    expect(md).toContain('_To be defined._')
    expect(md).toContain('| A \\| B | PO | line break |')
  })

  it('adds a total row to the activities table', () => {
    const md = toMarkdown(buildDocument(samplePlan('en'), 'en'))
    expect(md).toContain('| Total | 25 |')
  })
})

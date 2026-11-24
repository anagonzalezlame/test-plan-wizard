import { emptyPlan } from '../data/emptyPlan'
import { fileBaseName } from './export'

describe('fileBaseName', () => {
  it('prefers the identifier and appends the language', () => {
    const plan = emptyPlan()
    plan.meta.identifier = 'TP-CHECKOUT-001'
    plan.meta.projectName = 'Ignored'
    expect(fileBaseName(plan, 'es')).toBe('tp-checkout-001-es')
  })

  it('falls back to a slug of the project name without accents or symbols', () => {
    const plan = emptyPlan()
    plan.meta.projectName = '  Gestión de Pagos / Fase 2!  '
    expect(fileBaseName(plan, 'en')).toBe('gestion-de-pagos-fase-2-en')
  })

  it('uses a default name for an empty plan', () => {
    expect(fileBaseName(emptyPlan(), 'es')).toBe('test-plan-es')
  })
})

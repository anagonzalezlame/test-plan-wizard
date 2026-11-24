import type { Lang } from '../types/plan'

type Catalog = Record<string, Record<Lang, string>>

export const catalogs = {
  levels: {
    unit: { es: 'Unitarias', en: 'Unit' },
    integration: { es: 'Integración', en: 'Integration' },
    system: { es: 'Sistema', en: 'System' },
    systemIntegration: { es: 'Integración de sistemas', en: 'System integration' },
    acceptance: { es: 'Aceptación', en: 'Acceptance' },
  },
  types: {
    functional: { es: 'Funcionales', en: 'Functional' },
    regression: { es: 'Regresión', en: 'Regression' },
    smoke: { es: 'Humo (smoke)', en: 'Smoke' },
    api: { es: 'API', en: 'API' },
    performance: { es: 'Rendimiento', en: 'Performance' },
    security: { es: 'Seguridad', en: 'Security' },
    usability: { es: 'Usabilidad', en: 'Usability' },
    accessibility: { es: 'Accesibilidad', en: 'Accessibility' },
    compatibility: { es: 'Compatibilidad', en: 'Compatibility' },
    exploratory: { es: 'Exploratorias', en: 'Exploratory' },
  },
  techniques: {
    equivalence: { es: 'Particiones de equivalencia', en: 'Equivalence partitioning' },
    boundary: { es: 'Valores límite', en: 'Boundary value analysis' },
    decisionTable: { es: 'Tablas de decisión', en: 'Decision tables' },
    stateTransition: { es: 'Transición de estados', en: 'State transition' },
    useCase: { es: 'Casos de uso', en: 'Use case testing' },
    pairwise: { es: 'Pairwise / combinatoria', en: 'Pairwise / combinatorial' },
    bdd: { es: 'Escenarios BDD (Gherkin)', en: 'BDD scenarios (Gherkin)' },
    errorGuessing: { es: 'Predicción de errores', en: 'Error guessing' },
    checklist: { es: 'Basadas en checklist', en: 'Checklist-based' },
    statement: { es: 'Cobertura de sentencias', en: 'Statement coverage' },
    branch: { es: 'Cobertura de decisiones', en: 'Branch coverage' },
  },
  deliverables: {
    plan: { es: 'Plan de pruebas', en: 'Test plan' },
    cases: { es: 'Especificación de casos de prueba', en: 'Test case specification' },
    data: { es: 'Datos de prueba', en: 'Test data' },
    log: { es: 'Registro de ejecución', en: 'Test execution log' },
    defects: { es: 'Reportes de defectos', en: 'Defect reports' },
    traceability: { es: 'Matriz de trazabilidad', en: 'Traceability matrix' },
    status: { es: 'Informes de avance', en: 'Test status reports' },
    summary: { es: 'Informe de cierre de pruebas', en: 'Test completion report' },
  },
  metrics: {
    execution: { es: 'Avance de ejecución (%)', en: 'Execution progress (%)' },
    passRate: { es: 'Tasa de casos aprobados', en: 'Pass rate' },
    coverage: { es: 'Cobertura de requisitos', en: 'Requirements coverage' },
    density: { es: 'Densidad de defectos', en: 'Defect density' },
    leakage: { es: 'Fuga de defectos a producción', en: 'Defect leakage' },
    dre: { es: 'Eficacia de remoción de defectos (DRE)', en: 'Defect removal efficiency (DRE)' },
    mttr: { es: 'Tiempo medio de resolución', en: 'Mean time to resolve' },
  },
} satisfies Record<string, Catalog>

export type CatalogKey = keyof typeof catalogs

/** Returns the translated label of a catalog entry, or the raw value for custom entries. */
export function labelOf(catalog: CatalogKey, value: string, lang: Lang): string {
  const entry = (catalogs[catalog] as Catalog)[value]
  return entry ? entry[lang] : value
}

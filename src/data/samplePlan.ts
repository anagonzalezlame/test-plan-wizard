import type { Lang, Plan } from '../types/plan'

const uid = () => crypto.randomUUID()

/** A realistic example (e-commerce checkout) to explore the tool quickly. */
export function samplePlan(lang: Lang): Plan {
  const L = (es: string, en: string) => (lang === 'es' ? es : en)
  const today = new Date().toISOString().slice(0, 10)

  return {
    standard: 'iso29119',
    meta: {
      projectName: L('Nuevo checkout de la tienda online', 'New online store checkout'),
      identifier: 'TP-CHECKOUT-001',
      version: '1.0',
      date: today,
      author: 'Carla Núñez',
      organization: 'Acme Retail',
      purpose: L(
        'Este plan define cómo se va a verificar el nuevo flujo de checkout (carrito, envío y pago) antes de su salida a producción, priorizando los riesgos de pérdida de ventas y de seguridad en los pagos.',
        'This plan defines how the new checkout flow (cart, shipping and payment) will be verified before going live, prioritising the risks of lost sales and payment security.',
      ),
      references: [
        L('Documento de requisitos del checkout v2.3', 'Checkout requirements document v2.3'),
        L('Épica JIRA SHOP-120 y sus historias de usuario', 'JIRA epic SHOP-120 and its user stories'),
        L('Estrategia de pruebas organizacional 2026', 'Organisational test strategy 2026'),
      ],
    },
    scope: {
      testItems: [
        'Web checkout (React) v2.0',
        'Payments API v1.4',
        L('Integración con pasarela de pagos (sandbox)', 'Payment gateway integration (sandbox)'),
      ],
      inScope: [
        L('Alta, edición y eliminación de productos en el carrito', 'Adding, editing and removing cart items'),
        L('Cálculo de envío por zona', 'Shipping cost by zone'),
        L('Pago con tarjeta de crédito y débito', 'Credit and debit card payment'),
        L('Correo de confirmación de compra', 'Order confirmation email'),
      ],
      outOfScope: [
        L('Panel de administración: lo cubre otro equipo', 'Admin back office: covered by another team'),
        L('Pagos en cuotas: se libera en la fase 2', 'Instalment payments: released in phase 2'),
      ],
      assumptions: [
        L('El entorno de staging replica la configuración de producción', 'Staging mirrors the production configuration'),
        L('La pasarela de pagos provee tarjetas de prueba', 'The payment gateway provides test cards'),
      ],
      constraints: [
        L('Fecha de salida fija: no se puede extender la ventana de pruebas', 'Fixed release date: the test window cannot be extended'),
        L('Un único entorno de staging compartido con otros equipos', 'A single staging environment shared with other teams'),
      ],
    },
    stakeholders: [
      { id: uid(), name: 'Laura Pérez', role: 'Product Owner', interest: L('Priorizar y aceptar las funcionalidades', 'Prioritise and accept features') },
      { id: uid(), name: 'Diego Silva', role: 'Tech Lead', interest: L('Calidad técnica y corrección de defectos', 'Technical quality and defect fixing') },
      { id: uid(), name: 'Carla Núñez', role: 'QA Lead', interest: L('Planificar, ejecutar e informar las pruebas', 'Plan, run and report testing') },
    ],
    communication: [
      { id: uid(), what: L('Avance de ejecución y defectos', 'Execution progress and defects'), audience: L('Equipo del proyecto', 'Project team'), channel: 'Daily / Slack', frequency: L('Diaria', 'Daily') },
      { id: uid(), what: L('Informe de estado de pruebas', 'Test status report'), audience: 'PO, Tech Lead', channel: 'Email', frequency: L('Semanal', 'Weekly') },
      { id: uid(), what: L('Informe de cierre', 'Test completion report'), audience: L('Interesados', 'Stakeholders'), channel: 'Confluence', frequency: L('Al cierre', 'At closure') },
    ],
    risks: [
      { id: uid(), title: L('Cobros duplicados al reintentar un pago fallido', 'Duplicate charges when retrying a failed payment'), type: 'product', probability: 3, impact: 5, mitigation: L('Pruebas de idempotencia y de reintentos con la pasarela en sandbox', 'Idempotency and retry tests against the sandbox gateway'), owner: 'Diego Silva' },
      { id: uid(), title: L('Cálculo de envío incorrecto en zonas límite', 'Wrong shipping cost in boundary zones'), type: 'product', probability: 3, impact: 3, mitigation: L('Valores límite y tablas de decisión por zona', 'Boundary values and decision tables per zone'), owner: 'Carla Núñez' },
      { id: uid(), title: L('Exposición de datos de tarjeta en logs', 'Card data exposed in logs'), type: 'product', probability: 2, impact: 5, mitigation: L('Revisión de logs y prueba de seguridad PCI', 'Log review and PCI security testing'), owner: 'Diego Silva' },
      { id: uid(), title: L('Staging no disponible por uso de otros equipos', 'Staging unavailable due to other teams'), type: 'project', probability: 4, impact: 3, mitigation: L('Reservar franjas horarias y tener un entorno efímero de respaldo', 'Book time slots and keep an ephemeral backup environment'), owner: 'Tech Lead' },
      { id: uid(), title: L('Entrega tardía de historias por parte de desarrollo', 'Late delivery of stories by development'), type: 'project', probability: 3, impact: 2, mitigation: L('Priorizar casos por riesgo y probar en forma incremental', 'Prioritise cases by risk and test incrementally'), owner: 'Laura Pérez' },
    ],
    strategy: {
      approach: L(
        'Pruebas basadas en riesgos: los flujos de pago y de cálculo de montos se prueban primero y con mayor profundidad. Los escenarios críticos se automatizan para la regresión; el resto se cubre con pruebas manuales y sesiones exploratorias.',
        'Risk-based testing: payment and amount calculation flows are tested first and in more depth. Critical scenarios are automated for regression; the rest is covered by manual tests and exploratory sessions.',
      ),
      levels: ['integration', 'system', 'acceptance'],
      types: ['functional', 'regression', 'api', 'security', 'accessibility', 'exploratory'],
      techniques: ['equivalence', 'boundary', 'decisionTable', 'stateTransition', 'bdd', 'errorGuessing'],
      entryCriteria: [
        L('Historias con criterios de aceptación aprobados', 'Stories with approved acceptance criteria'),
        L('Build desplegado en staging y prueba de humo superada', 'Build deployed to staging and smoke test passed'),
      ],
      exitCriteria: [
        L('100 % de los casos de prioridad alta ejecutados', '100% of high-priority cases executed'),
        L('Sin defectos críticos ni bloqueantes abiertos', 'No open critical or blocker defects'),
        L('95 % de casos aprobados', '95% pass rate'),
      ],
      suspensionCriteria: [
        L('Falla la prueba de humo del build', 'The build smoke test fails'),
        L('Más del 30 % de los casos bloqueados por un mismo defecto', 'More than 30% of cases blocked by the same defect'),
      ],
      resumptionCriteria: [
        L('Nuevo build con la corrección y prueba de humo superada', 'New build with the fix and smoke test passed'),
      ],
      deliverables: ['plan', 'cases', 'defects', 'traceability', 'status', 'summary'],
      metrics: ['execution', 'passRate', 'coverage', 'density', 'leakage'],
      regression: L(
        'Cada corrección se re-prueba en el build siguiente. La suite automatizada de regresión corre en cada merge a la rama principal y antes de la salida a producción.',
        'Every fix is retested on the next build. The automated regression suite runs on every merge to main and before release.',
      ),
    },
    resources: {
      team: [
        { id: uid(), role: 'QA Lead', name: 'Carla Núñez', responsibilities: L('Planificación, seguimiento e informes', 'Planning, tracking and reporting') },
        { id: uid(), role: 'QA Analyst', name: 'Martín Rodríguez', responsibilities: L('Diseño y ejecución de casos manuales', 'Manual test design and execution') },
        { id: uid(), role: 'QA Automation', name: 'Sofía Méndez', responsibilities: L('Automatización de regresión y API', 'Regression and API automation') },
      ],
      training: [
        L('Uso del sandbox de la pasarela de pagos', 'Using the payment gateway sandbox'),
        L('Fundamentos de PCI DSS para el equipo de QA', 'PCI DSS basics for the QA team'),
      ],
      environments: [
        { id: uid(), name: 'Staging', description: L('Réplica de producción, base de datos anonimizada', 'Production replica, anonymised database') },
        { id: uid(), name: 'Sandbox', description: L('Pasarela de pagos en modo pruebas', 'Payment gateway in test mode') },
      ],
      tools: ['Jira', 'TestRail', 'Playwright', 'Postman', 'axe DevTools'],
      testData: [
        L('Tarjetas de prueba provistas por la pasarela (aprobadas, rechazadas, con 3DS)', 'Gateway test cards (approved, declined, 3DS)'),
        L('Usuarios con y sin direcciones guardadas', 'Users with and without saved addresses'),
      ],
    },
    schedule: {
      activities: [
        { id: uid(), name: L('Análisis y diseño de casos', 'Test analysis and design'), effort: '6', owner: 'Martín Rodríguez' },
        { id: uid(), name: L('Automatización de regresión', 'Regression automation'), effort: '8', owner: 'Sofía Méndez' },
        { id: uid(), name: L('Ejecución y reporte de defectos', 'Execution and defect reporting'), effort: '10', owner: L('Equipo QA', 'QA team') },
        { id: uid(), name: L('Informe de cierre', 'Completion report'), effort: '1', owner: 'Carla Núñez' },
      ],
      milestones: [
        { id: uid(), name: L('Plan aprobado', 'Plan approved'), date: '2026-12-01' },
        { id: uid(), name: L('Fin de la ejecución', 'Execution complete'), date: '2026-12-18' },
        { id: uid(), name: L('Salida a producción', 'Go-live'), date: '2026-12-22' },
      ],
      approvals: [
        { id: uid(), name: 'Laura Pérez', role: 'Product Owner' },
        { id: uid(), name: 'Diego Silva', role: 'Tech Lead' },
      ],
    },
  }
}

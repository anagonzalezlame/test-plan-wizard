export const STEP_IDS = [
  'start',
  'scope',
  'stakeholders',
  'risks',
  'strategy',
  'resources',
  'schedule',
  'review',
] as const

export type StepId = (typeof STEP_IDS)[number]

export const stepIndex = (id: StepId) => STEP_IDS.indexOf(id)

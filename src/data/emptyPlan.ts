import type { Plan } from '../types/plan'

export function emptyPlan(): Plan {
  return {
    standard: 'iso29119',
    meta: {
      projectName: '',
      identifier: '',
      version: '1.0',
      date: new Date().toISOString().slice(0, 10),
      author: '',
      organization: '',
      purpose: '',
      references: [],
    },
    scope: { testItems: [], inScope: [], outOfScope: [], assumptions: [], constraints: [] },
    stakeholders: [],
    communication: [],
    risks: [],
    strategy: {
      approach: '',
      levels: [],
      types: [],
      techniques: [],
      entryCriteria: [],
      exitCriteria: [],
      suspensionCriteria: [],
      resumptionCriteria: [],
      deliverables: [],
      metrics: [],
      regression: '',
    },
    resources: { team: [], training: [], environments: [], tools: [], testData: [] },
    schedule: { activities: [], milestones: [], approvals: [] },
  }
}

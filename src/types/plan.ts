export type Lang = 'es' | 'en'
export type Standard = 'iso29119' | 'ieee829'
export type RiskType = 'product' | 'project'

export interface Meta {
  projectName: string
  identifier: string
  version: string
  date: string
  author: string
  organization: string
  purpose: string
  references: string[]
}

export interface Scope {
  testItems: string[]
  inScope: string[]
  outOfScope: string[]
  assumptions: string[]
  constraints: string[]
}

export interface Stakeholder {
  id: string
  name: string
  role: string
  interest: string
}

export interface CommItem {
  id: string
  what: string
  audience: string
  channel: string
  frequency: string
}

export interface Risk {
  id: string
  title: string
  type: RiskType
  probability: number
  impact: number
  mitigation: string
  owner: string
}

export interface Strategy {
  approach: string
  levels: string[]
  types: string[]
  techniques: string[]
  entryCriteria: string[]
  exitCriteria: string[]
  suspensionCriteria: string[]
  resumptionCriteria: string[]
  deliverables: string[]
  metrics: string[]
  regression: string
}

export interface TeamMember {
  id: string
  role: string
  name: string
  responsibilities: string
}

export interface Environment {
  id: string
  name: string
  description: string
}

export interface Resources {
  team: TeamMember[]
  training: string[]
  environments: Environment[]
  tools: string[]
  testData: string[]
}

export interface Activity {
  id: string
  name: string
  effort: string
  owner: string
}

export interface Milestone {
  id: string
  name: string
  date: string
}

export interface Approval {
  id: string
  name: string
  role: string
}

export interface Schedule {
  activities: Activity[]
  milestones: Milestone[]
  approvals: Approval[]
}

export interface Plan {
  standard: Standard
  meta: Meta
  scope: Scope
  stakeholders: Stakeholder[]
  communication: CommItem[]
  risks: Risk[]
  strategy: Strategy
  resources: Resources
  schedule: Schedule
}

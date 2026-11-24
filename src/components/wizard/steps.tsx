import type { ComponentType } from 'react'
import { STEP_IDS, type StepId } from '../../lib/steps'
import { isStartValid } from '../../lib/navigation'
import type { Plan } from '../../types/plan'
import { ReviewStep } from '../steps/ReviewStep'
import { RisksStep } from '../steps/RisksStep'
import { ResourcesStep, ScheduleStep, ScopeStep, StakeholdersStep, StrategyStep } from '../steps/SimpleSteps'
import { StartStep } from '../steps/StartStep'
import type { Section } from '../../templates'

export const STEP_COMPONENTS: Record<StepId, ComponentType> = {
  start: StartStep,
  scope: ScopeStep,
  stakeholders: StakeholdersStep,
  risks: RisksStep,
  strategy: StrategyStep,
  resources: ResourcesStep,
  schedule: ScheduleStep,
  review: ReviewStep,
}

export type StepStatus = 'done' | 'partial' | 'empty'

/** Status of each wizard step, derived from the sections it feeds in the document. */
export function stepStatuses(plan: Plan, sections: Section[]): Record<StepId, StepStatus> {
  const result = {} as Record<StepId, StepStatus>
  for (const id of STEP_IDS) {
    const own = sections.filter((s) => s.step === id && !s.container)
    const filled = own.filter((s) => s.blocks.length > 0).length
    let status: StepStatus = filled === 0 ? 'empty' : filled === own.length ? 'done' : 'partial'
    if (id === 'start') status = isStartValid(plan) ? (status === 'empty' ? 'partial' : status) : 'empty'
    if (id === 'review') status = 'empty'
    result[id] = status
  }
  return result
}

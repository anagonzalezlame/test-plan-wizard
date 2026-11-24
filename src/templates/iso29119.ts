import { heading, list, section, text } from './blocks'
import {
  activityTable,
  approvalTable,
  communicationTable,
  environmentTable,
  milestoneTable,
  riskTable,
  stakeholderTable,
  teamTable,
  type Ctx,
} from './common'
import type { Section } from './types'

/** ISO/IEC/IEEE 29119-3:2021 — Test Plan outline. */
export function buildIso29119(c: Ctx): Section[] {
  const { plan, d, labels } = c
  const { meta, scope, strategy: s, resources: r } = plan
  const t = d.iso

  return [
    heading('intro', t.intro, 'start'),
    section('intro.scope', t.scope, 'start', text(meta.purpose)),
    section('intro.refs', t.references, 'start', list(meta.references)),

    heading('context', t.context, 'scope'),
    section('context.items', t.testItems, 'scope', list(scope.testItems)),
    section('context.scope', t.testScope, 'scope', [
      ...list(scope.inScope, d.l.inScope),
      ...list(scope.outOfScope, d.l.outOfScope),
    ]),
    section('context.assumptions', t.assumptions, 'scope', [
      ...list(scope.assumptions, d.l.assumptions),
      ...list(scope.constraints, d.l.constraints),
    ]),
    section('context.stakeholders', t.stakeholders, 'stakeholders', stakeholderTable(c)),

    section('communication', t.communication, 'stakeholders', communicationTable(c), 1),

    heading('risks', t.riskRegister, 'risks'),
    section('risks.product', t.productRisks, 'risks', riskTable(c, 'product')),
    section('risks.project', t.projectRisks, 'risks', riskTable(c, 'project')),

    heading('strategy', t.strategy, 'strategy'),
    section('strategy.subprocesses', t.subprocesses, 'strategy', [
      ...text(s.approach),
      ...list(labels('levels', s.levels), d.l.levels),
      ...list(labels('types', s.types), d.l.types),
    ]),
    section('strategy.deliverables', t.deliverables, 'strategy', list(labels('deliverables', s.deliverables))),
    section('strategy.techniques', t.techniques, 'strategy', list(labels('techniques', s.techniques))),
    section('strategy.completion', t.completion, 'strategy', [
      ...list(s.entryCriteria, d.l.entry),
      ...list(s.exitCriteria, d.l.exit),
    ]),
    section('strategy.metrics', t.metrics, 'strategy', list(labels('metrics', s.metrics))),
    section('strategy.data', t.testData, 'resources', list(r.testData)),
    section('strategy.environment', t.environment, 'resources', [
      ...environmentTable(c),
      ...list(r.tools, d.l.tools),
    ]),
    section('strategy.regression', t.regression, 'strategy', text(s.regression)),
    section('strategy.suspension', t.suspension, 'strategy', [
      ...list(s.suspensionCriteria, d.l.suspension),
      ...list(s.resumptionCriteria, d.l.resumption),
    ]),

    section('activities', t.activities, 'schedule', activityTable(c), 1),

    heading('staffing', t.staffing, 'resources'),
    section('staffing.roles', t.roles, 'resources', teamTable(c)),
    section('staffing.training', t.training, 'resources', list(r.training)),

    section('schedule', t.schedule, 'schedule', milestoneTable(c), 1),
    section('approvals', t.approvals, 'schedule', approvalTable(c), 1),
  ]
}

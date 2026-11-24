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

/** IEEE 829-2008 — Level Test Plan (LTP) outline. */
export function buildIeee829(c: Ctx): Section[] {
  const { plan, d, labels } = c
  const { meta, scope, strategy: s, resources: r } = plan
  const t = d.ieee
  const docId = [meta.identifier.trim(), meta.version.trim() && `${d.version} ${meta.version.trim()}`]
    .filter(Boolean)
    .join(' — ')

  return [
    heading('intro', t.intro, 'start'),
    section('intro.id', t.docId, 'start', text(docId)),
    section('intro.scope', t.scope, 'start', text(meta.purpose)),
    section('intro.refs', t.references, 'start', list(meta.references)),
    section('intro.level', t.levelInSequence, 'strategy', list(labels('levels', s.levels))),
    section('intro.classes', t.classes, 'strategy', [
      ...list(labels('types', s.types), d.l.types),
      ...list(scope.assumptions, d.l.assumptions),
      ...list(scope.constraints, d.l.constraints),
    ]),

    heading('details', t.details, 'scope'),
    section('details.items', t.testItems, 'scope', list(scope.testItems)),
    section('details.features', t.features, 'scope', list(scope.inScope)),
    section('details.notFeatures', t.notFeatures, 'scope', list(scope.outOfScope)),
    section('details.approach', t.approach, 'strategy', [
      ...text(s.approach),
      ...list(labels('techniques', s.techniques), d.l.techniques),
      ...list(s.entryCriteria, d.l.entry),
      ...text(s.regression, d.l.regression),
    ]),
    section('details.passFail', t.passFail, 'strategy', list(s.exitCriteria)),
    section('details.suspension', t.suspension, 'strategy', [
      ...list(s.suspensionCriteria, d.l.suspension),
      ...list(s.resumptionCriteria, d.l.resumption),
    ]),
    section('details.deliverables', t.deliverables, 'strategy', list(labels('deliverables', s.deliverables))),

    heading('management', t.management, 'schedule'),
    section('management.activities', t.activities, 'schedule', activityTable(c)),
    section('management.environment', t.environment, 'resources', [
      ...environmentTable(c),
      ...list(r.tools, d.l.tools),
      ...list(r.testData, d.l.testData),
    ]),
    section('management.responsibilities', t.responsibilities, 'resources', teamTable(c)),
    section('management.interfaces', t.interfaces, 'stakeholders', [
      ...stakeholderTable(c, d.l.stakeholders),
      ...communicationTable(c, d.l.communication),
    ]),
    section('management.training', t.training, 'resources', list(r.training)),
    section('management.schedule', t.schedule, 'schedule', milestoneTable(c)),
    section('management.risks', t.risks, 'risks', riskTable(c)),

    heading('general', t.general, 'strategy'),
    section('general.metrics', t.metrics, 'strategy', list(labels('metrics', s.metrics))),
    section('general.approvals', t.approvals, 'schedule', approvalTable(c)),
  ]
}

import { useT } from '../../hooks/useT'
import { totalEffort } from '../../lib/effort'
import { newId } from '../../lib/id'
import { usePlan, usePlanStore } from '../../store/planStore'
import type { Strategy } from '../../types/plan'
import { ChipSelect } from '../ui/ChipSelect'
import { Field, Panel, TextArea } from '../ui/Field'
import { ListField } from '../ui/ListField'
import { RowsEditor } from '../ui/RowsEditor'

const store = () => usePlanStore.getState()

export function ScopeStep() {
  const t = useT()
  const { scope } = usePlan()
  const set = (key: keyof typeof scope) => (items: string[]) => store().patch('scope', { [key]: items })

  return (
    <div className="space-y-6">
      <Panel>
        <ListField label={t.scope.testItems} hint={t.scope.testItemsHint} items={scope.testItems} onChange={set('testItems')} />
      </Panel>
      <Panel>
        <ListField label={t.scope.inScope} items={scope.inScope} onChange={set('inScope')} />
        <ListField label={t.scope.outOfScope} hint={t.scope.outOfScopeHint} items={scope.outOfScope} onChange={set('outOfScope')} />
      </Panel>
      <Panel>
        <ListField label={t.scope.assumptions} items={scope.assumptions} onChange={set('assumptions')} />
        <ListField label={t.scope.constraints} items={scope.constraints} onChange={set('constraints')} />
      </Panel>
    </div>
  )
}

export function StakeholdersStep() {
  const t = useT()
  const plan = usePlan()
  const s = t.stakeholders

  return (
    <div className="space-y-6">
      <Panel>
        <RowsEditor
          label={s.title}
          rows={plan.stakeholders}
          onChange={(rows) => store().setPlan('stakeholders', rows)}
          newRow={() => ({ id: newId(), name: '', role: '', interest: '' })}
          addLabel={s.add}
          columns={[
            { key: 'name', label: s.name },
            { key: 'role', label: s.role },
            { key: 'interest', label: s.interest, width: 1.6 },
          ]}
        />
      </Panel>
      <Panel>
        <RowsEditor
          label={s.commTitle}
          rows={plan.communication}
          onChange={(rows) => store().setPlan('communication', rows)}
          newRow={() => ({ id: newId(), what: '', audience: '', channel: '', frequency: '' })}
          addLabel={s.addComm}
          columns={[
            { key: 'what', label: s.what, width: 1.6 },
            { key: 'audience', label: s.audience },
            { key: 'channel', label: s.channel },
            { key: 'frequency', label: s.frequency },
          ]}
        />
      </Panel>
    </div>
  )
}

export function StrategyStep() {
  const t = useT()
  const { strategy } = usePlan()
  const s = t.strategy
  const set = <K extends keyof Strategy>(key: K) => (value: Strategy[K]) => store().patch('strategy', { [key]: value })

  return (
    <div className="space-y-6">
      <Panel>
        <Field id="strategy-approach" label={s.approach} hint={s.approachHint}>
          <TextArea
            id="strategy-approach"
            rows={4}
            aria-describedby="strategy-approach-hint"
            value={strategy.approach}
            onChange={(e) => set('approach')(e.target.value)}
          />
        </Field>
        <ChipSelect label={s.levels} catalog="levels" values={strategy.levels} onChange={set('levels')} />
        <ChipSelect label={s.types} catalog="types" values={strategy.types} onChange={set('types')} />
        <ChipSelect label={s.techniques} catalog="techniques" values={strategy.techniques} onChange={set('techniques')} />
      </Panel>
      <Panel>
        <ListField label={s.entryCriteria} items={strategy.entryCriteria} onChange={set('entryCriteria')} />
        <ListField label={s.exitCriteria} items={strategy.exitCriteria} onChange={set('exitCriteria')} />
        <ListField label={s.suspensionCriteria} items={strategy.suspensionCriteria} onChange={set('suspensionCriteria')} />
        <ListField label={s.resumptionCriteria} items={strategy.resumptionCriteria} onChange={set('resumptionCriteria')} />
      </Panel>
      <Panel>
        <ChipSelect label={s.deliverables} catalog="deliverables" values={strategy.deliverables} onChange={set('deliverables')} />
        <ChipSelect label={s.metrics} catalog="metrics" values={strategy.metrics} onChange={set('metrics')} />
        <Field id="strategy-regression" label={s.regression} hint={s.regressionHint}>
          <TextArea
            id="strategy-regression"
            aria-describedby="strategy-regression-hint"
            value={strategy.regression}
            onChange={(e) => set('regression')(e.target.value)}
          />
        </Field>
      </Panel>
    </div>
  )
}

export function ResourcesStep() {
  const t = useT()
  const { resources } = usePlan()
  const r = t.resources

  return (
    <div className="space-y-6">
      <Panel>
        <RowsEditor
          label={r.team}
          rows={resources.team}
          onChange={(team) => store().patch('resources', { team })}
          newRow={() => ({ id: newId(), role: '', name: '', responsibilities: '' })}
          addLabel={r.addMember}
          columns={[
            { key: 'role', label: r.role },
            { key: 'name', label: r.name },
            { key: 'responsibilities', label: r.responsibilities, width: 1.6 },
          ]}
        />
        <ListField label={r.training} items={resources.training} onChange={(training) => store().patch('resources', { training })} />
      </Panel>
      <Panel>
        <RowsEditor
          label={r.environments}
          rows={resources.environments}
          onChange={(environments) => store().patch('resources', { environments })}
          newRow={() => ({ id: newId(), name: '', description: '' })}
          addLabel={r.addEnv}
          columns={[
            { key: 'name', label: r.envName },
            { key: 'description', label: r.envDesc, width: 2.5 },
          ]}
        />
        <ListField label={r.tools} items={resources.tools} onChange={(tools) => store().patch('resources', { tools })} />
        <ListField label={r.testData} items={resources.testData} onChange={(testData) => store().patch('resources', { testData })} />
      </Panel>
    </div>
  )
}

export function ScheduleStep() {
  const t = useT()
  const { schedule } = usePlan()
  const s = t.schedule
  const total = totalEffort(schedule.activities)

  return (
    <div className="space-y-6">
      <Panel>
        <RowsEditor
          label={s.activities}
          rows={schedule.activities}
          onChange={(activities) => store().patch('schedule', { activities })}
          newRow={() => ({ id: newId(), name: '', effort: '', owner: '' })}
          addLabel={s.addActivity}
          footer={total > 0 ? s.totalEffort(total) : undefined}
          columns={[
            { key: 'name', label: s.activity, width: 2 },
            { key: 'effort', label: s.effort, type: 'number' },
            { key: 'owner', label: s.owner },
          ]}
        />
      </Panel>
      <Panel>
        <RowsEditor
          label={s.milestones}
          rows={schedule.milestones}
          onChange={(milestones) => store().patch('schedule', { milestones })}
          newRow={() => ({ id: newId(), name: '', date: '' })}
          addLabel={s.addMilestone}
          columns={[
            { key: 'name', label: s.milestone, width: 2 },
            { key: 'date', label: s.date, type: 'date' },
          ]}
        />
      </Panel>
      <Panel>
        <RowsEditor
          label={s.approvals}
          rows={schedule.approvals}
          onChange={(approvals) => store().patch('schedule', { approvals })}
          newRow={() => ({ id: newId(), name: '', role: '' })}
          addLabel={s.addApproval}
          columns={[
            { key: 'name', label: s.approver },
            { key: 'role', label: s.approverRole },
          ]}
        />
      </Panel>
    </div>
  )
}

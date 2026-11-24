import { Pencil, Plus, ShieldAlert, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useT } from '../../hooks/useT'
import { cn } from '../../lib/cn'
import { newId } from '../../lib/id'
import { rankedRisks, riskLevel } from '../../lib/risk'
import type { RiskForm as RiskValues, RiskFormInput } from '../../schemas/planSchema'
import { usePlan, usePlanStore } from '../../store/planStore'
import { RiskForm } from '../risk/RiskForm'
import { RiskMatrix } from '../risk/RiskMatrix'
import { levelBadge } from '../risk/riskStyles'
import { Button, IconButton } from '../ui/Button'
import { Panel } from '../ui/Field'

type Cell = { probability: number; impact: number }
type Editing = { id: string | null; initial: RiskFormInput; key: number }

const blank = (cell: Cell): RiskFormInput => ({
  title: '',
  type: 'product',
  probability: cell.probability,
  impact: cell.impact,
  mitigation: '',
  owner: '',
})

export function RisksStep() {
  const t = useT()
  const r = t.risks
  const { risks } = usePlan()
  const setRisks = (next: typeof risks) => usePlanStore.getState().setPlan('risks', next)

  const [editing, setEditing] = useState<Editing | null>(null)
  const [cell, setCell] = useState<Cell | undefined>()

  const startNew = (c: Cell = { probability: 3, impact: 3 }) => {
    setCell(c)
    setEditing({ id: null, initial: blank(c), key: Date.now() })
  }

  const onMatrixSelect = (probability: number, impact: number) => {
    if (editing) setCell({ probability, impact })
    else startNew({ probability, impact })
  }

  const save = (values: RiskValues) => {
    if (editing?.id) setRisks(risks.map((x) => (x.id === editing.id ? { ...x, ...values } : x)))
    else setRisks([...risks, { id: newId(), ...values }])
    setEditing(null)
    setCell(undefined)
  }

  const ranked = rankedRisks(risks)

  return (
    <div className="space-y-6">
      <Panel title={r.matrixTitle} description={r.matrixHint}>
        <div className="@container">
          <div className="grid gap-6 @2xl:grid-cols-[minmax(0,18rem)_1fr]">
          <RiskMatrix risks={risks} selected={editing ? cell : undefined} onSelect={onMatrixSelect} />
          {editing ? (
            <RiskForm
              key={editing.key}
              initial={editing.initial}
              isNew={!editing.id}
              cell={cell}
              onCellChange={setCell}
              onSave={save}
              onCancel={() => {
                setEditing(null)
                setCell(undefined)
              }}
            />
          ) : (
            <div className="flex flex-col items-start justify-center gap-3 rounded-lg border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
              <ShieldAlert aria-hidden="true" className="size-6 text-neutral-400" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{risks.length ? r.matrixHint : r.empty}</p>
              <Button variant="primary" size="sm" onClick={() => startNew()}>
                <Plus aria-hidden="true" className="size-3.5" />
                {r.add}
              </Button>
            </div>
          )}
          </div>
        </div>
      </Panel>

      {ranked.length > 0 && (
        <ul className="space-y-2" aria-label={t.steps.risks.title}>
          {ranked.map(({ risk, code, score }) => {
            const level = riskLevel(score)
            return (
              <li
                key={risk.id}
                className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <span className="mt-0.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">{code}</span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium">{risk.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className={cn('rounded-full px-2 py-0.5 font-medium ring-1 ring-inset', levelBadge[level])}>
                      {r.level[level]} · {score}
                    </span>
                    <span>{r[risk.type]}</span>
                    {risk.owner && <span>· {risk.owner}</span>}
                  </div>
                  {risk.mitigation && (
                    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{risk.mitigation}</p>
                  )}
                </div>
                <div className="flex shrink-0">
                  <IconButton
                    label={`${r.edit}: ${code}`}
                    onClick={() => {
                      setCell({ probability: risk.probability, impact: risk.impact })
                      setEditing({ id: risk.id, initial: { ...risk }, key: Date.now() })
                    }}
                  >
                    <Pencil className="size-4" />
                  </IconButton>
                  <IconButton label={`${r.delete}: ${code}`} onClick={() => setRisks(risks.filter((x) => x.id !== risk.id))}>
                    <Trash2 className="size-4" />
                  </IconButton>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

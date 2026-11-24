import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useT } from '../../hooks/useT'
import { cn } from '../../lib/cn'
import { riskLevel } from '../../lib/risk'
import { riskFormSchema, type RiskForm as RiskValues, type RiskFormInput } from '../../schemas/planSchema'
import { Button } from '../ui/Button'
import { Field, TextArea, TextInput } from '../ui/Field'
import { describedBy, inputClass } from '../ui/styles'
import { levelBadge } from './riskStyles'

interface RiskFormProps {
  initial: RiskFormInput
  isNew: boolean
  /** Cell picked on the matrix while the form is open. */
  cell?: { probability: number; impact: number }
  onCellChange: (cell: { probability: number; impact: number }) => void
  onSave: (values: RiskValues) => void
  onCancel: () => void
}

export function RiskForm({ initial, isNew, cell, onCellChange, onSave, onCancel }: RiskFormProps) {
  const t = useT()
  const r = t.risks
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RiskFormInput, unknown, RiskValues>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: initial,
  })

  useEffect(() => {
    if (!cell) return
    setValue('probability', cell.probability)
    setValue('impact', cell.impact)
  }, [cell, setValue])

  const probability = Number(useWatch({ control, name: 'probability' }))
  const impact = Number(useWatch({ control, name: 'impact' }))
  const level = riskLevel(probability * impact)
  const titleError = errors.title ? t.errors.required : undefined

  const scaleSelect = (name: 'probability' | 'impact', labels: string[]) => (
    <Field id={`risk-${name}`} label={name === 'probability' ? r.probability : r.impact}>
      <select
        id={`risk-${name}`}
        className={inputClass}
        {...register(name, {
          onChange: (e) => {
            const v = Number(e.target.value)
            onCellChange(name === 'probability' ? { probability: v, impact } : { probability, impact: v })
          },
        })}
      >
        {labels.map((label, i) => (
          <option key={label} value={i + 1}>
            {i + 1} · {label}
          </option>
        ))}
      </select>
    </Field>
  )

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSave)}
      aria-label={isNew ? r.newRisk : r.editRisk}
      className="space-y-4 rounded-lg border border-neutral-300 p-4 dark:border-neutral-700"
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold">{isNew ? r.newRisk : r.editRisk}</h4>
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', levelBadge[level])}>
          {r.level[level]} · {probability * impact}
        </span>
      </div>

      <Field id="risk-title" label={r.title} error={titleError} required>
        <TextInput
          id="risk-title"
          autoFocus
          aria-invalid={!!titleError}
          aria-required
          aria-describedby={describedBy('risk-title', undefined, titleError)}
          {...register('title')}
        />
      </Field>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">{r.type}</legend>
        <div className="flex gap-4 text-sm">
          {(['product', 'project'] as const).map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input type="radio" value={type} className="accent-neutral-900 dark:accent-neutral-100" {...register('type')} />
              {r[type]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        {scaleSelect('probability', r.probabilityLevels)}
        {scaleSelect('impact', r.impactLevels)}
      </div>

      <Field id="risk-mitigation" label={r.mitigation}>
        <TextArea id="risk-mitigation" rows={2} {...register('mitigation')} />
      </Field>
      <Field id="risk-owner" label={r.owner}>
        <TextInput id="risk-owner" {...register('owner')} />
      </Field>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          {r.cancel}
        </Button>
        <Button type="submit" variant="primary">
          {r.save}
        </Button>
      </div>
    </form>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useT } from '../../hooks/useT'
import { cn } from '../../lib/cn'
import { metaFormSchema, type MetaForm } from '../../schemas/planSchema'
import { usePlan, usePlanStore } from '../../store/planStore'
import type { Standard } from '../../types/plan'
import { Field, Panel, TextArea, TextInput } from '../ui/Field'
import { describedBy } from '../ui/styles'
import { ListField } from '../ui/ListField'

export function StartStep() {
  const t = useT()
  const plan = usePlan()
  const { patch, setPlan } = usePlanStore.getState()
  const validationTick = usePlanStore((s) => s.validationTick)
  const { references, ...metaDefaults } = plan.meta

  const {
    register,
    subscribe,
    trigger,
    formState: { errors },
  } = useForm<MetaForm>({
    resolver: zodResolver(metaFormSchema),
    defaultValues: metaDefaults,
    mode: 'onTouched',
  })

  // Keep the store in sync on every keystroke (autosave).
  useEffect(() => {
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => patch('meta', values as Partial<MetaForm>),
    })
  }, [subscribe, patch])

  // Navigation was blocked: reveal the errors.
  useEffect(() => {
    if (validationTick > 0) void trigger(undefined, { shouldFocus: true })
  }, [validationTick, trigger])

  const err = (key: keyof MetaForm) => (errors[key]?.message ? t.errors.required : undefined)

  const standards: { id: Standard; name: string; desc: string }[] = [
    { id: 'iso29119', ...t.start.iso },
    { id: 'ieee829', ...t.start.ieee },
  ]

  const text = (key: keyof MetaForm, label: string, opts: { hint?: string; required?: boolean; type?: string } = {}) => {
    const id = `meta-${key}`
    const error = err(key)
    return (
      <Field id={id} label={label} hint={opts.hint} error={error} required={opts.required}>
        <TextInput
          id={id}
          type={opts.type ?? 'text'}
          aria-invalid={!!error}
          aria-required={opts.required}
          aria-describedby={describedBy(id, opts.hint, error)}
          {...register(key)}
        />
      </Field>
    )
  }

  return (
    <div className="space-y-6">
      <Panel title={t.start.standard}>
        <div role="radiogroup" aria-label={t.start.standard} className="grid gap-3 sm:grid-cols-2">
          {standards.map((s) => {
            const on = plan.standard === s.id
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPlan('standard', s.id)}
                className={cn(
                  'rounded-lg border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100',
                  on
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                    : 'border-neutral-300 hover:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-500',
                )}
              >
                <span className="block font-mono text-sm font-medium">{s.name}</span>
                <span className={cn('mt-1.5 block text-xs leading-relaxed', on ? 'opacity-80' : 'text-neutral-500 dark:text-neutral-400')}>
                  {s.desc}
                </span>
              </button>
            )
          })}
        </div>
      </Panel>

      <Panel title={t.start.general}>
        <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {text('projectName', t.start.projectName, { required: true })}
          <div className="grid gap-5 sm:grid-cols-3">
            {text('identifier', t.start.identifier, { hint: t.start.identifierHint })}
            {text('version', t.start.version)}
            {text('date', t.start.date, { type: 'date' })}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {text('author', t.start.author, { required: true })}
            {text('organization', t.start.organization)}
          </div>
          <Field id="meta-purpose" label={t.start.purpose} hint={t.start.purposeHint}>
            <TextArea id="meta-purpose" aria-describedby="meta-purpose-hint" {...register('purpose')} />
          </Field>
        </form>
        <ListField
          label={t.start.references}
          hint={t.start.referencesHint}
          items={references}
          onChange={(items) => patch('meta', { references: items })}
        />
      </Panel>
    </div>
  )
}

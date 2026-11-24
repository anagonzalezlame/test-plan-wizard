import { Check } from 'lucide-react'
import { useDocument } from '../../hooks/useDocument'
import { useT } from '../../hooks/useT'
import { cn } from '../../lib/cn'
import { STEP_IDS } from '../../lib/steps'
import { usePlanStore } from '../../store/planStore'
import { goToStep } from '../../lib/navigation'
import { stepStatuses } from './steps'

export function Stepper() {
  const t = useT()
  const step = usePlanStore((s) => s.step)
  const plan = usePlanStore((s) => s.plan)
  const { doc } = useDocument()
  const statuses = stepStatuses(plan, doc.sections)

  return (
    <nav aria-label={t.appName}>
      <ol className="relative space-y-1">
        {STEP_IDS.map((id, i) => {
          const current = i === step
          const status = statuses[id]
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => goToStep(i)}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  'group flex w-full items-start gap-3 rounded-md px-2.5 py-2 text-left transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100',
                  current ? 'bg-white shadow-xs ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900/60',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] font-medium',
                    status === 'done'
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                      : current
                        ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                        : 'border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400',
                  )}
                >
                  {status === 'done' ? <Check aria-hidden="true" className="size-3.5" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn('block text-sm', current ? 'font-semibold' : 'font-medium text-neutral-700 dark:text-neutral-300')}>
                    {t.steps[id].title}
                  </span>
                  <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{t.steps[id].desc}</span>
                </span>
                {status === 'done' && <span className="sr-only">✓</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function MobileProgress() {
  const t = useT()
  const step = usePlanStore((s) => s.step)
  const total = STEP_IDS.length
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>{t.stepOf(step + 1, total)}</span>
        <span>{t.steps[STEP_IDS[step]].title}</span>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {STEP_IDS.map((id, i) => (
          <span
            key={id}
            className={cn('h-1 flex-1 rounded-full', i <= step ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-800')}
          />
        ))}
      </div>
    </div>
  )
}

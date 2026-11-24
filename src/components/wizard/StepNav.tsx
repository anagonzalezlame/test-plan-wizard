import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useT } from '../../hooks/useT'
import { STEP_IDS } from '../../lib/steps'
import { usePlanStore } from '../../store/planStore'
import { Button } from '../ui/Button'
import { goToStep } from '../../lib/navigation'

export function StepNav() {
  const t = useT()
  const step = usePlanStore((s) => s.step)
  const last = STEP_IDS.length - 1

  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
      <Button variant="ghost" onClick={() => goToStep(step - 1)} disabled={step === 0}>
        <ChevronLeft aria-hidden="true" className="size-4" />
        {t.back}
      </Button>
      <p className="hidden text-xs text-neutral-400 sm:block">{t.autosave}</p>
      {step < last && (
        <Button variant="primary" onClick={() => goToStep(step + 1)}>
          {t.next}
          <span className="hidden sm:inline">: {t.steps[STEP_IDS[step + 1]].title}</span>
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      )}
    </div>
  )
}

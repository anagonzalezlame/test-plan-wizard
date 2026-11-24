import { metaFormSchema } from '../schemas/planSchema'
import { usePlanStore } from '../store/planStore'
import type { Plan } from '../types/plan'

export const isStartValid = (plan: Plan) => metaFormSchema.safeParse(plan.meta).success

/** Moves to a step, unless the mandatory start data is missing. */
export function goToStep(index: number) {
  const { plan, setStep, requestValidation } = usePlanStore.getState()
  if (index > 0 && !isStartValid(plan)) {
    setStep(0)
    requestValidation()
    return
  }
  setStep(index)
}

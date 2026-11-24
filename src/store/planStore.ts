import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { emptyPlan } from '../data/emptyPlan'
import { samplePlan } from '../data/samplePlan'
import { STEP_IDS } from '../lib/steps'
import type { Lang, Plan } from '../types/plan'

type Theme = 'light' | 'dark'
type ObjectKeys = 'meta' | 'scope' | 'strategy' | 'resources' | 'schedule'

export interface PlanState {
  plan: Plan
  step: number
  uiLang: Lang
  docLang: Lang
  theme: Theme
  /** Bumped when the whole plan is replaced so uncontrolled forms remount. */
  revision: number
  /** Bumped when navigation is blocked so the current step shows its errors. */
  validationTick: number

  setStep: (step: number) => void
  setPlan: <K extends keyof Plan>(key: K, value: Plan[K]) => void
  patch: <K extends ObjectKeys>(key: K, value: Partial<Plan[K]>) => void
  setUiLang: (lang: Lang) => void
  setDocLang: (lang: Lang) => void
  toggleTheme: () => void
  loadSample: () => void
  reset: () => void
  requestValidation: () => void
}

const initialTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const initialLang = (): Lang =>
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plan: emptyPlan(),
      step: 0,
      uiLang: initialLang(),
      docLang: initialLang(),
      theme: initialTheme(),
      revision: 0,
      validationTick: 0,

      setStep: (step) => set({ step: Math.max(0, Math.min(STEP_IDS.length - 1, step)) }),
      setPlan: (key, value) => set((s) => ({ plan: { ...s.plan, [key]: value } })),
      patch: (key, value) =>
        set((s) => ({ plan: { ...s.plan, [key]: { ...s.plan[key], ...value } } })),
      setUiLang: (uiLang) => set({ uiLang, docLang: uiLang }),
      setDocLang: (docLang) => set({ docLang }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      loadSample: () =>
        set((s) => ({ plan: samplePlan(s.uiLang), revision: s.revision + 1, step: 0 })),
      reset: () => set((s) => ({ plan: emptyPlan(), revision: s.revision + 1, step: 0 })),
      requestValidation: () => set((s) => ({ validationTick: s.validationTick + 1 })),
    }),
    {
      name: 'test-plan-wizard',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ plan, step, uiLang, docLang, theme }) => ({ plan, step, uiLang, docLang, theme }),
    },
  ),
)

export const usePlan = () => usePlanStore((s) => s.plan)

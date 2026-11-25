import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { DocumentPreview } from './components/preview/DocumentPreview'
import { Button } from './components/ui/Button'
import { Header } from './components/wizard/Header'
import { StepNav } from './components/wizard/StepNav'
import { MobileProgress, Stepper } from './components/wizard/Stepper'
import { STEP_COMPONENTS } from './components/wizard/steps'
import { useDocument } from './hooks/useDocument'
import { useT } from './hooks/useT'
import { cn } from './lib/cn'
import { STEP_IDS } from './lib/steps'
import { usePlanStore } from './store/planStore'

export default function App() {
  const t = useT()
  const step = usePlanStore((s) => s.step)
  const revision = usePlanStore((s) => s.revision)
  const theme = usePlanStore((s) => s.theme)
  const uiLang = usePlanStore((s) => s.uiLang)
  const isEmpty = usePlanStore((s) => !s.plan.meta.projectName.trim())
  const { doc } = useDocument()

  const [sidePreview, setSidePreview] = useState(true)
  // Mobile preview is tied to the step where it was opened, so it closes on navigation.
  const [mobilePreviewStep, setMobilePreviewStep] = useState<number | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const mobilePreview = mobilePreviewStep === step
  const id = STEP_IDS[step]
  const StepComponent = STEP_COMPONENTS[id]
  const isReview = id === 'review'
  const showSide = sidePreview && !isReview

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = uiLang
    document.title = t.appName
  }, [uiLang, t.appName])

  // On step change: back to top, move focus to the step title (screen readers announce it).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <Header />
      <div
        className={cn(
          'mx-auto grid print:hidden max-w-[96rem] gap-8 px-4 py-6 sm:px-6 lg:py-8',
          'lg:grid-cols-[15rem_minmax(0,1fr)]',
          showSide && 'xl:grid-cols-[15rem_minmax(0,1fr)_minmax(0,30rem)]',
        )}
      >
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-22">
            <Stepper />
          </div>
        </aside>

        <main className="min-w-0">
          <MobileProgress />

          <div className="mt-4 mb-6 flex items-start justify-between gap-4 lg:mt-0 print:hidden">
            <div>
              <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold outline-none">
                {t.steps[id].title}
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t.steps[id].desc}</p>
            </div>
            {!isReview && (
              <>
                <span className="xl:hidden">
                  <Button size="sm" onClick={() => setMobilePreviewStep(mobilePreview ? null : step)} aria-pressed={mobilePreview}>
                    {mobilePreview ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Eye aria-hidden="true" className="size-3.5" />}
                    {mobilePreview ? t.backToForm : t.showPreview}
                  </Button>
                </span>
                <span className="hidden xl:block">
                  <Button size="sm" onClick={() => setSidePreview((v) => !v)} aria-pressed={sidePreview}>
                    {sidePreview ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Eye aria-hidden="true" className="size-3.5" />}
                    {sidePreview ? t.hidePreview : t.showPreview}
                  </Button>
                </span>
              </>
            )}
          </div>

          {id === 'start' && isEmpty && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-sm dark:border-neutral-700">
              <span className="text-neutral-600 dark:text-neutral-300">{t.sampleHint}</span>
              <Button size="sm" onClick={usePlanStore.getState().loadSample}>
                <Sparkles aria-hidden="true" className="size-3.5" />
                {t.loadSample}
              </Button>
            </div>
          )}

          {mobilePreview ? (
            <DocumentPreview doc={doc} className="xl:hidden" />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={`${id}-${revision}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <StepComponent />
              </m.div>
            </AnimatePresence>
          )}

          <StepNav />
        </main>

        {showSide && (
          <aside aria-label={t.showPreview} className="hidden xl:block print:hidden">
            <div className="sticky top-22 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-lg">
              <DocumentPreview doc={doc} className="text-[0.8125rem]" />
            </div>
          </aside>
        )}
      </div>
      {/* Only visible when printing / saving as PDF */}
      <div className="hidden print:block">
        <DocumentPreview doc={doc} print />
      </div>
    </MotionConfig>
    </LazyMotion>
  )
}

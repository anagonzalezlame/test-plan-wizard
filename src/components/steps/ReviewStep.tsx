import { ArrowRight } from 'lucide-react'
import { useDocument } from '../../hooks/useDocument'
import { useT } from '../../hooks/useT'
import { stepIndex } from '../../lib/steps'
import { usePlanStore } from '../../store/planStore'
import { ExportBar } from '../export/ExportBar'
import { DocumentPreview } from '../preview/DocumentPreview'
import { Panel } from '../ui/Field'
import { LangSwitch } from '../ui/LangSwitch'

export function ReviewStep() {
  const t = useT()
  const { doc, stats } = useDocument()
  const docLang = usePlanStore((s) => s.docLang)
  const { setDocLang, setStep } = usePlanStore.getState()

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-48 flex-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{t.review.completeness}</span>
              <span className="font-mono">{stats.percent}%</span>
            </div>
            <div
              role="progressbar"
              aria-label={t.review.completeness}
              aria-valuenow={stats.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
            >
              <div
                className="h-full rounded-full bg-neutral-900 transition-[width] duration-500 dark:bg-neutral-100"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{t.review.sections(stats.done, stats.total)}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <span>{t.review.docLang}</span>
            <LangSwitch value={docLang} onChange={setDocLang} label={t.review.docLang} />
          </div>
        </div>

        {stats.missing.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-medium">{t.review.missing}</h3>
            <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              {stats.missing.map(({ number, section }) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => setStep(stepIndex(section.step))}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-neutral-900 dark:hover:bg-neutral-800/60 dark:focus-visible:outline-neutral-100"
                  >
                    <span className="w-8 font-mono text-xs text-neutral-400">{number}</span>
                    <span className="flex-1">{section.title}</span>
                    <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {t.steps[section.step].title}
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.review.allDone}</p>
        )}
      </Panel>

      <Panel>
        <ExportBar />
      </Panel>

      <DocumentPreview doc={doc} />
    </div>
  )
}

import { useMemo } from 'react'
import { completeness } from '../lib/completeness'
import { usePlanStore } from '../store/planStore'
import { buildDocument } from '../templates'

/** The generated document (in the selected document language) and its completeness. */
export function useDocument() {
  const plan = usePlanStore((s) => s.plan)
  const docLang = usePlanStore((s) => s.docLang)
  return useMemo(() => {
    const doc = buildDocument(plan, docLang)
    return { doc, stats: completeness(doc.sections) }
  }, [plan, docLang])
}

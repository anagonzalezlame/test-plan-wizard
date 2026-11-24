import { Check, Copy, Download, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDocument } from '../../hooks/useDocument'
import { useT } from '../../hooks/useT'
import { copyText, downloadText, fileBaseName, printDocument } from '../../lib/export'
import { toMarkdown } from '../../lib/markdown'
import { usePlanStore } from '../../store/planStore'
import { Button } from '../ui/Button'

type Status = { kind: 'copied' | 'copyError' | 'downloaded' | 'print'; at: number } | null

export function ExportBar() {
  const t = useT()
  const { doc } = useDocument()
  const plan = usePlanStore((s) => s.plan)
  const docLang = usePlanStore((s) => s.docLang)
  const [status, setStatus] = useState<Status>(null)
  const base = fileBaseName(plan, docLang)

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 4000)
    return () => clearTimeout(timer)
  }, [status])

  const copy = async () => {
    const ok = await copyText(toMarkdown(doc))
    setStatus({ kind: ok ? 'copied' : 'copyError', at: Date.now() })
  }

  const download = () => {
    downloadText(`${base}.md`, toMarkdown(doc))
    setStatus({ kind: 'downloaded', at: Date.now() })
  }

  const pdf = () => {
    setStatus({ kind: 'print', at: Date.now() })
    printDocument(base)
  }

  const message = status && t.export[status.kind](`${base}.md`)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t.export.title}</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={copy}>
          {status?.kind === 'copied' ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
          {t.export.copy}
        </Button>
        <Button onClick={download}>
          <Download aria-hidden="true" className="size-4" />
          {t.export.download}
        </Button>
        <Button onClick={pdf}>
          <Printer aria-hidden="true" className="size-4" />
          {t.export.pdf}
        </Button>
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-xs text-neutral-600 dark:text-neutral-300">
        {message}
      </p>
    </div>
  )
}

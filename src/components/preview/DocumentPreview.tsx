import { cn } from '../../lib/cn'
import { numberSections, type Block, type PlanDocument } from '../../templates'

function BlockView({ block }: { block: Block }) {
  const label = block.label && (
    <p className="mb-1 text-[0.8125rem] font-semibold text-neutral-800 dark:text-neutral-200">{block.label}</p>
  )
  switch (block.kind) {
    case 'text':
      return (
        <div>
          {label}
          <p className="whitespace-pre-line">{block.text}</p>
        </div>
      )
    case 'list':
      return (
        <div>
          {label}
          <ul className="list-disc space-y-0.5 pl-5 marker:text-neutral-400">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )
    case 'table':
      return (
        <div>
          {label}
          <div className="doc-table-wrap overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr>
                  {block.headers.map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="border-b border-neutral-300 px-2 py-1.5 font-semibold whitespace-nowrap text-neutral-700 dark:border-neutral-600 dark:text-neutral-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-b border-neutral-200 last:border-0 dark:border-neutral-800">
                    {row.map((cell, j) => (
                      <td key={j} className={cn('px-2 py-1.5 align-top', cell.length <= 12 && 'whitespace-nowrap')}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
  }
}

/** Renders the generated plan as a paper-like document. */
interface DocumentPreviewProps {
  doc: PlanDocument
  className?: string
  /** Print layout: no card chrome, light colours only. */
  print?: boolean
}

export function DocumentPreview({ doc, className, print = false }: DocumentPreviewProps) {
  return (
    <article
      id={print ? 'plan-document-print' : 'plan-document'}
      className={cn(
        'doc text-sm leading-relaxed text-neutral-700',
        print
          ? 'bg-white'
          : 'rounded-lg border border-neutral-200 bg-white px-6 py-8 shadow-xs sm:px-10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300',
        className,
      )}
    >
      <header className="mb-8 border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">{doc.title}</h1>
        {doc.meta.length > 0 && (
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
            {doc.meta.map((m) => (
              <div key={m.label} className="contents">
                <dt className="text-neutral-500 dark:text-neutral-400">{m.label}</dt>
                <dd className="font-medium text-neutral-800 dark:text-neutral-200">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className="space-y-5">
        {numberSections(doc.sections).map(({ section, number }) => (
          <section key={section.id} aria-labelledby={`doc-${section.id}`} className="doc-section space-y-3">
            {section.level === 1 ? (
              <h2 id={`doc-${section.id}`} className="pt-2 text-base font-semibold text-neutral-950 dark:text-white">
                <span className="mr-2 font-mono text-neutral-400">{number}</span>
                {section.title}
              </h2>
            ) : (
              <h3 id={`doc-${section.id}`} className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                <span className="mr-2 font-mono font-normal text-neutral-400">{number}</span>
                {section.title}
              </h3>
            )}
            {!section.container &&
              (section.blocks.length ? (
                section.blocks.map((b, i) => <BlockView key={i} block={b} />)
              ) : (
                <p className="text-neutral-400 italic dark:text-neutral-500">{doc.pending}</p>
              ))}
          </section>
        ))}
      </div>

      <footer className="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-400 dark:border-neutral-800">
        {doc.footer}
      </footer>
    </article>
  )
}

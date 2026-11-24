import { cn } from '../../lib/cn'
import type { Lang } from '../../types/plan'

export function LangSwitch({ value, onChange, label }: { value: Lang; onChange: (l: Lang) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border border-neutral-300 p-0.5 dark:border-neutral-700">
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={value === l}
          aria-label={l === 'es' ? 'Español' : 'English'}
          lang={l}
          onClick={() => onChange(l)}
          className={cn(
            'rounded px-2.5 py-1 font-mono text-xs font-medium uppercase transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100',
            value === l
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

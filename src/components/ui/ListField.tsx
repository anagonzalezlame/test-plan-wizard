import { Plus, X } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import { useT } from '../../hooks/useT'
import { IconButton } from './Button'
import { inputClass } from './styles'

interface ListFieldProps {
  label: string
  hint?: string
  items: string[]
  onChange: (items: string[]) => void
}

/** Editable list of free-text items (criteria, assumptions, references…). */
export function ListField({ label, hint, items, onChange }: ListFieldProps) {
  const t = useT()
  const id = useId()
  const [draft, setDraft] = useState('')

  const add = () => {
    const value = draft.trim()
    if (!value) return
    onChange([...items, value])
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</legend>
      {hint && <p className="-mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}

      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="group flex items-center gap-1.5">
              <span aria-hidden="true" className="w-5 shrink-0 text-right font-mono text-xs text-neutral-400">
                {i + 1}
              </span>
              <input
                aria-label={`${label} ${i + 1}`}
                value={item}
                onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
                className={inputClass}
              />
              <IconButton
                label={`${t.common.remove}: ${item}`}
                onClick={() => onChange(items.filter((_, j) => j !== i))}
              >
                <X className="size-4" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-1.5 pl-6.5">
        <input
          id={id}
          aria-label={`${t.common.add}: ${label}`}
          value={draft}
          placeholder={t.common.listPlaceholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          className={`${inputClass} border-dashed`}
        />
        <IconButton label={`${t.common.add}: ${label}`} onClick={add} disabled={!draft.trim()}>
          <Plus className="size-4" />
        </IconButton>
      </div>
    </fieldset>
  )
}

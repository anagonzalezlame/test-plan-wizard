import { Check, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { catalogs, type CatalogKey } from '../../data/catalogs'
import { useT } from '../../hooks/useT'
import { cn } from '../../lib/cn'
import { usePlanStore } from '../../store/planStore'
import { inputClass } from './styles'
import { IconButton } from './Button'

interface ChipSelectProps {
  label: string
  catalog: CatalogKey
  values: string[]
  onChange: (values: string[]) => void
}

const chip =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'
const chipOff =
  'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-500'
const chipOn =
  'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'

/** Multi-select from a predefined catalog, plus free-text custom entries. */
export function ChipSelect({ label, catalog, values, onChange }: ChipSelectProps) {
  const t = useT()
  const lang = usePlanStore((s) => s.uiLang)
  const [draft, setDraft] = useState('')
  const options = Object.entries(catalogs[catalog]) as [string, Record<'es' | 'en', string>][]
  const custom = values.filter((v) => !(v in catalogs[catalog]))

  const toggle = (key: string) =>
    onChange(values.includes(key) ? values.filter((v) => v !== key) : [...values, key])

  const addCustom = () => {
    const value = draft.trim()
    if (value && !values.includes(value)) onChange([...values, value])
    setDraft('')
  }

  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([key, names]) => {
          const on = values.includes(key)
          return (
            <button
              key={key}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(key)}
              className={cn(chip, on ? chipOn : chipOff)}
            >
              {on && <Check aria-hidden="true" className="size-3.5" />}
              {names[lang]}
            </button>
          )
        })}
        {custom.map((value) => (
          <span key={value} className={cn(chip, chipOn, 'pr-1.5')}>
            {value}
            <button
              type="button"
              aria-label={`${t.common.remove}: ${value}`}
              onClick={() => onChange(values.filter((v) => v !== value))}
              className="rounded-full p-0.5 hover:bg-white/20 dark:hover:bg-neutral-900/10"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex max-w-xs items-center gap-1.5">
        <input
          aria-label={`${t.common.add}: ${label}`}
          value={draft}
          placeholder={t.common.customPlaceholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
          className={cn(inputClass, 'h-8 border-dashed py-1 text-xs')}
        />
        <IconButton label={`${t.common.add}: ${label}`} onClick={addCustom} disabled={!draft.trim()} className="size-8">
          <Plus className="size-4" />
        </IconButton>
      </div>
    </fieldset>
  )
}

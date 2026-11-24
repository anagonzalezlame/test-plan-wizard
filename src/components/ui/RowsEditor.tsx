import { Plus, Trash2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useT } from '../../hooks/useT'
import { cn } from '../../lib/cn'
import { Button, IconButton } from './Button'
import { inputClass } from './styles'

export interface Column<T> {
  key: Extract<keyof T, string>
  label: string
  type?: 'text' | 'date' | 'number'
  /** Relative width on wide screens (CSS grid fr units). */
  width?: number
}

interface RowsEditorProps<T extends { id: string }> {
  label: string
  rows: T[]
  columns: Column<T>[]
  onChange: (rows: T[]) => void
  newRow: () => T
  addLabel: string
  footer?: string
}

/** Small editable table: cards on mobile, aligned grid on wider screens. */
export function RowsEditor<T extends { id: string }>({
  label,
  rows,
  columns,
  onChange,
  newRow,
  addLabel,
  footer,
}: RowsEditorProps<T>) {
  const t = useT()
  const template = columns.map((c) => `${c.width ?? 1}fr`).join(' ') + ' 2.25rem'

  const update = (id: string, key: keyof T, value: string) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)))

  return (
    <fieldset className="@container space-y-2">
      <legend className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</legend>

      {rows.length > 0 && (
        <div
          aria-hidden="true"
          className="hidden gap-2 px-0.5 text-xs font-medium text-neutral-500 @xl:grid dark:text-neutral-400"
          style={{ gridTemplateColumns: template }}
        >
          {columns.map((c) => (
            <span key={c.key}>{c.label}</span>
          ))}
        </div>
      )}

      {rows.length === 0 && (
        <p className="rounded-md border border-dashed border-neutral-300 px-3 py-4 text-center text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          {t.common.noRows}
        </p>
      )}

      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li
            key={row.id}
            className={cn(
              'grid grid-cols-1 gap-2 rounded-md border border-neutral-200 p-3 @xl:items-center @xl:border-0 @xl:p-0',
              'dark:border-neutral-800 @xl:[grid-template-columns:var(--cols)]',
            )}
            style={{ '--cols': template } as CSSProperties}
          >
            {columns.map((c) => (
              <label key={c.key} className="block">
                <span className="mb-1 block text-xs text-neutral-500 @xl:sr-only dark:text-neutral-400">
                  {c.label}
                </span>
                <input
                  type={c.type ?? 'text'}
                  aria-label={`${c.label} (${i + 1})`}
                  value={String(row[c.key] ?? '')}
                  min={c.type === 'number' ? 0 : undefined}
                  step={c.type === 'number' ? 0.5 : undefined}
                  onChange={(e) => update(row.id, c.key, e.target.value)}
                  className={inputClass}
                />
              </label>
            ))}
            <IconButton
              label={`${t.common.remove} (${i + 1})`}
              onClick={() => onChange(rows.filter((r) => r.id !== row.id))}
              className="justify-self-end"
            >
              <Trash2 className="size-4" />
            </IconButton>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Button size="sm" onClick={() => onChange([...rows, newRow()])}>
          <Plus aria-hidden="true" className="size-3.5" />
          {addLabel}
        </Button>
        {footer && <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">{footer}</p>}
      </div>
    </fieldset>
  )
}

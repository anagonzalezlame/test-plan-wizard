import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { inputClass } from './styles'


interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function Field({ id, label, hint, error, required, children, className }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-neutral-400">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}


export function TextInput({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(inputClass, className)} {...props} />
}

export function TextArea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea rows={3} className={cn(inputClass, 'resize-y leading-relaxed', className)} {...props} />
}

/** Visual group for a set of related fields. */
export function Panel({
  title,
  description,
  children,
  actions,
}: {
  title?: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
      {(title || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>}
            {description && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  )
}

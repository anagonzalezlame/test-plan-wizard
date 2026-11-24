import { cn } from '../../lib/cn'

export const inputClass = cn(
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs transition',
  'placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10',
  'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500',
  'dark:focus:border-neutral-300 dark:focus:ring-neutral-100/10',
  'aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400',
)

export const describedBy = (id: string, hint?: string, error?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined

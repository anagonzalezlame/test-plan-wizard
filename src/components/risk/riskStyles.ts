import type { RiskLevel } from '../../lib/risk'

/** The only colour in the UI: risk severity. */
export const levelCell: Record<RiskLevel, string> = {
  low: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:hover:bg-emerald-500/25',
  medium: 'bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:hover:bg-amber-500/25',
  high: 'bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-200 dark:hover:bg-red-500/30',
}

export const levelBadge: Record<RiskLevel, string> = {
  low: 'bg-emerald-100 text-emerald-900 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/30',
  medium: 'bg-amber-100 text-amber-900 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30',
  high: 'bg-red-100 text-red-900 ring-red-600/20 dark:bg-red-500/20 dark:text-red-200 dark:ring-red-400/30',
}

export const levelDot: Record<RiskLevel, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

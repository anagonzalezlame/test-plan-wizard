import type { Activity } from '../types/plan'

export function parseEffort(value: string): number {
  const n = Number.parseFloat(value.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function totalEffort(activities: Activity[]): number {
  const total = activities.reduce((sum, a) => sum + parseEffort(a.effort), 0)
  return Math.round(total * 10) / 10
}

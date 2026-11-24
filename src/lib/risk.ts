import type { Risk } from '../types/plan'

export type RiskLevel = 'low' | 'medium' | 'high'

export const riskScore = (r: Pick<Risk, 'probability' | 'impact'>) => r.probability * r.impact

/** 5×5 matrix thresholds: 1–4 low, 5–9 medium, 10–25 high. */
export function riskLevel(score: number): RiskLevel {
  if (score >= 10) return 'high'
  if (score >= 5) return 'medium'
  return 'low'
}

/** Stable, human-friendly codes (R-01, R-02…) based on insertion order. */
export const riskCode = (index: number) => `R-${String(index + 1).padStart(2, '0')}`

/** Risks with their code, sorted by score (highest first). */
export function rankedRisks(risks: Risk[]) {
  return risks
    .map((risk, i) => ({ risk, code: riskCode(i), score: riskScore(risk) }))
    .sort((a, b) => b.score - a.score || a.code.localeCompare(b.code))
}

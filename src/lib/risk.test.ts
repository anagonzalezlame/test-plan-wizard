import { rankedRisks, riskCode, riskLevel, riskScore } from './risk'
import type { Risk } from '../types/plan'

const risk = (p: number, i: number, title = 'r'): Risk => ({
  id: title,
  title,
  type: 'product',
  probability: p,
  impact: i,
  mitigation: '',
  owner: '',
})

describe('risk helpers', () => {
  it.each([
    [1, 1, 'low'],
    [2, 2, 'low'],
    [1, 5, 'medium'],
    [3, 3, 'medium'],
    [2, 5, 'high'],
    [5, 5, 'high'],
  ])('p=%i × i=%i is %s', (p, i, level) => {
    expect(riskLevel(riskScore({ probability: p, impact: i }))).toBe(level)
  })

  it('codes risks by insertion order and ranks them by score', () => {
    const ranked = rankedRisks([risk(1, 2, 'a'), risk(5, 4, 'b'), risk(3, 3, 'c')])
    expect(ranked.map((r) => [r.code, r.risk.title])).toEqual([
      ['R-02', 'b'],
      ['R-03', 'c'],
      ['R-01', 'a'],
    ])
    expect(riskCode(11)).toBe('R-12')
  })
})

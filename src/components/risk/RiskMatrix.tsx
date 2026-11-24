import { useT } from '../../hooks/useT'
import { cn } from '../../lib/cn'
import { riskLevel } from '../../lib/risk'
import type { Risk } from '../../types/plan'
import { levelCell, levelDot } from './riskStyles'

interface RiskMatrixProps {
  risks: Risk[]
  selected?: { probability: number; impact: number }
  onSelect: (probability: number, impact: number) => void
}

const SCALE = [1, 2, 3, 4, 5]

/** 5×5 probability × impact heat map. Each cell shows how many risks fall in it. */
export function RiskMatrix({ risks, selected, onSelect }: RiskMatrixProps) {
  const t = useT()
  const r = t.risks
  const count = (p: number, i: number) => risks.filter((x) => x.probability === p && x.impact === i).length

  return (
    <div className="w-full max-w-sm">
      <div className="flex gap-2">
        {/* Y axis label */}
        <div className="flex w-4 items-center justify-center">
          <span className="-rotate-90 whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {r.probability} →
          </span>
        </div>

        <div className="flex-1">
          <div role="grid" aria-label={r.matrixTitle} className="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-1">
            {[...SCALE].reverse().map((p) => (
              <div role="row" key={p} className="contents">
                <span
                  role="rowheader"
                  title={r.probabilityLevels[p - 1]}
                  className="flex items-center justify-end pr-1.5 font-mono text-xs text-neutral-500 dark:text-neutral-400"
                >
                  {p}
                </span>
                {SCALE.map((i) => {
                  const n = count(p, i)
                  const level = riskLevel(p * i)
                  const isSelected = selected?.probability === p && selected?.impact === i
                  return (
                    <div role="gridcell" key={i}>
                      <button
                        type="button"
                        onClick={() => onSelect(p, i)}
                        aria-label={r.cellLabel(r.probabilityLevels[p - 1], r.impactLevels[i - 1], n)}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex aspect-[4/3] w-full items-center justify-center rounded-md font-mono text-sm font-semibold transition',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100',
                          levelCell[level],
                          isSelected && 'ring-2 ring-neutral-900 ring-offset-2 ring-offset-white dark:ring-neutral-100 dark:ring-offset-neutral-900',
                        )}
                      >
                        {n > 0 ? n : ''}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* X axis */}
          <div className="mt-1 grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-1">
            <span className="w-[1ch] pr-1.5" />
            {SCALE.map((i) => (
              <span key={i} title={r.impactLevels[i - 1]} className="text-center font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {i}
              </span>
            ))}
          </div>
          <p className="mt-1 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">{r.impact} →</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-300">
        {(['low', 'medium', 'high'] as const).map((l) => (
          <li key={l} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn('size-2.5 rounded-full', levelDot[l])} />
            {r.level[l]}
          </li>
        ))}
      </ul>
    </div>
  )
}

import { m, useReducedMotion } from 'motion/react'
import { experience } from '../../data/career'

const START = { y: 2025, m: 1 } // Jan 2025
const MONTHS = 20 // through Aug 2026

const idx = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return (y - START.y) * 12 + (m - START.m)
}
const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

/** Horizontal month ruler with each internship as a measured span. */
export function TimeRuler({ onSelect }: { onSelect?: (id: string) => void }) {
  const reduce = useReducedMotion()
  return (
    <div className="ruler" role="img" aria-label="Timeline: IIT Bombay February to May 2025, Scientechnic June to July 2025, IIT Bombay June to July 2026.">
      <div className="ruler__scale">
        {Array.from({ length: MONTHS }, (_, i) => {
          const m = (START.m - 1 + i) % 12
          const y = START.y + Math.floor((START.m - 1 + i) / 12)
          return (
            <span key={i} className={`ruler__m ${m === 0 ? 'ruler__m--year' : ''}`}>
              <span className="ruler__ml">{monthNames[m]}</span>
              {m === 0 && <span className="ruler__y label">{y}</span>}
            </span>
          )
        })}
      </div>
      <div className="ruler__lanes">
        {[...experience].reverse().map((r, i) => {
          const a = idx(r.start)
          const b = idx(r.end) + 1
          return (
            <m.div
              key={r.id}
              className={`ruler__bar ${b > MONTHS * 0.75 ? 'ruler__bar--end' : ''}`}
              style={{ left: `${(a / MONTHS) * 100}%`, width: `${((b - a) / MONTHS) * 100}%`, top: `${i * 34}px` }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.12 }}
              onClick={() => onSelect?.(r.id)}
            >
              <span>{r.org}</span>
            </m.div>
          )
        })}
      </div>
    </div>
  )
}

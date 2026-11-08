import type { Decision } from '../../data/lab'
import { Reveal } from '../Reveal'

/** Engineering decisions, in the order a reviewer would ask: problem, options, choices, trouble, evidence, limits, next. */
export function Decisions({ items }: { items: Decision[] }) {
  return (
    <div className="dec">
      {items.map((d, k) => (
        <Reveal key={d.h} className="dec__row">
          <h3 className="dec__h">
            <span className="label label--accent">{String(k + 1).padStart(2, '0')}</span>
            {d.h}
          </h3>
          <ul className="dec__list">
            {d.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  )
}

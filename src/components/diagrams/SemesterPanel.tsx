import { m, useReducedMotion } from 'motion/react'
import { semesters } from '../../data/career'

const LO = 8.0
const HI = 10.0
const pct = (v: number) => ((v - LO) / (HI - LO)) * 100

/**
 * SGPA per semester as bars on a truncated 8–10 axis (stated on the panel),
 * with the cumulative CGPA drawn as a trace across them. VII and VIII are empty: not yet graded.
 */
export function SemesterPanel({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion()
  const cols = [...semesters.map((s) => ({ ...s, pending: false })), { n: 'VII', pending: true }, { n: 'VIII', pending: true }]
  const count = cols.length
  const pts = semesters.map((s, i) => `${((i + 0.19) / count) * 100},${100 - pct(s.cgpa)}`).join(' ')

  return (
    <figure className={`sem ${compact ? 'sem--compact' : ''}`}>
      <div className="sem__plot">
        <div className="sem__grid" aria-hidden="true">
          {[10, 9.5, 9, 8.5, 8].map((v) => (
            <span key={v} style={{ bottom: `${pct(v)}%` }}>
              <em className="label">{v.toFixed(1)}</em>
            </span>
          ))}
        </div>
        <div className="sem__cols">
          {cols.map((c, i) =>
            'sgpa' in c ? (
              <div key={c.n} className="sem__col">
                <m.span
                  className="sem__bar"
                  style={{ height: `${pct(c.sgpa)}%` }}
                  initial={reduce ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i }}
                />
              </div>
            ) : (
              <div key={c.n} className="sem__col sem__col--pending" />
            ),
          )}
        </div>
        <m.svg
          className="sem__trace"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
        >
          <polyline points={pts} />
        </m.svg>
      </div>
      <div className="sem__read">
        {cols.map((c) => (
          <div key={c.n} className={`sem__cell ${'sgpa' in c ? '' : 'is-pending'}`}>
            <span className="label">Sem {c.n}</span>
            {'sgpa' in c ? (
              <>
                <span className="num sem__v">{c.sgpa.toFixed(2)}</span>
                <span className="sem__c">
                  <span className="label">CGPA</span> {c.cgpa.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="sem__v sem__v--pending">Not yet graded</span>
            )}
          </div>
        ))}
      </div>
      <figcaption className="sem__legend">
        <span>
          <i className="sem__key sem__key--bar" /> SGPA
        </span>
        <span>
          <i className="sem__key sem__key--line" /> CGPA, cumulative
        </span>
        <span className="muted">Axis starts at 8.0, not zero. Source: VJTI semester grade reports.</span>
      </figcaption>
      <table className="sr-only">
        <caption>Semester results</caption>
        <thead>
          <tr>
            <th>Semester</th>
            <th>SGPA</th>
            <th>CGPA</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((s) => (
            <tr key={s.n}>
              <td>{s.n}</td>
              <td>{s.sgpa}</td>
              <td>{s.cgpa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

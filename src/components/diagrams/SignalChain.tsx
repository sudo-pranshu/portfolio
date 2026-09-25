import { m, useReducedMotion } from 'motion/react'
import { signalChain } from '../../data/career'
import { easeOut } from '../../animations/motion'

/**
 * The site's thesis drawn as a rail: physical signal to decision.
 * The rail draws once, then each stage lights in order, so the motion follows the direction of the signal.
 */
export function SignalChain() {
  const reduce = useReducedMotion()
  const n = signalChain.length
  return (
    <section className="chain-band" aria-labelledby="chain-h">
      <div className="wrap">
        <div className="chain-band__head">
          <h2 id="chain-h" className="label label--accent">
            The signal chain
          </h2>
          <p className="chain-band__lede serif">Every project on this site runs along some part of this path.</p>
        </div>
        <div className="chain-rail">
          <m.span
            className="chain-rail__line"
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.2, ease: easeOut }}
          />
          <ol className="chain-rail__list">
            {signalChain.map((s, i) => (
              <m.li
                key={s.stage}
                className="chain-rail__stage"
                initial={reduce ? false : { opacity: 0.2 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.4, delay: 0.15 + (i / n) * 1.0 }}
              >
                <span className="chain-rail__node" aria-hidden="true" />
                <span className="chain-rail__name">{s.stage}</span>
                <span className="chain-rail__eg">{s.eg}</span>
              </m.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

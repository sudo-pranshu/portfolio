import { m, useReducedMotion } from 'motion/react'
import { easeOut } from '../../animations/motion'

export type Stage = { name: string; detail?: string }

type Props = {
  stages: Stage[]
  label: string
  /** Draw a return path under the chain (closed-loop systems). */
  feedback?: string
  dense?: boolean
}

/**
 * An ordered signal chain. Horizontal on wide screens, vertical on narrow ones.
 * Stages light up in sequence once, when scrolled into view.
 */
export function Stages({ stages, label, feedback, dense = false }: Props) {
  const reduce = useReducedMotion()
  return (
    <div className={`stages ${feedback ? 'stages--loop' : ''} ${dense ? 'stages--dense' : ''}`}>
      <ol className="stages__list" aria-label={label}>
        {stages.map((s, i) => (
          <m.li
            key={s.name}
            className="stages__item"
            initial={reduce ? false : { opacity: 0.25 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.5, ease: easeOut, delay: i * 0.12 }}
          >
            <span className="stages__n label">{String(i + 1).padStart(2, '0')}</span>
            <span className="stages__name">{s.name}</span>
            {s.detail && <span className="stages__detail">{s.detail}</span>}
          </m.li>
        ))}
      </ol>
      {feedback && (
        <div className="stages__return" aria-hidden="true">
          <span className="label">{feedback}</span>
        </div>
      )}
      {feedback && <p className="sr-only">Feedback path: {feedback}</p>}
    </div>
  )
}

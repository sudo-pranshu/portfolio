import type { ReactNode } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { easeOut } from '../animations/motion'

type Props = { idx: string; title: ReactNode; aside?: ReactNode; as?: 'h1' | 'h2' }

export function SecHead({ idx, title, aside, as: H = 'h2' }: Props) {
  const reduce = useReducedMotion()
  return (
    <div className="sec-head">
      <span className="sec-head__idx label label--accent">{idx}</span>
      <H className="sec-head__title h2">{title}</H>
      {aside && <div className="sec-head__aside muted">{aside}</div>}
      {/* The hairline draws in once as the heading enters the viewport. */}
      <m.span
        className="sec-head__rule"
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 1.1, ease: easeOut }}
      />
    </div>
  )
}

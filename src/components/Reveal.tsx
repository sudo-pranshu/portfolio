import type { ReactNode } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { easeOut } from '../animations/motion'

type Props = { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'li' }

/** One restrained scroll reveal used everywhere, so motion stays consistent. */
export function Reveal({ children, delay = 0, className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const C = m[as]
  return (
    <C
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: easeOut, delay }}
    >
      {children}
    </C>
  )
}

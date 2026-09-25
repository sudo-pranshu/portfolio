import type { ReactNode } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { pageVariants } from '../animations/motion'
import { useSeo } from '../hooks/useSeo'

type Props = {
  title: string
  description: string
  path: string
  className?: string
  children: ReactNode
}

export function Page({ title, description, path, className, children }: Props) {
  const reduce = useReducedMotion()
  useSeo({ title, description, path })
  return (
    <m.main
      id="main"
      className={className}
      variants={pageVariants}
      initial={reduce ? false : "initial"}
      animate="enter"
      exit="exit"
    >
      {children}
    </m.main>
  )
}

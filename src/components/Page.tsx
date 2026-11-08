import type { ReactNode } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { pageVariants } from '../animations/motion'
import { useSeo } from '../hooks/useSeo'
import { useRecruiter } from '../hooks/useRecruiter'

type Props = {
  title: string
  description: string
  path: string
  className?: string
  children: ReactNode
}

export function Page({ title, description, path, className, children }: Props) {
  const system = useReducedMotion()
  const recruiter = useRecruiter()
  const reduce = system || recruiter
  useSeo({ title, description, path })
  return (
    <m.main
      id="main"
      className={className}
      variants={pageVariants}
      initial={reduce ? false : "initial"}
      animate="enter"
      exit={reduce ? undefined : "exit"}
    >
      {children}
    </m.main>
  )
}

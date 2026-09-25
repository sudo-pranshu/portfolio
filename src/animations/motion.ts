import type { Transition, Variants } from 'motion/react'

export const easeOut = [0.16, 1, 0.3, 1] as const

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.42, ease: easeOut } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16, ease: 'easeIn' } },
}

export const rise = (delay = 0, y = 18): { initial: object; animate: object; transition: Transition } => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: easeOut, delay },
})

/** Line-by-line mask reveal for display type. */
export const lineReveal: Variants = {
  hidden: { y: '105%' },
  show: (i: number = 0) => ({
    y: '0%',
    transition: { duration: 0.9, ease: easeOut, delay: 0.08 + i * 0.09 },
  }),
}

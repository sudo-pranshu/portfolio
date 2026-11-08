import { useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Frame loop used by the AVERRA-derived demos (ported from `useTicker` in AVERRA's components/slides.tsx).
 * Calls fn(t) every frame while `run` is true (t in seconds). Under reduced motion it draws one settled
 * static frame instead, and redraws it when `redraw` changes.
 */
export function useTicker(fn: (t: number) => void, run: boolean, redraw?: unknown) {
  const reduce = useReducedMotion()
  const ref = useRef(fn)
  useEffect(() => {
    ref.current = fn
  })
  useEffect(() => {
    if (reduce) {
      for (let i = 1; i <= 24; i++) ref.current(i * 0.1)
      return
    }
    if (!run) return
    let raf = 0
    const t0 = performance.now()
    const loop = (now: number) => {
      ref.current((now - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduce, run, redraw])
}

/** True while the element is on screen and the tab is visible, so a demo's loop can pause itself. */
export function useOnScreen(el: RefObject<Element | null>) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const node = el.current
    if (!node) return
    let inView = false
    let tabVisible = !document.hidden
    const update = () => setOn(inView && tabVisible)
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting
      update()
    })
    io.observe(node)
    const onVis = () => {
      tabVisible = !document.hidden
      update()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [el])
  return on
}

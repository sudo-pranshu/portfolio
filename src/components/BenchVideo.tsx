import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { asset } from '../config/personal'

/**
 * The TremoSense bench demonstration from the project repository (assets/tremosense.gif, converted to H.264 with the
 * black side bars of the source removed; 360 × 480, 7 s, no audio track). The file is requested only when the player
 * nears the viewport, it plays muted while visible and pauses when scrolled away, and the native controls
 * (play/pause, scrub, volume, fullscreen) stay available. Nothing autoplays with sound, and nothing autoplays at all
 * under reduced motion.
 */
export function BenchVideo({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    let loaded = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!loaded) {
            loaded = true
            v.src = asset('assets/work/tremosense-demo.mp4')
            v.load()
          }
          if (!reduce) v.play().catch(() => {})
        } else if (loaded) {
          v.pause()
        }
      },
      { rootMargin: '200px 0px', threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduce])

  return (
    <video
      ref={ref}
      className={`bench-video ${className}`}
      poster={asset('assets/work/tremosense-poster.jpg')}
      width={360}
      height={480}
      muted
      loop
      playsInline
      controls
      preload="none"
      aria-label="TremoSense bench demonstration: a hand holds the servo gimbal while the roll and pitch servos move the spoon against the motion"
    />
  )
}

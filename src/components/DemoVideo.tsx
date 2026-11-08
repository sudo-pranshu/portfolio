import { useReducedMotion } from 'motion/react'
import { asset } from '../config/personal'

/** TremoSense bench footage from the project repository. Muted loop; no autoplay under reduced motion. */
export function DemoVideo({ caption, className = '', bare = false }: { caption?: string; className?: string; bare?: boolean }) {
  const reduce = useReducedMotion()
  const video = (
    <video
      className="demo__video"
      src={asset('assets/work/tremosense-demo.mp4')}
      poster={asset('assets/work/tremosense-poster.jpg')}
      width={360}
      height={480}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      controls={!!reduce}
      preload="metadata"
      aria-label="TremoSense prototype on the bench: a hand holds the gimbal while the servos move the spoon against the motion"
    />
  )
  if (bare) return video
  return (
    <figure className={`demo ${className}`}>
      <div className="demo__frame">{video}</div>
      {caption && <figcaption className="label">{caption}</figcaption>}
    </figure>
  )
}

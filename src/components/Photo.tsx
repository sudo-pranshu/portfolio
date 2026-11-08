import { m, useReducedMotion } from 'motion/react'
import { asset } from '../config/personal'
import { easeOut } from '../animations/motion'

type Props = {
  /** Base path under /public without extension; expects .webp and .jpg siblings. */
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  className?: string
  eager?: boolean
}

/** Real project photograph with a WebP source and JPEG fallback. */
export function Photo({ src, alt, width, height, caption, className = '', eager = false }: Props) {
  const reduce = useReducedMotion()
  return (
    <figure className={`photo ${className}`}>
      {/* The wipe reveals the whole photograph; the frame keeps its size, so nothing shifts. */}
      <m.picture
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
        whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 0.9, ease: easeOut }}
      >
        <source srcSet={asset(`${src}.webp`)} type="image/webp" />
        <img
          src={asset(`${src}.jpg`)}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </m.picture>
      {caption && <figcaption className="label">{caption}</figcaption>}
    </figure>
  )
}

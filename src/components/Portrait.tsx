import { m, useReducedMotion } from 'motion/react'
import { personal } from '../config/personal'
import { easeOut } from '../animations/motion'

type Props = { caption?: string; className?: string; priority?: boolean }

/** Portrait with printer's crop marks and a figure caption. The photograph is the only image on the home page. */
export function Portrait({ caption = 'Fig. 01', className = '', priority = false }: Props) {
  const reduce = useReducedMotion()
  return (
    <figure className={`portrait ${className}`}>
      <div className="portrait__frame">
        <m.div
          className="portrait__img"
          initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.1, ease: easeOut, delay: 0.35 }}
        >
          <picture>
            <source srcSet={personal.photo.webp} type="image/webp" />
            <img
              src={personal.photo.jpg}
              alt={personal.photo.alt}
              width={1040}
              height={1300}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
            />
          </picture>
        </m.div>
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <span className="crop crop--bl" aria-hidden="true" />
        <span className="crop crop--br" aria-hidden="true" />
      </div>
      <figcaption className="portrait__cap label">{caption}</figcaption>
    </figure>
  )
}

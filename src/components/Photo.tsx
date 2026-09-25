import { asset } from '../config/personal'

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
  return (
    <figure className={`photo ${className}`}>
      <picture>
        <source srcSet={asset(`${src}.webp`)} type="image/webp" />
        <img
          src={asset(`${src}.jpg`)}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
      {caption && <figcaption className="label">{caption}</figcaption>}
    </figure>
  )
}

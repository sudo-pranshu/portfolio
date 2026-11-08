import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { Reveal } from './Reveal'

type Props = {
  project: Project
  /** Short domain line shown in the eyebrow. */
  domain: string
  /** One-line signal path, each stage separated by an arrow. */
  chain: string
  /** The media block; its frame is fixed by the layout so all flagships match. */
  media: ReactNode
  /** Natural width / height of the media, so the frame never crops it. */
  ratio: number
  caption: string
  /** Put the media on the right on wide screens. */
  flip?: boolean
}

/** One template for every flagship project, so none outranks another. */
export function Flagship({ project: p, domain, chain, media, ratio, caption, flip = false }: Props) {
  return (
    <Reveal className={`fl ${flip ? 'fl--flip' : ''}`}>
      <Link to={`/work/${p.slug}`} className="fl__link wrap" aria-label={`${p.title} case study`}>
        <div className="fl__media">
          <div className="fl__frame" style={{ '--rn': ratio } as CSSProperties}>{media}</div>
          <span className="fl__cap label">{caption}</span>
        </div>
        <div className="fl__text">
          <span className="label label--accent">
            {p.index} · Flagship · {domain}
          </span>
          <h3 className="fl__title serif">{p.title}</h3>
          <p className="fl__sub">{p.subtitle}</p>
          <p className="fl__chain">{chain}</p>
          <ul className="tags" aria-label="Technologies">
            {p.technologies.slice(0, 5).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <dl className="fl__figs">
            {p.keyFigures.map((f) => (
              <div key={f.label}>
                <dt className="label">{f.label}</dt>
                <dd className="num">
                  {f.value}
                  {f.unit && <small>{f.unit}</small>}
                </dd>
              </div>
            ))}
          </dl>
          <span className="fl__cta link">
            Read the case study <span className="arrow">→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

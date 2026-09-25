import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { m, useReducedMotion } from 'motion/react'
import type { Project } from '../data/projects'
import { nextProject } from '../data/projects'
import { personal } from '../config/personal'
import { easeOut } from '../animations/motion'

export function CaseHeader({ p, flagship = false, compact = false }: { p: Project; flagship?: boolean; compact?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <header className={`chead wrap ${flagship ? 'chead--flag' : ''} ${compact ? 'chead--compact' : ''}`}>
      <nav className="chead__crumb label" aria-label="Breadcrumb">
        <Link to="/work">Work</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">
          {p.index}
          {flagship ? ' · Flagship' : ''}
        </span>
      </nav>

      <h1 className="chead__title serif">
        <span className="chead__mask">
          <m.span
            className="chead__word"
            initial={reduce ? false : { y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.05 }}
          >
            {p.title}
          </m.span>
        </span>
      </h1>

      <m.div
        className="chead__rule"
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
        aria-hidden="true"
      />

      <m.div
        className="chead__grid"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
      >
        <p className="chead__sub">{p.subtitle}</p>
        <dl className="chead__meta">
          <div>
            <dt className="label">Context</dt>
            <dd>{p.context}</dd>
          </div>
          <div>
            <dt className="label">Role</dt>
            <dd>{p.role}</dd>
          </div>
          {p.period && (
            <div>
              <dt className="label">Period</dt>
              <dd>{p.period}</dd>
            </div>
          )}
          <div>
            <dt className="label">Stack</dt>
            <dd>{p.technologies.join(' / ')}</dd>
          </div>
          {p.parameters && (
            <div className="chead__param">
              <dt className="label label--accent">Parameters</dt>
              <dd>{p.parameters}</dd>
            </div>
          )}
        </dl>
      </m.div>

    </header>
  )
}

export function CaseSection({
  n,
  title,
  kicker,
  children,
  wide = false,
  id,
}: {
  n: string
  title: string
  kicker?: string
  children: ReactNode
  wide?: boolean
  id?: string
}) {
  return (
    <section className={`csec wrap ${wide ? 'csec--wide' : ''}`} id={id} aria-labelledby={`${id ?? n}-h`}>
      <div className="csec__side">
        <span className="label label--accent">{n}</span>
        <h2 className="csec__title" id={`${id ?? n}-h`}>
          {title}
        </h2>
        {kicker && <p className="csec__kicker muted">{kicker}</p>}
      </div>
      <div className="csec__body">{children}</div>
    </section>
  )
}

export function CaseLinks({ p }: { p: Project }) {
  return (
    <div className="clinks wrap">
      <span className="label">Source</span>
      {p.github ? (
        <a className="link" href={p.github} target="_blank" rel="noopener noreferrer">
          Repository <span className="arrow">↗</span>
        </a>
      ) : (
        <span className="muted clinks__note">
          No public repository for this project yet. Other code is on{' '}
          <a className="inline-link" href={personal.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </span>
      )}
      {p.demo && (
        <a className="link" href={p.demo} target="_blank" rel="noopener noreferrer">
          Demo <span className="arrow">↗</span>
        </a>
      )}
    </div>
  )
}

export function NextProject({ slug }: { slug: string }) {
  const n = nextProject(slug)
  return (
    <Link to={`/work/${n.slug}`} className="cnext">
      <div className="wrap cnext__inner">
        <span className="label">Next · {n.index}</span>
        <span className="cnext__title serif">
          {n.title} <span className="cnext__arrow" aria-hidden="true">→</span>
        </span>
        <span className="cnext__sub muted">{n.subtitle}</span>
      </div>
    </Link>
  )
}

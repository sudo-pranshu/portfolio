import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'motion/react'
import { Page } from '../components/Page'
import { TimeRuler } from '../components/diagrams/TimeRuler'
import { experience } from '../data/career'
import { easeOut } from '../animations/motion'

export default function Experience() {
  const [open, setOpen] = useState<string[]>([experience[0].id])
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
  const openOne = (id: string) => {
    setOpen((o) => (o.includes(id) ? o : [...o, id]))
    document.getElementById(`role-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Page
      title="Experience | Pranshu Kumar"
      description="Internships: IoT Research Intern at IIT Bombay's Machine Intelligence Program (2025, 2026) and Project Engineering Intern at Scientechnic, Dubai (2025)."
      path="/experience"
    >
      <section className="wrap page-head">
        <span className="label label--accent">03 · Experience</span>
        <h1 className="page-head__title display">Three placements</h1>
        <p className="page-head__lede serif">
          Two research internships at IIT Bombay, either side of a summer commissioning building systems in Dubai.
        </p>
      </section>

      <section className="wrap xp-ruler" aria-label="Timeline">
        <TimeRuler onSelect={openOne} />
      </section>

      <section className="wrap section xp" aria-label="Roles">
        {experience.map((r) => {
          const isOpen = open.includes(r.id)
          return (
            <article key={r.id} id={`role-${r.id}`} className={`role ${isOpen ? 'is-open' : ''}`}>
              <header className="role__head">
                <span className="role__date label">{r.label}</span>
                <h2 className="role__org">
                  {r.org}
                  <span className="role__place">{r.place}</span>
                </h2>
                <div className="role__title">
                  <span>{r.title}</span>
                  <span className="muted">{r.unit}</span>
                </div>
                <p className="role__headline serif">{r.headline}</p>
                <button
                  type="button"
                  className="role__toggle"
                  aria-expanded={isOpen}
                  aria-controls={`role-body-${r.id}`}
                  onClick={() => toggle(r.id)}
                >
                  <span>{isOpen ? 'Hide detail' : 'Show detail'}</span>
                  <span className="role__plus" aria-hidden="true" />
                </button>
              </header>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    id={`role-body-${r.id}`}
                    className="role__body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transition: { duration: 0.45, ease: easeOut } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
                  >
                    <ul className="role__points">
                      {r.points.map((p, i) => (
                        <li key={i}>
                          <span className="label">{String(i + 1).padStart(2, '0')}</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    {r.link && (
                      <Link to={r.link.to} className="link role__link">
                        {r.link.label} <span className="arrow">→</span>
                      </Link>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </article>
          )
        })}
      </section>
    </Page>
  )
}

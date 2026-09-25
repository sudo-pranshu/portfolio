import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { Reveal } from '../components/Reveal'
import { projects } from '../data/projects'

export default function Work() {
  return (
    <Page
      title="Work | Pranshu Kumar"
      description="Five systems by Pranshu Kumar: ParkinSense, a multi-modal Parkinson's wearable; TremoSense, a Zephyr RTOS EKF + LQR tremor-suppressing spoon; NaviSight, assistive navigation devices; an RL autonomous car simulation; Wall-E, a self-balancing line follower; and a YOLOv8 traffic monitoring system."
      path="/work"
    >
      <section className="wrap page-head">
        <span className="label label--accent">01 · Work</span>
        <h1 className="page-head__title display">Six systems</h1>
        <p className="page-head__lede serif">
          Two for Parkinson’s, one for people who can’t see the path, one that learns to drive in simulation, one that
          has to stay upright, and one that watches traffic. Each runs from a signal to a decision.
        </p>
      </section>

      <section className="wrap windex" aria-label="Projects">
        <ol>
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.05} className={`windex__item ${i === 0 ? 'windex__item--flag' : ''}`}>
              <Link to={`/work/${p.slug}`} className="windex__link">
                <span className="windex__idx label">{p.index}</span>
                <span className="windex__title">{p.title}</span>
                <span className="windex__sub">{p.subtitle}</span>
                <span className="windex__meta">
                  <span className="label">{p.context}</span>
                  <span className="windex__tech">{p.technologies.join(' / ')}</span>
                </span>
                {i === 0 && (
                  <span className="windex__figs">
                    {p.keyFigures.map((f) => (
                      <span key={f.label}>
                        <span className="num">
                          {f.value}
                          {f.unit && <small>{f.unit}</small>}
                        </span>
                        <span className="label">{f.label}</span>
                      </span>
                    ))}
                  </span>
                )}
                <span className="windex__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>
    </Page>
  )
}

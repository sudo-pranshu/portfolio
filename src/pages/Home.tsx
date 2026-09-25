import { Link } from 'react-router-dom'
import { m, useReducedMotion } from 'motion/react'
import { Page } from '../components/Page'
import { Portrait } from '../components/Portrait'
import { Reveal } from '../components/Reveal'
import { SecHead } from '../components/SecHead'
import { CopyEmail } from '../components/CopyEmail'
import { Interests } from '../components/Interests'
import { SignalFigure } from '../components/diagrams/SignalFigure'
import { DemoVideo } from '../components/DemoVideo'
import { Photo } from '../components/Photo'
import { SignalChain } from '../components/diagrams/SignalChain'
import { SemesterPanel } from '../components/diagrams/SemesterPanel'
import { personal } from '../config/personal'
import { getProject } from '../data/projects'
import { education, experience, extras } from '../data/career'
import { easeOut, lineReveal } from '../animations/motion'

const ps = getProject('parkinsense')!
const ts = getProject('tremosense')!
const ns = getProject('navisight')!
const rl = getProject('rl-autonomous-car')!
const we = getProject('wall-e')!
const tr = getProject('traffic-management')!

export default function Home() {
  const reduce = useReducedMotion()
  return (
    <Page
      title="Pranshu Kumar | Electronics, Embedded Systems & AI"
      description="Pranshu Kumar is an Electronics & Telecommunications engineering student at VJTI working across embedded systems, IoT, signal processing, AI/ML, robotics and intelligent wearable systems."
      path="/"
    >
      {/* ------------------------------------------------ HERO */}
      <section className="hero wrap" aria-labelledby="hero-name">
        <m.div
          className="hero__meta"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <span className="label label--fg">Electronics · Systems · AI</span>
          <span className="label">B.Tech EXTC, minor in AI / ML</span>
          <span className="label">VJTI, Mumbai · Class of 2027</span>
        </m.div>

        <h1 id="hero-name" className="hero__name display" aria-label="Pranshu Kumar">
          {[personal.firstName, personal.lastName].map((w, i) => (
            <span key={w} className="hero__line" aria-hidden="true">
              <m.span className="hero__word" variants={lineReveal} initial={reduce ? false : "hidden"} animate="show" custom={i}>
                {w}
              </m.span>
            </span>
          ))}
        </h1>

        <Portrait className="hero__portrait" caption="Fig. 01 · Pranshu Kumar" priority />

        <m.div
          className="hero__copy"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.55 }}
        >
          <p className="hero__lede serif">
            I build the whole signal chain: the sensor, the firmware, the radio link, the filter, the controller, and
            the screen someone reads at the end.
          </p>
        </m.div>

        <m.div
          className="hero__now"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Link to="/work/parkinsense" className="now">
            <span className="label label--accent">Latest · Jun–Jul 2026</span>
            <span className="now__title">
              ParkinSense <span className="now__arrow" aria-hidden="true">→</span>
            </span>
            <span className="now__sub">A multi-modal Parkinson’s wearable, proposed and built at IIT Bombay</span>
          </Link>
        </m.div>

        <m.dl
          className="hero__facts"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <div>
            <dt className="label">CGPA, six semesters</dt>
            <dd className="num">{education.cgpa.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="label">Internships</dt>
            <dd>IIT Bombay ×2, Scientechnic Dubai</dd>
          </div>
          <div>
            <dt className="label">Based</dt>
            <dd>{personal.location}</dd>
          </div>
        </m.dl>
      </section>

      {/* ------------------------------------------------ THESIS */}
      <SignalChain />

      {/* ------------------------------------------------ SELECTED WORK */}
      <section className="section work-home" aria-labelledby="work-h">
        <div className="wrap">
          <SecHead
            idx="01"
            title={<span id="work-h">Selected work</span>}
            aside={
              <Link to="/work" className="link">
                Index of all six <span className="arrow">→</span>
              </Link>
            }
          />
        </div>

        {/* Flagship */}
        <Reveal>
          <Link to="/work/parkinsense" className="flag" aria-label="ParkinSense case study">
            <div className="wrap flag__inner">
              <div className="flag__text">
                <span className="label label--accent">01 · Flagship · IIT Bombay 2026</span>
                <h3 className="flag__title serif">{ps.title}</h3>
                <p className="flag__sub">{ps.subtitle}</p>
                <p className="flag__desc muted">{ps.summary}</p>
                <dl className="flag__figs">
                  {ps.keyFigures.map((f) => (
                    <div key={f.label}>
                      <dt className="label">{f.label}</dt>
                      <dd className="num">
                        {f.value}
                        {f.unit && <small>{f.unit}</small>}
                      </dd>
                    </div>
                  ))}
                </dl>
                <span className="flag__cta link">
                  Read the case study <span className="arrow">→</span>
                </span>
              </div>
              <div className="flag__fig">
                <Photo
                  className="flag__photo"
                  src="assets/work/parkinsense-wrist"
                  width={1200}
                  height={1310}
                  alt="ParkinSense prototype worn on the wrist: a white 3D-printed enclosure on a black elastic strap"
                />
                <SignalFigure compact />
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="wrap">
          {/* TremoSense: offset technical panel */}
          <Reveal className="tremo">
            <Link to="/work/tremosense" className="tremo__link">
              <div className="tremo__head">
                <span className="label">{ts.index}</span>
                <h3 className="tremo__title serif">{ts.title}</h3>
                <p className="tremo__sub">{ts.subtitle}</p>
              </div>
              <div className="tremo__body">
                <DemoVideo className="tremo__demo" caption="Bench test, from the repo" />
                <div className="tremo__text">
                  <p className="tremo__desc">{ts.description}</p>
                  <p className="muted tremo__params">{ts.parameters}</p>
                  <span className="link">
                    EKF + LQR case study <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* NaviSight + Wall-E: compact ledger rows */}
          <div className="also">
            <span className="also__label label">Also</span>
            <ul className="also__list">
              {[
                { p: ns, tag: 'Assistive', chain: ['Ultrasonic → haptics', 'ESP32-CAM → TFLite, on-device'] },
                { p: rl, tag: 'Reinforcement learning', chain: ['Safety layer + Q-learning → lane, speed', 'DQN in PyTorch'] },
                { p: we, tag: 'Robotics · SRA', chain: ['Light sensor array → PID → motors'] },
                { p: tr, tag: 'Computer vision', chain: ['Camera → YOLOv8 → OCR', 'CSV log → Streamlit'] },
              ].map(({ p, tag, chain }, i) => (
                <Reveal as="li" key={p.slug} delay={i * 0.08}>
                  <Link to={`/work/${p.slug}`} className="also__row">
                    <span className="label">{p.index}</span>
                    <span className="also__title serif">{p.shortTitle ?? p.title}</span>
                    <span className="also__sub">
                      {p.subtitle}
                      <span className="label">{tag}</span>
                    </span>
                    <span className="also__chain">
                      {chain.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </span>
                    <span className="also__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ INTERESTS */}
      <Interests idx="02" />

      {/* ------------------------------------------------ EXPERIENCE */}
      <section className="section xp-home" aria-labelledby="xp-h">
        <div className="wrap">
          <SecHead
            idx="03"
            title={<span id="xp-h">Experience</span>}
            aside={
              <Link to="/experience" className="link">
                Full detail <span className="arrow">→</span>
              </Link>
            }
          />
          <ol className="xp-list">
            {experience.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 0.06} className="xp-row">
                <span className="xp-row__date label">{r.label}</span>
                <span className="xp-row__org">{r.org}</span>
                <span className="xp-row__role">
                  {r.title}
                  <span className="muted"> · {r.unit}</span>
                </span>
                <span className="xp-row__line muted">{r.headline}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ ACADEMICS */}
      <section className="section acad" aria-labelledby="acad-h">
        <div className="wrap acad__grid">
          <div className="acad__lead">
            <span className="label label--accent">04</span>
            <h2 id="acad-h" className="acad__big num">
              {education.cgpa.toFixed(2)}
            </h2>
            <p className="acad__of">
              CGPA out of 10 after six semesters of B.Tech, Electronics &amp; Telecommunication at VJTI, with a minor in
              AI / ML. {education.standing}.
            </p>
            <Link to="/education" className="link">
              Semester by semester <span className="arrow">→</span>
            </Link>
          </div>
          <Reveal className="acad__panel">
            <SemesterPanel compact />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ PERSONAL */}
      <section className="section outside" aria-labelledby="out-h">
        <div className="wrap outside__grid">
          <div className="outside__head">
            <span className="label label--accent">05</span>
            <h2 id="out-h" className="outside__title serif">
              Outside the lab
            </h2>
          </div>
          <ul className="outside__list">
            {extras.map((e) => (
              <li key={e.title}>
                <span className="outside__t">{e.title}</span>
                <span className="muted">{e.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ CONTACT */}
      <section className="section cta" aria-labelledby="cta-h">
        <div className="wrap">
          <span className="label label--accent">06 · Contact</span>
          <h2 id="cta-h" className="cta__title">
            Open to engineering, research and consulting work.
          </h2>
          <a className="cta__mail" href={`mailto:${personal.email}`}>
            {personal.email}
          </a>
          <div className="cta__row">
            <CopyEmail />
            <a className="link" href={personal.resume} target="_blank" rel="noopener">
              Résumé, PDF <span className="arrow">↗</span>
            </a>
            <Link to="/contact" className="link">
              Phone and profiles <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </Page>
  )
}

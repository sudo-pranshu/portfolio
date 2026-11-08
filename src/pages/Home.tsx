import { Link } from 'react-router-dom'
import { m, useReducedMotion } from 'motion/react'
import { Page } from '../components/Page'
import { Portrait } from '../components/Portrait'
import { Reveal } from '../components/Reveal'
import { SecHead } from '../components/SecHead'
import { CopyEmail } from '../components/CopyEmail'
import { Interests } from '../components/Interests'
import { DemoVideo } from '../components/DemoVideo'
import { Photo } from '../components/Photo'
import { Flagship } from '../components/Flagship'
import { SignalChain } from '../components/diagrams/SignalChain'
import { SemesterPanel } from '../components/diagrams/SemesterPanel'
import { personal, asset } from '../config/personal'
import { getProject } from '../data/projects'
import { education, experience, extras } from '../data/career'
import { easeOut, lineReveal } from '../animations/motion'

const ps = getProject('parkinsense')!
const cv = getProject('circuitvision')!
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
          <m.div
            className="hero__cta"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.8 }}
          >
            <Link to="/work" className="link">
              Selected work <span className="arrow">→</span>
            </Link>
            <Link to="/contact" className="link">
              Get in touch <span className="arrow">→</span>
            </Link>
          </m.div>
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
                Index of all seven <span className="arrow">→</span>
              </Link>
            }
          />
        </div>

        {/* Flagship collection: one template, three projects, equal weight */}
        <p className="flagships__hint label" aria-hidden="true">
          <span>Flagship projects</span>
          <span>Swipe →</span>
        </p>
        <div className="flagships" role="group" aria-label="Flagship projects">
          <Flagship
            project={ps}
            domain="Wearable · Embedded · Signal processing"
            chain="IMU 104 Hz + PPG → BLE → filters, Welch spectrum → tremor state, heart rate"
            ratio={1200 / 1310}
            caption="Prototype worn on the wrist"
            media={
              <Photo
                src="assets/work/parkinsense-wrist"
                width={1200}
                height={1310}
                alt="ParkinSense prototype worn on the wrist: a white 3D-printed enclosure on a black elastic strap"
              />
            }
          />
          <Flagship
            project={ts}
            flip
            domain="Control · Estimation · Embedded"
            chain="IMU 208 Hz → EKF roll, pitch → LQR → two servos every 10 ms"
            ratio={1.7}
            caption="Bench test, and Simulink roll and pitch response"
            media={
              <div className="fl__split">
                <DemoVideo bare />
                <img
                  src={asset('assets/work/tremosense-roll-sim.webp')}
                  alt="Simulink roll-axis frequency response of the TremoSense controller from 0 to 8 hertz"
                  width={1200}
                  height={641}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={asset('assets/work/tremosense-pitch-sim.webp')}
                  alt="Simulink pitch-axis frequency response of the TremoSense controller from 0 to 8 hertz"
                  width={1200}
                  height={639}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            }
          />
          <Flagship
            project={cv}
            domain="Computer vision · OCR · SPICE"
            chain="Photo → YOLOv8 → wire tracing → EasyOCR → SPICE netlist"
            ratio={1269 / 952}
            caption="Detector output on a hand-drawn circuit"
            media={
              <Photo
                src="assets/work/cv-detect-1"
                width={1269}
                height={952}
                alt="A hand-drawn audio circuit on grid paper with the detector's boxes over every resistor, capacitor, ground, junction and text label"
              />
            }
          />
        </div>

        <div className="wrap">
          {/* NaviSight + Wall-E: compact ledger rows */}
          <div className="also">
            <span className="also__label label">Also</span>
            <ul className="also__list">
              {[
                { p: ns, tag: 'Assistive', chain: ['Ultrasonic → haptics', 'ESP32-CAM → TFLite, on-device'] },
                { p: we, tag: 'Robotics · SRA', chain: ['Light sensor array → PID → motors'] },
                { p: rl, tag: 'Reinforcement learning', chain: ['Safety layer + Q-learning → lane, speed', 'DQN in PyTorch'] },
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
            <Link to="/resume" className="link">
              Résumé, 1 or 2 pages <span className="arrow">→</span>
            </Link>
            <Link to="/contact" className="link">
              Phone and profiles <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </Page>
  )
}

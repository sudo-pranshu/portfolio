import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { contactLinks, personal } from '../config/personal'
import { IndiaFlag, UaeFlag } from '../components/ContactIcons'
import { education, experience, semesters } from '../data/career'
import { getProject, projects, type Project } from '../data/projects'

const flags = { in: IndiaFlag, ae: UaeFlag } as const

const focus = ['Embedded systems', 'Electronics & hardware', 'Wearables', 'Signal processing', 'Computer vision', 'AI / ML', 'Research']

/** Every item below appears in a project, an internship or the résumé. `used` names where. */
const skillGroups = [
  {
    group: 'Electronics & Embedded',
    items: ['nRF52840', 'ESP32', 'Zephyr RTOS', 'FreeRTOS', 'ESP-IDF', 'Arduino', 'BLE', 'UDP', 'IMU and PPG sensing', 'Servo / PWM drive', 'KNX, BMS and DDC'],
    used: 'ParkinSense · TremoSense · Wall-E · NaviSight · IIT Bombay · Scientechnic',
  },
  {
    group: 'Programming & Software',
    items: ['C', 'C++', 'Python', 'SQL', 'FastAPI', 'Plotly Dash', 'Streamlit', 'Gradio', 'pytest', 'Git'],
    used: 'ParkinSense · CircuitVision · Traffic System · Wall-E',
  },
  {
    group: 'AI/ML & Computer Vision',
    items: ['YOLOv8', 'OpenCV', 'scikit-learn (HOG + SVM)', 'EasyOCR', 'Tesseract', 'TensorFlow Lite', 'PyTorch', 'NumPy', 'pandas', 'HMM', 'Q-learning / DQN'],
    used: 'CircuitVision · Traffic System · NaviSight · RL Car · ParkinSense',
  },
  {
    group: 'Signal Processing & Control',
    items: ['Welch spectra', 'Band-pass and notch filters', 'Peak detection', 'HRV', 'Extended Kalman filter', 'LQR', 'PID'],
    used: 'ParkinSense · TremoSense · Wall-E',
  },
  {
    group: 'Hardware & Dev Tools',
    items: ['MATLAB / Simulink', 'ngspice', 'AutoCAD', 'Arduino IDE', 'Linux', 'Excel'],
    used: 'TremoSense · CircuitVision · résumé',
  },
]

/** One verified result per flagship, with where it was measured. */
const achievement: Record<string, { value: string; text: string }> = {
  parkinsense: { value: '0.99', text: 'tremor sensitivity and 0.024 Hz median frequency error on a known-answer benchmark' },
  tremosense: { value: '> 90 %', text: 'roll-axis suppression across most of 3–7 Hz, from the project’s Simulink model' },
  circuitvision: { value: '0.904', text: 'detection mAP50 on photos from a drafter the model never saw' },
}

const flagshipSlugs = ['parkinsense', 'tremosense', 'circuitvision'] as const
const others = projects.filter((p) => !(flagshipSlugs as readonly string[]).includes(p.slug))

const contribution = (p: Project) => p.contributions?.[0] ?? `${p.role} · ${p.context}`

const sections = [
  ['education', 'Education'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['contact', 'Contact'],
] as const

function Sec({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rec__sec" id={id} aria-labelledby={`${id}-h`}>
      <header className="rec__sh">
        <span className="label label--accent">{n}</span>
        <h2 id={`${id}-h`} className="rec__h">
          {title}
        </h2>
      </header>
      <div className="rec__body">{children}</div>
    </section>
  )
}

export default function Recruiter() {
  return (
    <Page
      title="Recruiter overview | Pranshu Kumar"
      description="Pranshu Kumar, B.Tech EXTC at VJTI Mumbai: education, experience, skills, three flagship projects, résumé and contact details on one short page."
      path="/recruiter"
      className="rec"
    >
      <header className="wrap rec__hero">
        <span className="label label--accent">Recruiter overview</span>
        <h1 className="rec__name">{personal.name}</h1>
        <p className="rec__lede">
          B.Tech in Electronics &amp; Telecommunication Engineering at VJTI Mumbai, graduating {education.graduation}, with a minor in AI
          &amp; ML. I build sensing systems from the hardware up: firmware, wireless links, signal processing and machine learning.
        </p>
        <p className="rec__focus">
          <span className="label">Focus</span> {focus.join(' · ')}
        </p>
        <div className="rec__cta">
          <a className="rec__btn" href={personal.resume} download="Pranshu-Kumar-Resume.pdf">
            Download résumé <span aria-hidden="true">↓</span>
          </a>
          <a className="link" href={contactLinks.email}>
            {personal.email}
          </a>
          <a className="link" href={personal.github} target="_blank" rel="noopener noreferrer">
            GitHub <span className="arrow">↗</span>
          </a>
          <a className="link" href={personal.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn <span className="arrow">↗</span>
          </a>
        </div>
        <nav className="rec__jump" aria-label="On this page">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="label">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <div className="wrap rec__main">
        <Sec id="education" n="01" title="Education">
          <div className="rec__edu">
            <p className="rec__strong">{education.school} (VJTI), {education.city}</p>
            <p>
              {education.degree}, {education.branch}
              <br />
              Minor in {education.minor} · Graduating {education.graduation}
            </p>
            <dl className="rec__facts">
              <div>
                <dt className="label">CGPA</dt>
                <dd className="num">{education.cgpa.toFixed(2)} / 10</dd>
              </div>
              <div>
                <dt className="label">Semesters</dt>
                <dd className="num">six complete</dd>
              </div>
              <div>
                <dt className="label">Credits</dt>
                <dd className="num">{education.creditsEarned}</dd>
              </div>
              <div>
                <dt className="label">Standing</dt>
                <dd>Branch topper, first year</dd>
              </div>
            </dl>
            <p className="rec__sgpa muted">
              <span className="label">SGPA by semester</span> <span className="num">{semesters.map((s) => s.sgpa.toFixed(2)).join(' · ')}</span>
            </p>
          </div>
        </Sec>

        <Sec id="experience" n="02" title="Experience">
          <ol className="rec__list">
            {experience.map((r) => (
              <li key={r.id} className="rec__role">
                <span className="rec__when label">{r.label}</span>
                <div>
                  <h3 className="rec__title">
                    {r.title}, {r.org}
                  </h3>
                  <p className="rec__meta muted">
                    {r.unit} · {r.place}
                  </p>
                  <p>{r.headline}</p>
                  <details className="rec__more">
                    <summary className="link">Details</summary>
                    <ul>
                      {r.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    {r.link && (
                      <Link className="link" to={r.link.to}>
                        {r.link.label} <span className="arrow">→</span>
                      </Link>
                    )}
                  </details>
                </div>
              </li>
            ))}
          </ol>
        </Sec>

        <Sec id="skills" n="03" title="Skills">
          <dl className="rec__skills">
            {skillGroups.map((g) => (
              <div key={g.group} className="rec__skill">
                <dt className="rec__strong">{g.group}</dt>
                <dd>
                  {g.items.join(' · ')}
                  <span className="rec__used label">Used in: {g.used}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Sec>

        <Sec id="projects" n="04" title="Projects">
          <h3 className="label rec__sub">Flagship projects</h3>
          <ol className="rec__list">
            {flagshipSlugs.map((slug, i) => {
              const p = getProject(slug)!
              const a = achievement[slug]
              return (
                <li key={slug} className="rec__proj">
                  <span className="rec__idx label">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 className="rec__title">
                      <Link to={`/work/${slug}`}>{p.title}</Link>
                    </h4>
                    <p>{p.description}</p>
                    <dl className="rec__pd">
                      <div>
                        <dt className="label">My part</dt>
                        <dd>{contribution(p)}</dd>
                      </div>
                      <div>
                        <dt className="label">Stack</dt>
                        <dd>{p.technologies.join(' · ')}</dd>
                      </div>
                      <div>
                        <dt className="label">Result</dt>
                        <dd>
                          <span className="num rec__v">{a.value}</span> {a.text}
                        </dd>
                      </div>
                    </dl>
                    <p className="rec__links">
                      <Link className="link" to={`/work/${slug}`}>
                        Case study <span className="arrow">→</span>
                      </Link>
                      <Link className="link" to={`/lab?p=${slug}`}>
                        Engineering Lab <span className="arrow">→</span>
                      </Link>
                      {p.github && (
                        <a className="link" href={p.github} target="_blank" rel="noopener noreferrer">
                          GitHub <span className="arrow">↗</span>
                        </a>
                      )}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>

          <h3 className="label rec__sub">Other projects</h3>
          <ul className="rec__others">
            {others.map((p) => (
              <li key={p.slug}>
                <Link className="rec__strong" to={`/work/${p.slug}`}>
                  {p.shortTitle ?? p.title}
                </Link>
                <span>{p.subtitle}</span>
                <span className="muted">{p.technologies.slice(0, 5).join(' · ')}</span>
                {p.github && (
                  <a className="link" href={p.github} target="_blank" rel="noopener noreferrer">
                    GitHub <span className="arrow">↗</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Sec>

        <Sec id="contact" n="05" title="Résumé & contact">
          <div className="rec__docs">
            <a className="rec__btn" href={personal.resume} download="Pranshu-Kumar-Resume.pdf">
              Download résumé, 1 page <span aria-hidden="true">↓</span>
            </a>
            <a className="link" href={personal.resumeTwoPage} download="Pranshu-Kumar-Resume-2-page.pdf">
              2-page version <span aria-hidden="true">↓</span>
            </a>
          </div>
          <ul className="rec__ways">
            <li>
              <a className="link" href={contactLinks.email}>
                {personal.email}
              </a>
            </li>
            <li>
              <a className="link" href={personal.github} target="_blank" rel="noopener noreferrer">
                github.com/sudo-pranshu <span className="arrow">↗</span>
              </a>
            </li>
            <li>
              <a className="link" href={personal.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <span className="arrow">↗</span>
              </a>
            </li>
          </ul>
          <div className="rec__phones">
            {personal.phones.map((ph) => {
              const Flag = flags[ph.id]
              return (
                <div key={ph.id} className="rec__phone">
                  <p className="rec__strong">
                    <Flag /> {ph.label} <span className="num muted">{ph.display}</span>
                  </p>
                  <p className="rec__links">
                    <a className="link" href={contactLinks.call(ph)} aria-label={`Call ${ph.label} number ${ph.display}`}>
                      Call
                    </a>
                    <a
                      className="link"
                      href={contactLinks.whatsapp(ph)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${ph.label} number ${ph.display}, opens in a new tab`}
                    >
                      WhatsApp <span className="arrow">↗</span>
                    </a>
                    <a className="link" href={contactLinks.sms(ph)} aria-label={`Text ${ph.label} number ${ph.display}`}>
                      SMS
                    </a>
                  </p>
                </div>
              )
            })}
          </div>
        </Sec>
      </div>
    </Page>
  )
}

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Page } from '../components/Page'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { personal } from '../config/personal'

type Option = {
  id: string
  name: string
  tag: string
  recommended?: boolean
  blurb: string
  points: string[]
  pdf: string
  file: string
  preview: { src: string; alt: string }[]
}

const options: Option[] = [
  {
    id: 'two',
    name: 'Two pages',
    tag: 'Recommended',
    recommended: true,
    blurb:
      'The full record. Every role is written out, every project carries its measured results, and the engineering decisions behind them are visible.',
    points: [
      'ParkinSense in six bullets: the BLE protocol, Welch and HMM tremor analysis, PPG heart rate and HRV, step counting, runtime and tests',
      'CircuitVision with real-photo results as well as the headline detector score',
      'TremoSense with the Zephyr threads, EKF and LQR design, and the Simulink validation',
      'NaviSight in full: Echo-Stride and EyeCue, each with its sensors and software',
      'All three internships with their complete detail, including the AV and BMS work',
    ],
    pdf: personal.resumeTwoPage,
    file: 'Pranshu-Kumar-Resume-2-page.pdf',
    preview: [
      { src: 'assets/resume-2p-1', alt: 'Page 1 of the two-page résumé: education, skills, three internships and the start of ParkinSense' },
      { src: 'assets/resume-2p-2', alt: 'Page 2 of the two-page résumé: TremoSense, NaviSight, CircuitVision, Wall-E and achievements' },
    ],
  },
  {
    id: 'one',
    name: 'One page',
    tag: 'Compact',
    blurb:
      'A fast read for a first screen: the same experience and projects, cut down to the essentials. Plain single-column text that applicant-tracking systems parse cleanly.',
    points: [
      'Every role and project, a few bullets each',
      'Headline results only, without the supporting detail',
      'Best for quick reviews and portals that ask for one page',
    ],
    pdf: personal.resume,
    file: 'Pranshu-Kumar-Resume-1-page.pdf',
    preview: [{ src: 'assets/resume-1p', alt: 'The one-page résumé: education, skills, three internships and five projects' }],
  },
]

export default function Resume() {
  const navigate = useNavigate()
  const location = useLocation()
  // A key of "default" means this page was the first one opened, so there is nothing to go back to.
  const canGoBack = location.key !== 'default'

  return (
    <Page
      title="Résumé | Pranshu Kumar"
      description="Pranshu Kumar's résumé as a one-page summary or a detailed two-page PDF."
      path="/resume"
      className="resume"
    >
      <section className="wrap page-head">
        <div className="resume__back">
          {canGoBack ? (
            <button type="button" className="link" onClick={() => navigate(-1)}>
              <span className="arrow" aria-hidden="true">←</span> Back
            </button>
          ) : (
            <Link to="/" className="link">
              <span className="arrow" aria-hidden="true">←</span> Home
            </Link>
          )}
        </div>
        <span className="label label--accent">Résumé</span>
        <h1 className="page-head__title display">Choose a version</h1>
        <p className="page-head__lede serif">
          The two-page version is the one I’d send: it holds the detail and measured results that the one-page cut has to
          leave out. Use the one-page version when a form or a first screen asks for brevity.
        </p>
      </section>

      <section className="wrap resume__grid" aria-label="Résumé versions">
        {options.map((o, i) => (
          <Reveal key={o.id} delay={i * 0.08} className={`rcard ${o.recommended ? 'rcard--rec' : ''}`}>
            <article aria-labelledby={`r-${o.id}`}>
              <header className="rcard__head">
                <span className={`label ${o.recommended ? 'label--accent' : ''}`}>{o.tag}</span>
                <h2 id={`r-${o.id}`} className="rcard__title serif">
                  {o.name}
                </h2>
              </header>
              <div className="rcard__prev">
                {o.preview.map((p) => (
                  <Photo key={p.src} className="rcard__page" src={p.src} width={935} height={1210} alt={p.alt} />
                ))}
              </div>
              <p className="rcard__blurb">{o.blurb}</p>
              <ul className="rcard__points">
                {o.points.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="rcard__actions">
                <a className="rbtn rbtn--primary" href={o.pdf} target="_blank" rel="noopener">
                  Open PDF <span aria-hidden="true">↗</span>
                </a>
                <a className="rbtn" href={o.pdf} download={o.file}>
                  Download <span aria-hidden="true">↓</span>
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </Page>
  )
}

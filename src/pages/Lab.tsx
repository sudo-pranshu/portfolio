import { useRef, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Page } from '../components/Page'
import { Reveal } from '../components/Reveal'
import { PipelineExplorer } from '../components/lab/PipelineExplorer'
import { SignalLab } from '../components/lab/SignalLab'
import { Decisions } from '../components/lab/Decisions'
import { WristDemo } from '../components/WristDemo'
import { SpoonDemo } from '../components/SpoonDemo'
import { BenchVideo } from '../components/BenchVideo'
import { ControlLoop } from '../components/diagrams/ControlLoop'
import { CVPipeline } from '../components/cv/CVPipeline'
import { BeforeAfter } from '../components/cv/BeforeAfter'
import { asset } from '../config/personal'
import { getProject } from '../data/projects'
import {
  circuitvisionDecisions,
  parkinsenseDecisions,
  parkinsenseStages,
  tremosenseDecisions,
  tremosenseStages,
} from '../data/lab'

const tabs = [
  { id: 'parkinsense', n: '01', name: 'ParkinSense', tag: 'Wearable · BLE · signal processing' },
  { id: 'tremosense', n: '02', name: 'TremoSense', tag: 'Estimation · control · embedded' },
  { id: 'circuitvision', n: '03', name: 'CircuitVision', tag: 'Vision · OCR · SPICE' },
] as const
type Id = (typeof tabs)[number]['id']

function Block({ n, title, lede, children }: { n: string; title: string; lede?: string; children: React.ReactNode }) {
  return (
    <section className="lab__block">
      <Reveal className="lab__bh">
        <span className="label label--accent">{n}</span>
        <h2 className="lab__bt serif">{title}</h2>
        {lede && <p className="muted">{lede}</p>}
      </Reveal>
      {children}
    </section>
  )
}

function Links({ slug }: { slug: Id }) {
  const p = getProject(slug)!
  return (
    <div className="lab__links">
      <Link className="link" to={`/work/${slug}`}>
        Full case study <span className="arrow">→</span>
      </Link>
      {p.github && (
        <a className="link" href={p.github} target="_blank" rel="noreferrer">
          GitHub <span className="arrow">↗</span>
        </a>
      )}
    </div>
  )
}

function ParkinSensePanel() {
  return (
    <>
      <Block n="A" title="Architecture, stage by stage" lede="Eight stages from the wrist to the dashboard. Select one, or follow the data from the sensor to the screen.">
        <PipelineExplorer stages={parkinsenseStages} label="ParkinSense pipeline" />
      </Block>
      <Block n="B" title="Find the tremor in the spectrum" lede="Change the tremor frequency, size and noise, and watch the analysis find the peak, or correctly decline to call one. Switch the trace to the 0.5–3 Hz arm-movement band the pipeline uses for context.">
        <SignalLab />
      </Block>
      <Block n="C" title="What the band reports" lede="Resting, tremor and walking, with the values the band shows for each.">
        <div className="lab__demo">
          <WristDemo />
        </div>
      </Block>
      <Block n="D" title="Decisions and challenges" lede="From the decision records and status documents in the repository.">
        <Decisions items={parkinsenseDecisions} />
        <Links slug="parkinsense" />
      </Block>
    </>
  )
}

function TremoSensePanel() {
  return (
    <>
      <Block n="A" title="From IMU to servo" lede="The implemented chain, and the stages that are deliberately not part of it.">
        <PipelineExplorer stages={tremosenseStages} label="TremoSense pipeline" />
        <Reveal className="lab__loop">
          <ControlLoop />
        </Reveal>
      </Block>
      <Block n="B" title="Stabilisation, and the real build" lede="Switch the controller on and off, then watch the actual bench clip from the project repository.">
        <div className="lab__pair">
          <SpoonDemo />
          <figure className="lab__video">
            <BenchVideo />
            <figcaption className="label">Bench clip from the repository · hand against gimbal</figcaption>
          </figure>
        </div>
      </Block>
      <Block n="C" title="Experimental evidence" lede="Frequency response and time traces from the project’s MATLAB / Simulink model, with roll and pitch coupled.">
        <div className="lab__figs">
          <figure className="ts-plot">
            <img src={asset('assets/work/tremosense-roll-sim.webp')} width={1200} height={641} loading="lazy" decoding="async" alt="Roll-axis magnitude and phase response from 0 to 8 hertz for tremor amplitudes of 2 to 7 degrees; magnitude stays below the 90 percent suppression line across most of the band." />
            <figcaption className="label">Roll axis · &gt; 90 % suppression across most of 3–7 Hz</figcaption>
          </figure>
          <figure className="ts-plot">
            <img src={asset('assets/work/tremosense-pitch-sim.webp')} width={1200} height={639} loading="lazy" decoding="async" alt="Pitch-axis magnitude and phase response from 0 to 8 hertz for tremor amplitudes of 2 to 7 degrees." />
            <figcaption className="label">Pitch axis · &gt; 80 % suppression across most of 3–7 Hz</figcaption>
          </figure>
          <figure className="ts-plot">
            <img src={asset('assets/work/tremosense-lqr-sim.webp')} width={1400} height={735} loading="lazy" decoding="async" alt="LQR counter-motion against the tremor input for roll and pitch, with the small residual motion below." />
            <figcaption className="label">LQR counter-motion · residual RMS 0.346° roll, 0.573° pitch (Simulink)</figcaption>
          </figure>
        </div>
      </Block>
      <Block n="D" title="Decisions and challenges" lede="From the repository, its commit log and the MATLAB / Simulink scripts.">
        <Decisions items={tremosenseDecisions} />
        <Links slug="tremosense" />
      </Block>
    </>
  )
}

function CircuitVisionPanel() {
  return (
    <>
      <Block n="A" title="From photo to netlist" lede="Seven stages, each with the real output it produced on an actual hand-drawn circuit. Select a stage.">
        <div className="lab__cv">
          <CVPipeline />
        </div>
      </Block>
      <Block n="B" title="Before and after" lede="Drag the divider across a real photo of a hand-drawn circuit and the detector’s output.">
        <div className="lab__cv">
          <BeforeAfter />
        </div>
      </Block>
      <Block n="C" title="Decisions and challenges" lede="From the experiment log, the status document and the dataset audits in the repository.">
        <Decisions items={circuitvisionDecisions} />
        <Links slug="circuitvision" />
      </Block>
    </>
  )
}

export default function Lab() {
  const [params, setParams] = useSearchParams()
  const q = params.get('p')
  const id: Id = tabs.some((t) => t.id === q) ? (q as Id) : 'parkinsense'
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = tabs.findIndex((t) => t.id === id)

  const pick = (n: number) => {
    setParams({ p: tabs[n].id }, { replace: true, preventScrollReset: true })
    refs.current[n]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    let n = idx
    if (e.key === 'ArrowRight') n = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') n = (idx + tabs.length - 1) % tabs.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = tabs.length - 1
    else return
    e.preventDefault()
    pick(n)
  }

  return (
    <Page
      title="The Engineering Lab | Pranshu Kumar"
      description="Explore the engineering behind ParkinSense, TremoSense and CircuitVision: interactive pipelines, signal analysis, demonstrations, and the decisions behind each system."
      path="/lab"
      className="lab"
    >
      <header className="wrap lab__head">
        <span className="label label--accent">02 · Lab</span>
        <h1 className="lab__title serif">The Engineering Lab</h1>
        <p className="lab__sub">Explore the engineering behind the systems.</p>
      </header>

      <div className="lab__tabs-wrap">
        <div className="wrap">
          <div className="lab__tabs" role="tablist" aria-label="Project" onKeyDown={onKey}>
            {tabs.map((t, k) => (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[k] = el
                }}
                role="tab"
                id={`lab-tab-${t.id}`}
                aria-selected={t.id === id}
                aria-controls="lab-panel"
                tabIndex={t.id === id ? 0 : -1}
                className="lab__tab"
                onClick={() => pick(k)}
              >
                <span className="label">{t.n}</span>
                <span className="lab__tabname">{t.name}</span>
                <span className="lab__tabtag">{t.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap lab__panel" role="tabpanel" id="lab-panel" aria-labelledby={`lab-tab-${id}`} key={id}>
        {id === 'parkinsense' && <ParkinSensePanel />}
        {id === 'tremosense' && <TremoSensePanel />}
        {id === 'circuitvision' && <CircuitVisionPanel />}
      </div>
    </Page>
  )
}

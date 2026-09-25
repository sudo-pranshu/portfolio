import { Page } from '../components/Page'
import { Portrait } from '../components/Portrait'
import { Reveal } from '../components/Reveal'
import { DomainMatrix } from '../components/diagrams/DomainMatrix'
import { SecHead } from '../components/SecHead'
import { Interests } from '../components/Interests'
import { extras, skills } from '../data/career'

export default function About() {
  return (
    <Page
      title="About | Pranshu Kumar"
      description="Pranshu Kumar is an interdisciplinary Electronics & Telecommunication student at VJTI Mumbai, minor in AI/ML, interested in hardware, semiconductors, embedded and intelligent systems, and technology consulting."
      path="/about"
    >
      <section className="wrap page-head about-head">
        <div className="about-head__text">
          <span className="label label--accent">02 · About</span>
          <h1 className="page-head__title display">Sensor to decision</h1>
          <div className="about-head__prose">
            <p className="serif about-head__lede">
              I like knowing what happens between a physical event and the number someone reads on a screen.
            </p>
            <div className="prose">
              <p>
                A hand trembles a few times a second. An accelerometer turns that into a voltage, firmware turns the
                voltage into samples, a radio moves them, a filter separates the tremor from everything else the wrist
                is doing, and something has to decide what it means. Each of those steps belongs to a different
                discipline. Most of what I have built crosses several of them.
              </p>
              <p>
                That is why the projects don’t share one label. ParkinSense is a wearable, a radio protocol and a DSP
                problem at once. TremoSense is estimation and control on a real-time OS. NaviSight puts a neural network
                on a camera module. The RL car is a learning agent that still needs a safety layer. At Scientechnic I saw
                the same thinking at building scale, with lighting controllers and BMS I/O instead of sensors on a wrist.
              </p>
              <p>
                I study Electronics &amp; Telecommunication at VJTI, with a minor in AI and machine learning, and
                graduate in June 2027. Next I want to go lower, into digital design, VLSI and semiconductors, and wider,
                into systems engineering, research and technology consulting.
              </p>
            </div>
          </div>
        </div>
        <Portrait className="about-head__pic" caption="Fig. 02 · Mumbai / Dubai" />
      </section>

      <section className="section wrap" aria-labelledby="matrix-h">
        <SecHead
          idx="A"
          title={<span id="matrix-h">Where the work sits</span>}
          aside="Each mark is a place the discipline was used, not a self-rating."
        />
        <Reveal>
          <DomainMatrix />
        </Reveal>
      </section>

      <Interests idx="B" id="interests-about-h" />

      <section className="section wrap" aria-labelledby="tools-h">
        <SecHead idx="C" title={<span id="tools-h">Tools</span>} aside="Listed, not rated." />
        <div className="tools">
          {skills.map((g) => (
            <div key={g.group} className="tools__group">
              <h3 className="label">{g.group}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="rec-h">
        <SecHead idx="D" title={<span id="rec-h">Record</span>} />
        <ul className="record">
          {extras.map((e) => (
            <li key={e.title}>
              <span className="record__t">{e.title}</span>
              <span className="muted">{e.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}

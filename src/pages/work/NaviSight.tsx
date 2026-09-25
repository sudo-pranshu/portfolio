import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { AssistMatrix } from '../../components/diagrams/AssistMatrix'
import { getProject } from '../../data/projects'

const p = getProject('navisight')!

export default function NaviSight() {
  return (
    <Page
      title="NaviSight | Assistive Navigation: Echo-Stride + EyeCue | Pranshu Kumar"
      description="NaviSight: Echo-Stride, an ultrasonic smart cane with haptic alerts and GPS location sharing, and EyeCue, an ESP32-CAM module running TensorFlow Lite object recognition on-device."
      path="/work/navisight"
      className="case case--ns"
    >
      <CaseHeader p={p} />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
      </section>

      <section className="wrap twin" aria-label="The two devices">
        <article className="twin__col">
          <span className="twin__tag">A</span>
          <h2 className="twin__title">Echo-Stride</h2>
          <p className="twin__what">Smart cane</p>
          <p className="twin__lede">
            Ultrasonic sensors on an Arduino Uno watch the path ahead. When something is in the way, a vibration motor
            and a buzzer alert the user. A GPS and Bluetooth link also shares their location with trusted contacts.
          </p>
          <p className="twin__note muted">Housed in an ergonomic casing built for daily use.</p>
        </article>

        <article className="twin__col">
          <span className="twin__tag">B</span>
          <h2 className="twin__title">EyeCue</h2>
          <p className="twin__what">Wearable vision module</p>
          <p className="twin__lede">
            An ESP32-CAM captures frames and runs a lightweight TensorFlow Lite model on the board itself. No network,
            low power.
          </p>
          <p className="twin__note muted">Text-to-speech and a smaller, lower-power build are in progress.</p>
        </article>
      </section>

      <section className="wrap amx-band" aria-label="How the system works">
        <AssistMatrix />
      </section>

      <CaseSection n="01" title="Why two devices" kicker="Different questions, different sensors." id="why">
        <p className="prose">
          A cane answers “is there something in front of me?” quickly, and sonar is good at that. It can’t
          say what the obstacle is. EyeCue answers that second question with a camera and a model, without depending on
          a network connection. Location sharing covers the third concern: someone else knowing where the user is.
        </p>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

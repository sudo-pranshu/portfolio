import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { Reveal } from '../../components/Reveal'
import { Photo } from '../../components/Photo'
import { ArchDiagram } from '../../components/diagrams/ArchDiagram'
import { PacketTiming } from '../../components/diagrams/PacketTiming'
import { SignalFigure } from '../../components/diagrams/SignalFigure'
import { Stages } from '../../components/diagrams/Stages'
import { LockStates } from '../../components/diagrams/LockStates'
import { getProject } from '../../data/projects'

const p = getProject('parkinsense')!

const changes = [
  ['Single-modality tremor wearables that ignore cardiac and activity context', 'Motion, PPG and activity fused on one synchronised 104 Hz stream'],
  ['Offline, single-axis tremor analysis, often FFT-only', 'Real-time, multi-axis scoring with temporal validation and motion context'],
  ['Pedometers that count tremor and device handling as steps', 'A step counter gated by the motion pipeline’s activity classifier'],
  ['Single-channel readings reported without context', 'A motion-aware confidence model linking cardiac and activity readings to tremor state'],
]

export default function ParkinSense() {
  return (
    <Page
      title="ParkinSense | Multi-Modal Parkinson's Wearable | Pranshu Kumar"
      description="ParkinSense: a wrist wearable on the XIAO nRF52840 with an LSM6DS3 IMU and MAX30102 PPG, streaming over BLE into three real-time pipelines for tremor, heart rate, HRV, SpO₂ and gait, with a live dashboard and Android app."
      path="/work/parkinsense"
      className="case case--ps"
    >
      <CaseHeader p={p} flagship />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
        <p className="cabstract__note muted">
          Conceived, pitched and built independently during the Machine Intelligence Program at IIT Bombay: firmware,
          BLE protocol, signal processing and dashboard. It is a research prototype, not a medical device, and has not
          been clinically validated.
        </p>
      </section>

      <section className="wrap ps-photos" aria-label="The prototype">
        <Photo
          className="ps-photos__main"
          src="assets/work/parkinsense-wrist"
          width={1200}
          height={1310}
          eager
          alt="ParkinSense prototype worn on the wrist: a white 3D-printed enclosure on a black elastic strap"
          caption="The prototype on the wrist"
        />
        <Photo
          className="ps-photos__side"
          src="assets/work/parkinsense-enclosure"
          width={1200}
          height={1071}
          alt="The 3D-printed enclosure and strap beside the open electronics tray holding the XIAO nRF52840 Sense and sensor board"
          caption="Enclosure, strap and electronics tray. 700 mAh Li-ion, USB-C charging"
        />
      </section>

      <section className="wrap arch-band" aria-labelledby="arch-h">
        <div className="arch-band__head">
          <span className="label label--accent">01</span>
          <h2 id="arch-h" className="csec__title">
            System
          </h2>
          <p className="muted">Wrist to screen in four zones. The three host pipelines share state rather than running blind.</p>
        </div>
        <ArchDiagram />
      </section>

      <CaseSection n="02" title="Sampling and link" kicker="Two sensors at their own rates, one timestamped stream." id="hw">
        <p className="prose csec__p">
          The IMU samples at 104 Hz and the PPG at about 50 Hz. The firmware only acquires, timestamps and packs: ten
          samples go into each versioned binary BLE packet, so motion and pulse arrive aligned in time and every
          pipeline works on the same clock. All processing happens on the host, which keeps the firmware small and
          deterministic while the algorithms change.
        </p>
        <dl className="spec">
          <div className="spec__row">
            <dt className="label">Header</dt>
            <dd>Version, flags, reserved, timestamp</dd>
          </div>
          <div className="spec__row">
            <dt className="label">Each sample</dt>
            <dd>Accel X Y Z and gyro X Y Z as int16; IR and red as uint32</dd>
          </div>
          <div className="spec__row">
            <dt className="label">Link</dt>
            <dd>BLE 5.0, MTU 247, 248-byte packets</dd>
          </div>
        </dl>
        <Reveal>
          <PacketTiming />
        </Reveal>
      </CaseSection>

      <CaseSection n="03" title="Motion pipeline" kicker="Tremor, separated from everything else the wrist does." wide id="motion">
        <Stages
          label="Motion pipeline stages"
          dense
          stages={[
            { name: 'Gravity removal', detail: 'Static 1 g offset out' },
            { name: '50 Hz notch', detail: 'Mains pickup' },
            { name: '4.0–7.5 Hz band-pass', detail: 'Butterworth' },
            { name: 'Multi-axis features', detail: 'All axes scored' },
            { name: 'Hysteresis state machine', detail: 'Temporal validation' },
            { name: 'Confidence estimator', detail: 'Decoupled from state' },
          ]}
        />
        <div className="csec__split">
          <p className="prose">
            Detection runs on every axis rather than one, and a tremor is only declared once it persists. Entering and
            leaving the tremor state use different thresholds, so the state doesn’t flicker at the boundary.
          </p>
          <p className="prose">
            The confidence estimate is computed separately from the state itself. That split is what cuts false
            positives from voluntary movement: a big arm swing can look tremor-like for a moment without the system
            committing to it.
          </p>
        </div>
        <Reveal className="csec__fig">
          <SignalFigure />
        </Reveal>
      </CaseSection>

      <CaseSection n="04" title="Cardiac pipeline" kicker="PPG, written from scratch." wide id="ppg">
        <Stages
          label="PPG pipeline stages"
          dense
          stages={[
            { name: 'Finger detection', detail: 'With hysteresis' },
            { name: 'Signal Quality Index', detail: 'Is this readable?' },
            { name: 'Adaptive peak detection', detail: 'Beat positions' },
            { name: 'RR intervals', detail: 'Beat to beat' },
            { name: 'HR · HRV · SpO₂', detail: 'Outputs' },
          ]}
        />
        <div className="csec__split csec__split--top">
          <Reveal>
            <LockStates />
          </Reveal>
          <dl className="spec">
            <div className="spec__row">
              <dt className="label">Heart rate</dt>
              <dd>From RR intervals</dd>
            </div>
            <div className="spec__row">
              <dt className="label">HRV</dt>
              <dd>RMSSD, SDNN, pNN50</dd>
            </div>
            <div className="spec__row">
              <dt className="label">SpO₂</dt>
              <dd>Ratio-of-ratios estimate, red / IR</dd>
            </div>
          </dl>
        </div>
      </CaseSection>

      <CaseSection n="05" title="Activity pipeline" kicker="Steps that aren’t tremor." wide id="activity">
        <Stages
          label="Step tracking stages"
          dense
          stages={[
            { name: 'Adaptive threshold', detail: 'Mean + kσ' },
            { name: 'Hysteresis peaks', detail: 'Clean crossings' },
            { name: 'Refractory gating', detail: 'No double counts' },
            { name: 'Activity gate', detail: 'From motion classifier' },
            { name: 'Step count', detail: 'Gait, not shaking' },
          ]}
        />
        <p className="prose csec__p">
          Standard pedometer algorithms count any periodic wrist motion. For a Parkinson’s wearable that is exactly the
          wrong behaviour: tremor and device handling become “steps”. Here the step detector only counts when the
          motion pipeline’s activity classifier agrees the wearer is walking.
        </p>
      </CaseSection>

      <CaseSection n="06" title="Dashboard and app" kicker="The UI reads the pipelines; it isn’t part of them." wide id="dash">
        <p className="prose csec__p">
          A Plotly Dash dashboard refreshes every 100 ms from the runtime’s JSON and CSV output, grouped into
          Parkinson’s, activity and vitals. It never imports the pipeline code, so pipelines can be replayed or
          replaced without touching the UI. An Android companion app runs all three pipelines on the phone, with
          session recording, history and export.
        </p>
        <div className="ps-dash">
          <Photo
            src="assets/work/parkinsense-dashboard-normal"
            width={1400}
            height={820}
            alt="ParkinSense dashboard at rest: status No Tremor, tremor score 65, low motion, heart rate 93.7 BPM, SpO2 94.9 percent"
            caption="At rest: no tremor"
          />
          <Photo
            src="assets/work/parkinsense-dashboard-tremor"
            width={1400}
            height={820}
            alt="ParkinSense dashboard during tremor: status Tremor, tremor score 85, frequency 4.88 Hz, severity high"
            caption="Tremor detected at 4.88 Hz"
          />
        </div>
      </CaseSection>

      <CaseSection n="07" title="Power" kicker="Measured, not estimated from datasheets." id="power">
        <p className="prose">
          The finger-detection signal from the PPG pipeline doubles as a power switch: when the band leaves the skin,
          the firmware stops sensing and sleeps, and it wakes on contact with no button.
        </p>
        <dl className="spec">
          <div className="spec__row">
            <dt className="label">Active</dt>
            <dd>~7 mA, sensing + BLE (Nordic Power Profiler Kit II)</dd>
          </div>
          <div className="spec__row">
            <dt className="label">Deep sleep</dt>
            <dd>Microamp range</dd>
          </div>
          <div className="spec__row">
            <dt className="label">Battery</dt>
            <dd>3.7 V, 700 mAh Li-ion</dd>
          </div>
          <div className="spec__row">
            <dt className="label">Runtime</dt>
            <dd>~100 h continuous, estimated from the measured current</dd>
          </div>
        </dl>
      </CaseSection>

      <CaseSection n="08" title="What it changes" kicker="Against the common approach in prior wearable Parkinson’s research." wide id="delta">
        <div className="delta">
          <div className="delta__row delta__row--head" aria-hidden="true">
            <span className="label">Common approach</span>
            <span className="label label--accent">ParkinSense</span>
          </div>
          <ol>
            {changes.map(([a, b]) => (
              <Reveal as="li" key={a} className="delta__row">
                <span className="delta__a">
                  <span className="sr-only">Common approach: </span>
                  {a}
                </span>
                <span className="delta__b">
                  <span className="sr-only">ParkinSense: </span>
                  {b}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

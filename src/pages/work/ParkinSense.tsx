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

/** Source: github.com/sudo-pranshu/ParkinSense, branch develop, pipeline 3.0.0 (README, docs/validation/RESULTS.md, ADRs). */

const results: [string, string, string][] = [
  ['Tremor sensitivity', '0.692', '0.986'],
  ['Tremor specificity (rest, voluntary, walking, vibration, 8.5–11 Hz)', '0.983', '1.000'],
  ['Tremor F1', '0.798', '0.993'],
  ['Strong tremor, 120–250 deg/s, detected', '38 %', '97 %'],
  ['8.5–11 Hz oscillation called PD tremor', '8.6 %', '0 %'],
  ['Frequency error, median / p90', '0.090 / 0.219 Hz', '0.024 / 0.096 Hz'],
  ['Onset latency, median', '1.1 s', '6.1 s (deliberate)'],
  ['False steps per minute during rest tremor', '23.3', '0.3'],
  ['Heart-rate MAE at rest, ~100 Hz PPG', '17.8 BPM', '0.37 BPM'],
  ['RMSSD MAE, ~100 Hz PPG', '91.6 ms', '6.7 ms'],
  ['HR confidence under motion artefact, median', '0.84', '0.17 (flagged)'],
]

const status: [string, string, string][] = [
  ['BLE acquisition, recording, provenance', 'Working', 'Integration tests; hardware use with firmware v4'],
  ['Deterministic replay through the live pipeline', 'Working', 'Live and replay outputs identical (test)'],
  ['Rest-tremor detection, frequency, amplitude', 'Working on synthetic data', 'No patient data yet'],
  ['Heart rate and HRV', 'Working on synthetic data', 'HRV needs the ≥ 25 Hz PPG of firmware 5.0.0; no ECG comparison yet'],
  ['SpO₂', 'Uncalibrated estimate', 'No reference oximeter data'],
  ['Steps and cadence', 'Working, known false steps', 'Purposeful arm movement still counts as steps'],
  ['Firmware 5.0.0, BLE protocol v2', 'Written and host-tested', 'Not yet flashed; v4 is the verified build'],
  ['Bradykinesia, sleep, medication response', 'Planned', 'Need labelled data; sleep is blocked by finger-gated streaming'],
]

export default function ParkinSense() {
  return (
    <Page
      title="ParkinSense | Wearable Parkinson's Tremor Monitoring Platform | Pranshu Kumar"
      description="ParkinSense: an nRF52840 wearable streaming IMU and PPG over BLE to a reproducible Python pipeline for rest-tremor frequency and amplitude, heart rate, HRV and steps, with quality states, provenance and bit-exact replay."
      path="/work/parkinsense"
      className="case case--ps"
    >
      <CaseHeader p={p} flagship />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
        <p className="cabstract__note muted">
          Research use only. It is not a medical device, and no output has been clinically validated: every accuracy
          figure on this page comes from synthetic signals with known ground truth or from a few unlabelled recordings.
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
          caption="Enclosure, strap and electronics tray. 700 mAh Li-ion, USB-C"
        />
      </section>

      <CaseSection n="01" title="Why" kicker="The problem it is built to study." id="why">
        <p className="prose">
          Parkinson’s rest tremor comes and goes through the day, but it is usually judged in a short clinic visit.
          Continuous wrist sensing could measure how often it happens, at what frequency and how strongly. Doing that
          credibly needs more than a detector: every number has to say whether it can be trusted, every recording has
          to say which code produced it, and any session has to be re-runnable when the algorithm improves.
        </p>
      </CaseSection>

      <section className="wrap arch-band" aria-labelledby="arch-h">
        <div className="arch-band__head">
          <span className="label label--accent">02</span>
          <h2 id="arch-h" className="csec__title">
            System
          </h2>
          <p className="muted">
            Two clocks: per sample (104 Hz) for buffering and recording, per analysis (every 0.5 s over a 4 s window)
            for tremor and PPG. Everything runs on device signal time, which is why live and replayed results match.
          </p>
        </div>
        <ArchDiagram />
      </section>

      <CaseSection n="03" title="Hardware and firmware" kicker="Acquire, timestamp, pack; nothing else on the device." id="hw">
        <dl className="spec">
          <div className="spec__row">
            <dt className="label">MCU</dt>
            <dd>Seeed XIAO nRF52840 Sense, Cortex-M4F, BLE 5</dd>
          </div>
          <div className="spec__row">
            <dt className="label">IMU</dt>
            <dd>LSM6DS3 over I²C; firmware 5.0.0 sets ±4 g, ±500 dps, 104 Hz output rate</dd>
          </div>
          <div className="spec__row">
            <dt className="label">PPG</dt>
            <dd>MAX30102 red + IR, 100 SPS FIFO; ~100 Hz to the host with v5, 10 Hz with v4</dd>
          </div>
          <div className="spec__row">
            <dt className="label">Packet</dt>
            <dd>208 bytes: 8-byte header (version, flags, sequence, time) + 10 × 20-byte samples</dd>
          </div>
          <div className="spec__row">
            <dt className="label">Integrity</dt>
            <dd>Sequence numbers for loss, timestamp gap detection, measured device rate; v2 flags for clipping and dropped notifications</dd>
          </div>
        </dl>
        <p className="prose csec__p">
          Firmware v4 is the hardware-verified build used for data collection. Version 5.0.0 adds protocol v2, sensor
          settings applied before start-up (v4 applied them too late), and sleeping between samples. It is written and
          tested on the host, and waits on a hardware test procedure before replacing v4.
        </p>
        <Reveal>
          <PacketTiming />
        </Reveal>
      </CaseSection>

      <CaseSection n="04" title="Tremor analysis" kicker="Frequency in Hz, amplitude in deg/s, and how sure." wide id="tremor">
        <Stages
          label="Tremor pipeline stages"
          dense
          stages={[
            { name: 'Welch PSD', detail: 'Per gyro axis, 2 s Hann, summed' },
            { name: 'Peak 3.5–7.5 Hz', detail: 'Gaussian interpolation' },
            { name: 'Amplitude', detail: '√ power within ±0.625 Hz' },
            { name: 'Rejection', detail: 'SNR, band edge, arm-swing harmonic' },
            { name: 'Evidence', detail: 'Score in [0, 1] with motion context' },
            { name: 'HMM filter', detail: '2-state forward filter' },
          ]}
        />
        <div className="csec__split">
          <p className="prose">
            The spectrum is computed on the raw gyroscope. The earlier version band-passed it first, which made the
            tremor-band ratio close to 1 for almost any input. Motion context (rest, low motion, active) uses only
            0.2–3 Hz content, so tremor can’t pass itself off as movement.
          </p>
          <p className="prose">
            A two-state hidden Markov model filters the per-window evidence over time and publishes the tremor state
            with a probability. It needs about 1.4 windows of independent evidence, so onset takes ~6 s instead of ~1
            s: a deliberate trade for no false calls on 8.5–11 Hz oscillation.
          </p>
        </div>
        <Reveal className="csec__fig">
          <SignalFigure />
        </Reveal>
      </CaseSection>

      <CaseSection n="05" title="Heart and activity" kicker="Each value carries a quality state." wide id="ppg">
        <div className="csec__split csec__split--top">
          <dl className="spec">
            <div className="spec__row">
              <dt className="label">Heart rate</dt>
              <dd>0.5–4.5 Hz band-pass, peak detection with dicrotic-notch guard, median RR, EMA</dd>
            </div>
            <div className="spec__row">
              <dt className="label">HRV</dt>
              <dd>RMSSD, SDNN, pNN50; withheld below a 25 Hz effective PPG rate</dd>
            </div>
            <div className="spec__row">
              <dt className="label">Motion artefact</dt>
              <dd>Confidence cut, and a flag when heart rate matches the motion frequency or twice it</dd>
            </div>
            <div className="spec__row">
              <dt className="label">SpO₂</dt>
              <dd>Labelled an uncalibrated estimate</dd>
            </div>
            <div className="spec__row">
              <dt className="label">Steps</dt>
              <dd>Adaptive-threshold peaks with hysteresis, refractory period, motion gate and a tremor guard</dd>
            </div>
          </dl>
          <Reveal>
            <LockStates />
          </Reveal>
        </div>
        <p className="prose csec__p">
          A rewrite of the step counter was tried and rejected because it did worse on a real walking recording, so the
          tested algorithm stays and the rewrite is kept as experimental.
        </p>
      </CaseSection>

      <CaseSection n="06" title="Analytics" kicker="Probabilistic filtering now; learned models need labels." id="analytics">
        <p className="prose">
          The tremor state comes from a probabilistic model (the HMM above), not a trained classifier: there is no
          labelled patient data to train one honestly. What is in place is the groundwork for it: a dataset builder over
          recordings with leakage-safe subject splits, per-session biomarkers (tremor time and tremor power, following
          the ParaDigMa definitions) and robust personal baselines.
        </p>
      </CaseSection>

      <CaseSection n="07" title="Runtime and dashboard" kicker="One command, live or replayed." wide id="dash">
        <p className="prose csec__p">
          A FastAPI runtime handles acquisition, analysis and recording; a Dash dashboard reads its metrics endpoint and
          never imports the pipeline. Each session writes every raw sample plus window outputs (79 columns) and a
          metadata file with firmware, protocol, pipeline and algorithm versions, measured sample rate, packet loss and
          gaps. These captures come from a synthetic stream, labelled as such in the interface.
        </p>
        <div className="ps-dash">
          <Photo
            src="assets/work/parkinsense-dash2-overview"
            width={1440}
            height={900}
            alt="Dashboard overview: tremor, cardiovascular and activity cards, each with a quality badge such as VALID or UNCALIBRATED ESTIMATE"
            caption="Overview: every value carries a quality state"
          />
          <Photo
            src="assets/work/parkinsense-dash2-tremor"
            width={1440}
            height={900}
            alt="Tremor analytics page: HMM tremor probability over time with per-window evidence, and peak frequency and amplitude of detected windows"
            caption="Tremor analytics: HMM probability, frequency, amplitude"
          />
        </div>
        <Photo
          className="ps-dash__wide"
          src="assets/work/parkinsense-dash2-live"
          width={1440}
          height={900}
          alt="Live monitoring page: accelerometer, gyroscope and PPG waveforms with device rate, packet loss and pipeline version"
          caption="Live monitoring: raw signals, device rate, packet loss"
        />
      </CaseSection>

      <CaseSection n="08" title="Validation" kicker="Pipeline 2.2.0 against 3.0.0 on identical packets." wide id="results">
        <p className="prose csec__p">
          Both versions receive byte-identical BLE packets from synthetic signals with known ground truth (16 seeds × 30
          s per tremor scenario). These are engineering benchmarks, not clinical accuracy.
        </p>
        <div className="tscroll">
          <table className="dsheet">
            <caption className="sr-only">Benchmark results, baseline against current</caption>
            <thead>
              <tr>
                <th scope="col" className="label">
                  Metric (synthetic)
                </th>
                <th scope="col" className="label">
                  2.2.0
                </th>
                <th scope="col" className="label">
                  3.0.0
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map(([m, a, b]) => (
                <tr key={m}>
                  <th scope="row">{m}</th>
                  <td className="dsheet__v muted">{a}</td>
                  <td className="dsheet__v">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="prose csec__p">
          On real, unlabelled recordings: a resting wrist reads 100 % rest with no tremor and no steps; a walking
          recording gives 69 steps against roughly 86 expected; an 8–9 Hz shaken wrist is correctly not called PD-band
          tremor, but everyday arm movement still produces false steps. The full runtime runs at about 26× real time on a
          laptop, with a median analysis latency of 17.8 ms. 84 tests run in CI, including golden regression on the real
          recordings.
        </p>
      </CaseSection>

      <CaseSection n="09" title="Implemented and planned" kicker="What exists, and what doesn’t yet." wide id="status">
        <div className="tscroll">
          <table className="dsheet">
            <caption className="sr-only">Implementation status</caption>
            <thead>
              <tr>
                <th scope="col" className="label">
                  Capability
                </th>
                <th scope="col" className="label">
                  Status
                </th>
                <th scope="col" className="label">
                  Evidence / blocker
                </th>
              </tr>
            </thead>
            <tbody>
              {status.map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className={b === 'Working' ? '' : 'muted'}>{b}</td>
                  <td className="muted">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CaseSection>

      <CaseSection n="10" title="Decisions and next steps" kicker="Recorded as decision records in the repo." wide id="next">
        <div className="notes">
          <div className="notes__col">
            <span className="label label--accent">Signal time</span>
            <h3 className="notes__t">Seconds, not call counts</h3>
            <p>
              Temporal thresholds are expressed in device time, so a slow laptop or a replay at 26× speed gives the same
              answer as live acquisition.
            </p>
          </div>
          <div className="notes__col">
            <span className="label label--accent">Trade-off</span>
            <h3 className="notes__t">Slower, but right</h3>
            <p>
              The HMM made onset ~5 s slower in exchange for zero false PD-tremor calls on fast oscillation and far
              better sensitivity on strong tremor.
            </p>
          </div>
          <div className="notes__col">
            <span className="label label--accent">Next</span>
            <h3 className="notes__t">Real ground truth</h3>
            <p>
              Labelled tremor data (PD@Home or a video-annotated cohort), a chest-strap ECG for heart rate and HRV, a
              reference oximeter for SpO₂, and flashing firmware 5.0.0 through its hardware tests.
            </p>
          </div>
        </div>
        <ul className="contrib">
          {p.contributions?.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { Reveal } from '../../components/Reveal'
import { BenchVideo } from '../../components/BenchVideo'
import { SpoonDemo } from '../../components/SpoonDemo'
import { ControlLoop } from '../../components/diagrams/ControlLoop'
import { TestPlan } from '../../components/diagrams/TestPlan'
import { getProject } from '../../data/projects'
import { asset } from '../../config/personal'

const p = getProject('tremosense')!

/** Source: project README and firmware (tremosense-app), github.com/rkt-1597/TremoSense-Project */
const datasheet: [string, string, string][] = [
  ['Board', 'XIAO nRF52840 Sense', 'Cortex-M4F, onboard IMU'],
  ['IMU', 'LSM6DS3TR-C', '208 Hz output data rate'],
  ['RTOS', 'Zephyr', '2 threads, message queue, semaphore'],
  ['Estimator', 'EKF, 2 states', 'Roll, pitch'],
  ['Controller', 'LQR', 'K is 2 × 4, from LQR_ARE.m'],
  ['Roll servo', 'MG995', '722–2278 µs pulse'],
  ['Pitch servo', 'FS90MG', '900–2100 µs pulse'],
  ['Servo frame', '20 ms', '50 Hz PWM'],
  ['Command rate', '10 ms', 'Actuation thread'],
  ['Simulation', '1000 Hz', 'MATLAB / Simulink'],
  ['Test load', '50 g', 'Food on the spoon'],
  ['Roll suppression', '> 90%', 'Most of 3–7 Hz, 2–7° (sim.)'],
  ['Pitch suppression', '> 80%', 'Most of 3–7 Hz, 2–7° (sim.)'],
  ['Residual RMS', '0.346° / 0.573°', 'Roll / pitch, 8° at 8 Hz (sim.)'],
]

/** Evidence: tremosense-app sources and commit log, MATLAB_Simulink scripts, README "Future Scope". */
const status: [string, string, string][] = [
  ['Two-thread Zephyr firmware: sensing, estimation, control, actuation', 'Implemented', 'IMU thread, servo thread, message queue, semaphore'],
  ['IMU read at 208 Hz, boot-time offset calibration', 'Implemented', 'Calibration is 300 samples over 3 s, enabled in the board config'],
  ['2-state EKF on roll and pitch, on the nRF52840', 'Implemented', 'ekf.c; commit log records a successful run'],
  ['LQR control of both servos, on the nRF52840', 'Implemented', 'lqr.c; commit log records a successful run'],
  ['EKF + LQR validation in MATLAB / Simulink at 1000 Hz', 'Implemented, simulated', 'Results above are from the model, not the bench'],
  ['Controller gain K and noise covariances', 'Set per rig', 'constants.h is a template in the public repo; K comes from LQR_ARE.m'],
  ['Measured tremor suppression on the hardware', 'Not yet', 'Quantitative hardware benchmarking is on the team’s future-work list'],
  ['Tremor frequency and amplitude identification, clinician reporting', 'Stated objective, not built', 'No such module in the firmware'],
  ['Servo dynamics in the model, adaptive control, smaller build, battery system', 'Planned', 'Listed as future scope'],
]

export default function TremoSense() {
  return (
    <Page
      title="TremoSense | Zephyr RTOS EKF + LQR Tremor Suppression | Pranshu Kumar"
      description="TremoSense: a two-axis servo gimbal spoon on the XIAO nRF52840 Sense running Zephyr RTOS, with EKF roll and pitch estimation and LQR control, validated in MATLAB and Simulink."
      path="/work/tremosense"
      className="case case--ts"
    >
      <CaseHeader p={p} />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
        <p className="cabstract__note muted">
          Built with Prithvi Tambewagh and Pawan Shinde at VJTI. People with Parkinson’s commonly have tremor in the 3
          to 7 Hz range, which makes holding a spoon steady hard; this is a two-axis answer to that.
        </p>
      </section>

      <section className="wrap loop-band" aria-label="Control loop">
        <Reveal>
          <ControlLoop />
        </Reveal>
      </section>

      <section className="wrap spoon-band" aria-label="Stabilisation demo">
        <Reveal className="spoon-band__text">
          <span className="label label--accent">Interactive</span>
          <h2 className="spoon-band__t serif">The handle shakes. The spoon stays.</h2>
          <p className="muted">
            Switch the controller off and the spoon head follows the hand. Switch it on and the two servos counter-rotate it
            so only a small slow drift is left. Pick a tremor frequency in the 4 to 8 Hz range to see how the
            residual changes.
          </p>
        </Reveal>
        <Reveal className="spoon-band__demo">
          <SpoonDemo />
        </Reveal>
      </section>

      <section className="wrap bench-band" aria-label="Bench demonstration video">
        <Reveal className="bench-band__media">
          <figure className="bench-fig">
            <BenchVideo />
          </figure>
        </Reveal>
        <Reveal className="bench-band__text">
          <span className="label label--accent">Bench footage</span>
          <h2 className="bench-band__t serif">The real build, moving against the hand.</h2>
          <p className="muted">
            This is the demonstration clip from the project repository. A hand holds the two-axis servo gimbal while the roll
            servo and the pitch servo rotate the spoon against the motion. It shows the mechanism working on the bench;
            it is not a user trial, and the suppression figures on this page come from the Simulink model, not from this
            footage.
          </p>
          <a className="link" href="https://github.com/rkt-1597/TremoSense-Project/blob/main/assets/tremosense.gif" target="_blank" rel="noreferrer">
            Source clip in the repository <span className="arrow">↗</span>
          </a>
          <p className="bench-band__meta label">7 s loop · plays muted · no audio track in the source</p>
        </Reveal>
      </section>

      <section className="wrap ts-split" aria-label="Design and results">
        <aside className="ts-split__sheet">
          <h2 className="csec__title">Datasheet</h2>
          <table className="dsheet">
            <caption className="sr-only">TremoSense parameters</caption>
            <tbody>
              {datasheet.map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className="dsheet__v">{b}</td>
                  <td className="muted">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ts-split__note muted">Rows marked sim. come from MATLAB / Simulink, not the bench.</p>
        </aside>

        <div className="ts-split__body">
          <div className="ts-block">
            <span className="label label--accent">Prototype</span>
            <h3 className="ts-block__t">Two servos, one gimbal</h3>
            <p>
              The MG995 corrects roll and the FS90MG corrects pitch. On power-up the board is held level while it
              calibrates the IMU: the blue LED stays on for three seconds, then blinks while offsets are logged, and
              the servos take over.
            </p>
          </div>

          <div className="ts-block">
            <span className="label label--accent">Estimation</span>
            <h3 className="ts-block__t">An EKF on roll and pitch</h3>
            <p>
              The gyroscope predicts how the spoon has rotated since the last sample; the accelerometer corrects that
              prediction against gravity. The filter uses the measured time between samples rather than a fixed step,
              and clamps pitch away from ±90° where the Euler-angle maths breaks down.
            </p>
          </div>

          <div className="ts-block">
            <span className="label label--accent">Control</span>
            <h3 className="ts-block__t">LQR across both axes</h3>
            <p>
              The state is roll, roll rate, pitch and pitch rate. A 2 × 4 LQR gain maps it to one command per servo,
              so each axis can respond to motion on the other. The gain comes from solving the algebraic Riccati
              equation in MATLAB with the rig’s physical parameters.
            </p>
          </div>

          <div className="ts-block">
            <span className="label label--accent">Firmware</span>
            <h3 className="ts-block__t">Two threads on Zephyr</h3>
            <p>
              The IMU raises a data-ready trigger, which releases a semaphore. A high-priority thread reads the sample
              and runs the EKF and LQR; results go into a message queue, and a lower-priority thread drains it every 10
              ms to set the servo pulses. Sensing never waits on actuation.
            </p>
          </div>

          <div className="ts-block">
            <span className="label label--accent">Validation</span>
            <h3 className="ts-block__t">Simulated first</h3>
            <p>
              The EKF and LQR were modelled and run at 1000 Hz in Simulink, with cross-coupling between axes included
              in every test.
            </p>
            <TestPlan />
            <figure className="ts-plot">
              <img
                src={asset('assets/work/tremosense-roll-sim.webp')}
                alt="MATLAB plot: roll-axis magnitude and phase response from 0 to 8 hertz for tremor amplitudes of 2 to 7 degrees; magnitude stays near minus 25 decibels, below the 90 percent suppression line, across most of the band."
                width={1200}
                height={641}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="label">Fig. 02 · Roll-axis frequency response, 2–7° tremor, from the project’s Simulink model</figcaption>
            </figure>
            <figure className="ts-plot">
              <img
                src={asset('assets/work/tremosense-pitch-sim.webp')}
                alt="MATLAB plot: pitch-axis magnitude and phase response from 0 to 8 hertz for tremor amplitudes of 2 to 7 degrees."
                width={1200}
                height={639}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="label">Fig. 03 · Pitch-axis frequency response, 2–7° tremor, from the Simulink model</figcaption>
            </figure>
            <figure className="ts-plot">
              <img
                src={asset('assets/work/tremosense-ekf-sim.webp')}
                alt="Simulink scope: 8 degree, 8 hertz roll and pitch tremor input and the EKF estimate over two seconds, tracking closely."
                width={1400}
                height={733}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="label">Fig. 04 · 8° at 8 Hz input against the EKF estimate, roll and pitch (Simulink scope)</figcaption>
            </figure>
            <figure className="ts-plot">
              <img
                src={asset('assets/work/tremosense-lqr-sim.webp')}
                alt="Simulink scope: LQR counter-motion against the tremor input for roll and pitch, with the small residual motion below. Residual RMS is 0.346 degrees on roll and 0.573 degrees on pitch."
                width={1400}
                height={735}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="label">Fig. 05 · LQR counter-motion against input; residual RMS 0.346° roll, 0.573° pitch (Simulink)</figcaption>
            </figure>
          </div>

          <div className="ts-block">
            <span className="label label--accent">Next</span>
            <h3 className="ts-block__t">What the team lists as future work</h3>
            <p>
              Modelling servo dynamics and non-linearities, adaptive or gain-scheduled control, quantitative hardware
              benchmarking with IMU metrics, a smaller ergonomic build, and a battery and power system to make it
              portable.
            </p>
          </div>
        </div>
      </section>

      <CaseSection n="02" title="Implemented and planned" kicker="What exists, and what doesn’t yet." wide id="status">
        <div className="tscroll">
          <table className="dsheet dsheet--stack">
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
                  Evidence / note
                </th>
              </tr>
            </thead>
            <tbody>
              {status.map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className="dsheet__v">{b}</td>
                  <td className="muted">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ts-split__note muted">
          Team: Prithvi Tambewagh, Pawan Shinde and Pranshu Kumar, VJTI. Source: the public repository and its Simulink
          scripts.
        </p>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

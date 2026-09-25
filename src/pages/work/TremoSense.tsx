import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, NextProject } from '../../components/Case'
import { Reveal } from '../../components/Reveal'
import { DemoVideo } from '../../components/DemoVideo'
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
          <div className="ts-block ts-block--demo">
            <DemoVideo caption="Bench test of the prototype" />
            <div className="ts-block__text">
              <span className="label label--accent">Prototype</span>
              <h3 className="ts-block__t">Two servos, one gimbal</h3>
              <p>
                The MG995 corrects roll and the FS90MG corrects pitch. On power-up the board is held level while it
                calibrates the IMU: the blue LED stays on for three seconds, then blinks while offsets are logged, and
                the servos take over.
              </p>
            </div>
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

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

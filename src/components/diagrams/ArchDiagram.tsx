import { m, useReducedMotion } from 'motion/react'
import { easeOut } from '../../animations/motion'

type Block = { title: string; lines: string[]; accent?: boolean }

const lanes: { name: string; steps: string; out: string; note?: string }[] = [
  {
    name: 'Tremor',
    steps: 'Welch PSD per gyro axis, 3.5–7.5 Hz peak, amplitude ±0.625 Hz, SNR and harmonic checks, evidence score, 2-state HMM',
    out: 'State, P(tremor), Hz, deg/s',
    note: 'motion context: rest / low motion / active',
  },
  {
    name: 'Cardiac',
    steps: '0.5–4.5 Hz band-pass, peak detection with dicrotic-notch guard, median RR, lock state machine',
    out: 'HR, HRV, SpO₂ est.',
    note: 'flagged when HR tracks motion',
  },
  {
    name: 'Activity',
    steps: 'Adaptive threshold peaks, hysteresis, refractory period, motion gate and tremor guard',
    out: 'Steps, cadence',
  },
]

function Box({ b }: { b: Block }) {
  return (
    <div className={`arch__box ${b.accent ? 'arch__box--accent' : ''}`}>
      <span className="arch__title">{b.title}</span>
      {b.lines.map((l) => (
        <span key={l} className="arch__line">
          {l}
        </span>
      ))}
    </div>
  )
}

/**
 * ParkinSense end to end: wrist, radio, host. Every label is a documented part or parameter;
 * the packet rate is derived (104 Hz / 10 samples) and marked as such.
 */
export function ArchDiagram() {
  const reduce = useReducedMotion()
  const zone = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -10% 0px' },
    transition: { duration: 0.6, ease: easeOut, delay: i * 0.18 },
  })

  return (
    <figure className="arch" aria-label="ParkinSense system architecture">
      <div className="arch__grid">
        <m.div className="arch__zone arch__zone--wrist" {...zone(0)}>
          <span className="arch__zlabel label">On the wrist</span>
          <div className="arch__stack">
            <Box b={{ title: 'LSM6DS3', lines: ['6-axis IMU, 104 Hz'] }} />
            <Box b={{ title: 'MAX30102', lines: ['PPG, red + IR, 100 SPS FIFO'] }} />
          </div>
          <span className="arch__arrow" aria-hidden="true" />
          <Box b={{ title: 'XIAO nRF52840', lines: ['Timestamps and packs', '10 samples per packet', 'Streams while a finger is on the PPG'] }} />
        </m.div>

        <span className="arch__arrow arch__arrow--zone" aria-hidden="true" />

        <m.div className="arch__zone arch__zone--air" {...zone(1)}>
          <span className="arch__zlabel label">Over the air</span>
          <Box b={{ title: 'BLE', lines: ['208-byte packet, MTU 247', 'versioned, sequence-numbered', '≈10.4 packets/s, derived'] }} />
        </m.div>

        <span className="arch__arrow arch__arrow--zone" aria-hidden="true" />

        <m.div className="arch__zone arch__zone--host" {...zone(2)}>
          <span className="arch__zlabel label">Python RuntimeEngine on signal time, every 0.5 s over 4 s</span>
          <ol className="arch__lanes">
            {lanes.map((l) => (
              <li key={l.name} className="arch__lane">
                <span className="arch__lname">{l.name}</span>
                <span className="arch__lsteps">{l.steps}</span>
                <span className="arch__lout">
                  <span aria-hidden="true">→ </span>
                  {l.out}
                </span>
                {l.note && <span className="arch__lnote label">{l.note}</span>}
              </li>
            ))}
          </ol>
        </m.div>

        <span className="arch__arrow arch__arrow--zone" aria-hidden="true" />

        <m.div className="arch__zone arch__zone--out" {...zone(3)}>
          <span className="arch__zlabel label">Read out</span>
          <Box b={{ title: 'Dash dashboard', lines: ['Reads a FastAPI /metrics endpoint; never imports the pipeline'] }} />
          <Box b={{ title: 'capture.csv + metadata.json', lines: ['Every raw sample, versions, loss and gaps'] }} />
          <Box b={{ title: 'Replay', lines: ['Bit-exact through any pipeline version'] }} />
        </m.div>
      </div>
      <figcaption className="arch__cap label">
        Fig. 01 · System architecture, pipeline 3.0.0. Packet rate derived from 104 Hz ÷ 10.
      </figcaption>
    </figure>
  )
}

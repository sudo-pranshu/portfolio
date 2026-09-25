import { m, useReducedMotion } from 'motion/react'
import { easeOut } from '../../animations/motion'

type Block = { title: string; lines: string[]; accent?: boolean }

const lanes: { name: string; steps: string; out: string; note?: string }[] = [
  {
    name: 'Motion',
    steps: '4 s window: gravity removal, 50 Hz notch, 4.0–7.5 Hz band-pass, multi-axis features, hysteresis state machine',
    out: 'Tremor state + confidence',
  },
  {
    name: 'Cardiac',
    steps: '10 s window: finger detection, SQI, adaptive peaks, RR intervals, lock states',
    out: 'HR, HRV, SpO₂',
    note: 'confidence linked to motion',
  },
  {
    name: 'Activity',
    steps: '~2 s window: adaptive mean + kσ threshold, hysteresis peaks, refractory gating',
    out: 'Steps',
    note: 'gated by motion classifier',
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
            <Box b={{ title: 'MAX30102', lines: ['PPG, red + IR, ~50 Hz'] }} />
          </div>
          <span className="arch__arrow" aria-hidden="true" />
          <Box b={{ title: 'XIAO nRF52840', lines: ['Timestamps and packs', '10 samples per packet', 'Sleeps when off the skin'] }} />
        </m.div>

        <span className="arch__arrow arch__arrow--zone" aria-hidden="true" />

        <m.div className="arch__zone arch__zone--air" {...zone(1)}>
          <span className="arch__zlabel label">Over the air</span>
          <Box b={{ title: 'BLE 5.0', lines: ['248-byte packet, MTU 247', 'versioned binary', '≈10.4 packets/s, derived'] }} />
        </m.div>

        <span className="arch__arrow arch__arrow--zone" aria-hidden="true" />

        <m.div className="arch__zone arch__zone--host" {...zone(2)}>
          <span className="arch__zlabel label">Python runtime or Android app, three pipelines</span>
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
          <Box b={{ title: 'Plotly Dash', lines: ['Refreshes every 100 ms, decoupled from the pipelines'] }} />
          <Box b={{ title: 'CSV + JSON', lines: ['Offline replay, future ML dataset'] }} />
          <Box b={{ title: 'Android app', lines: ['All three pipelines on the phone'] }} />
        </m.div>
      </div>
      <figcaption className="arch__cap label">
        Fig. 01 · System architecture, from the repository. Packet rate derived from 104 Hz ÷ 10.
      </figcaption>
    </figure>
  )
}

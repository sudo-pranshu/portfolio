import { useEffect, useRef, useState } from 'react'
import { useOnScreen, useTicker } from '../animations/ticker'

/**
 * ParkinSense wrist-signal demo, ported from the AVERRA presentation site (sudo-pranshu/AVERRA,
 * components/slides.tsx, `WristDemo`). The signal model, the three situations, the displayed values and the
 * disclaimer are the original. Changes for this site: palette moved to the portfolio tokens, the frame loop
 * pauses when the demo is off-screen, and the markup uses the portfolio's own classes. The signal is generated
 * in the browser; nothing here is connected to a device or to patient data.
 */

type Mode = 'rest' | 'tremor' | 'walk'
const MODES: [Mode, string][] = [
  ['rest', 'Resting'],
  ['tremor', 'Tremor'],
  ['walk', 'Walking'],
]
const N = 130

export function WristDemo() {
  const [mode, setMode] = useState<Mode>('tremor')
  const [steps, setSteps] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const line = useRef<SVGPathElement>(null)
  const heart = useRef<SVGPathElement>(null)
  const sim = useRef({ buf: Array(N).fill(0) as number[], last: 0, stepAcc: 0, hb: 0, acc: 0 })
  const st = useRef(mode)
  useEffect(() => {
    st.current = mode
  }, [mode])
  const visible = useOnScreen(root)
  const hr = mode === 'walk' ? 98 : mode === 'tremor' ? 76 : 68

  useTicker(
    (t) => {
      const m = sim.current
      const md = st.current
      // After a pause, t jumps; dt is clamped so the simulation resumes smoothly.
      const dt = Math.min(0.1, Math.max(0, t - m.last))
      m.last = t
      const STEP = 1 / 60 // fixed steps: same speed on 60, 120 and 144 Hz screens
      m.acc += dt
      while (m.acc >= STEP) {
        m.acc -= STEP
        const ts = t - m.acc
        const noise = (Math.sin(ts * 37.1) + Math.sin(ts * 53.7)) * 0.6
        const v =
          md === 'rest'
            ? noise * 0.8
            : md === 'tremor'
              ? 14 * Math.sin(2 * Math.PI * 4.9 * ts * 0.5) + noise // 4.9 Hz tremor, shown at half speed
              : 18 * Math.max(0, Math.sin(2 * Math.PI * 0.9 * ts)) ** 3 - 4 + noise
        m.buf.push(v)
        if (m.buf.length > N) m.buf.shift()
      }
      line.current?.setAttribute('d', 'M' + m.buf.map((y, i) => `${(i * 2).toFixed(1)},${(35 - y).toFixed(1)}`).join(' L'))
      if (md === 'walk') {
        m.stepAcc += dt * 1.8
        if (m.stepAcc >= 1) {
          m.stepAcc -= 1
          setSteps((x) => x + 1)
        }
      }
      const bpm = md === 'walk' ? 98 : md === 'tremor' ? 76 : 68
      m.hb = (m.hb + (dt * bpm) / 60) % 1
      heart.current?.setAttribute('transform', `scale(${(1 + 0.18 * Math.exp(-m.hb * 9)).toFixed(3)})`)
    },
    visible,
    mode,
  )

  const status = mode === 'tremor' ? 'Tremor detected' : mode === 'walk' ? 'Walking' : 'Resting'
  return (
    <div className="wrist" ref={root}>
      <p className="wrist__head label">
        <span className="wrist__dot" aria-hidden="true" />
        Try it
      </p>
      <div className="wrist__modes" role="group" aria-label="Situation">
        {MODES.map(([k, l]) => (
          <button key={k} type="button" onClick={() => setMode(k)} aria-pressed={mode === k}>
            {l}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 260 70" preserveAspectRatio="none" className="wrist__plot" role="img" aria-label="Animated wrist motion signal" data-mode={mode}>
        <line x1="0" x2="260" y1="35" y2="35" style={{ stroke: 'var(--border-strong)' }} />
        <path ref={line} fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" className="wrist__line" />
      </svg>
      <p className="wrist__cap label">Wrist motion, live</p>
      <dl className="wrist__cards" aria-live="polite">
        <div className="wrist__card">
          <dt className="label">Band reports</dt>
          <dd className="wrist__status" data-mode={mode}>
            {status}
          </dd>
        </div>
        <div className="wrist__card">
          <dt className="label">Steps</dt>
          <dd className="num">
            {steps}
            {mode === 'tremor' && <small>not counted</small>}
          </dd>
        </div>
        <div className="wrist__card">
          <dt className="label">Tremor</dt>
          <dd className="num">{mode === 'tremor' ? '4.9 Hz · score 85' : 'none'}</dd>
        </div>
        <div className="wrist__card">
          <dt className="label">Heart rate</dt>
          <dd className="num wrist__hr">
            <svg viewBox="-12 -12 24 24" aria-hidden="true">
              <path ref={heart} d="M0,8 C-9,1 -9,-7 -3.5,-7 C-1.5,-7 0,-5 0,-4 C0,-5 1.5,-7 3.5,-7 C9,-7 9,1 0,8Z" />
            </svg>
            {hr} bpm
          </dd>
        </div>
      </dl>
      <p className="wrist__note">
        Generated signal · values as the bench dashboard shows them.
      </p>
    </div>
  )
}

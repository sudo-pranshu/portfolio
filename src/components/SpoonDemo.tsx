import { useEffect, useId, useRef, useState } from 'react'
import { useOnScreen, useTicker } from '../animations/ticker'

/**
 * TremoSense stabilisation demo, ported from the AVERRA presentation site (sudo-pranshu/AVERRA,
 * components/slides.tsx, `SpoonDemo` and `useTicker`). The drawing and the simulation maths are the original:
 * the handle shakes at half the chosen tremor frequency; with stabilisation on, the spoon head keeps about 10%
 * of the motion. Changes for this site: palette moved to the portfolio tokens, the frame loop pauses when the
 * demo is off-screen or the tab is hidden, and the markup uses the portfolio's own classes.
 */

const N = 150
const FREQS = [4, 6, 8] as const

export function SpoonDemo() {
  const uid = useId().replace(/:/g, '')
  const [on, setOn] = useState(true)
  const [hz, setHz] = useState<number>(6)
  const root = useRef<HTMLDivElement>(null)
  const hand = useRef<SVGGElement>(null)
  const head = useRef<SVGGElement>(null)
  const traceRaw = useRef<SVGPathElement>(null)
  const trace = useRef<SVGPathElement>(null)
  const sim = useRef({
    k: 0,
    r: 0,
    last: 0,
    acc: 0,
    a: 0,
    b: 0,
    raw: Array(N).fill(0) as number[],
    out: Array(N).fill(0) as number[],
  })
  const state = useRef({ on, hz })
  useEffect(() => {
    state.current = { on, hz }
  }, [on, hz])

  const visible = useOnScreen(root)

  useTicker((t) => {
    const { on: s, hz: f } = state.current
    const m = sim.current
    // After a pause, t jumps; dt is clamped so the simulation resumes without a burst of steps.
    const dt = Math.min(0.1, Math.max(0, t - m.last))
    m.last = t
    // Fixed 60 Hz simulation steps: same speed and smoothness on 60, 120 and 144 Hz screens.
    const STEP = 1 / 60
    m.acc += dt
    let a = m.a
    let bowl = m.b
    while (m.acc >= STEP) {
      m.acc -= STEP
      const ts = t - m.acc
      // Handle angle: tremor (shown at half speed) plus a slow voluntary drift.
      a = 7 * Math.sin(2 * Math.PI * f * ts * 0.5) + 1.5 * Math.sin(2 * Math.PI * 0.25 * ts)
      // Ease the controller in and out so switching never snaps.
      m.k += ((s ? 0 : 1) - m.k) * STEP * 6
      // Residual is about 10% of the tremor, low-passed so it reads as a gentle drift, not jitter.
      m.r += (a * 0.1 - m.r) * STEP * 2.5
      // A very slight residual shake at higher tremor frequencies (servo lag), none at 4 Hz.
      const jit = (f >= 8 ? 0.7 : f >= 6 ? 0.4 : 0) * Math.sin(2 * Math.PI * f * ts * 0.5 + 0.6)
      bowl = m.k * a + (1 - m.k) * (m.r + jit)
      m.raw.push(a)
      m.out.push(bowl)
      if (m.raw.length > N) {
        m.raw.shift()
        m.out.shift()
      }
    }
    m.a = a
    m.b = bowl
    hand.current?.setAttribute('transform', `rotate(${a.toFixed(2)} 150 168)`)
    head.current?.setAttribute('transform', `rotate(${(bowl - a).toFixed(2)} 150 168)`)
    const path = (arr: number[]) => 'M' + arr.map((v, i) => `${(i * 2).toFixed(1)},${(30 - v * 2.4).toFixed(1)}`).join(' L')
    traceRaw.current?.setAttribute('d', path(m.raw))
    trace.current?.setAttribute('d', path(m.out))
  }, visible, `${on}${hz}`)

  const halo = on ? 'var(--foreground)' : 'var(--accent)'
  return (
    <div className="spoon" ref={root}>
      <div className="spoon__bar">
        <span className="label">Try it</span>
        <button type="button" className="spoon__switch" onClick={() => setOn((v) => !v)} aria-pressed={on}>
          <span className="spoon__track" data-on={on} aria-hidden="true">
            <span className="spoon__thumb" />
          </span>
          Stabilisation {on ? 'on' : 'off'}
        </button>
      </div>

      <svg viewBox="0 0 300 300" className="spoon__stage" role="img" aria-label="Animated illustration: a spoon whose handle shakes while its head stays steady when stabilisation is on">
        <defs>
          <radialGradient id={`${uid}halo`}>
            <stop offset="0" stopColor={halo} stopOpacity="0.2" />
            <stop offset="1" stopColor={halo} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}steel`} x1="0" x2="1">
            <stop offset="0" stopColor="#94A3B8" />
            <stop offset="0.45" stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id={`${uid}handle`} x1="0" x2="1">
            <stop offset="0" stopColor="#1E293B" />
            <stop offset="0.45" stopColor="#475569" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="95" r="80" fill={`url(#${uid}halo)`} style={{ transition: 'all .4s' }} />
        <line x1="70" x2="230" y1="40" y2="40" stroke="var(--foreground)" strokeOpacity={on ? 0.35 : 0} strokeDasharray="3 5" style={{ transition: 'stroke-opacity .4s' }} />
        <g ref={hand}>
          <rect x="136" y="172" width="28" height="112" rx="14" fill={`url(#${uid}handle)`} stroke="#64748B" strokeOpacity="0.6" />
          <rect x="142" y="196" width="16" height="5" rx="2.5" style={{ fill: 'var(--accent)' }} />
          <circle cx="150" cy="222" r="4" fill="#E2E8F0" />
          <rect x="132" y="156" width="36" height="22" rx="7" fill="#334155" stroke="#94A3B8" strokeOpacity="0.6" />
          <g ref={head}>
            <rect x="146" y="96" width="8" height="74" rx="4" fill={`url(#${uid}steel)`} />
            <ellipse cx="150" cy="78" rx="27" ry="34" fill="#E2E8F0" />
            <ellipse cx="150" cy="76" rx="19" ry="25" fill="#CBD5E1" />
            <circle cx="145" cy="72" r="4" fill="#F59E0B" />
            <circle cx="155" cy="78" r="3.5" fill="#F59E0B" />
            <circle cx="147" cy="84" r="3" fill="#FBBF24" />
          </g>
          <circle cx="150" cy="168" r="6" fill="#CBD5E1" />
        </g>
      </svg>

      <svg viewBox="0 0 300 60" className="spoon__trace" aria-hidden="true">
        <line x1="0" x2="300" y1="30" y2="30" style={{ stroke: 'var(--border-strong)' }} />
        <path ref={traceRaw} fill="none" strokeOpacity="0.45" strokeWidth="1.5" style={{ stroke: 'var(--accent)' }} />
        <path ref={trace} fill="none" strokeWidth="2.2" strokeLinejoin="round" style={{ stroke: on ? 'var(--foreground)' : 'var(--accent)' }} />
      </svg>
      <p className="spoon__legend label">
        <span className="spoon__key spoon__key--raw">Handle (tremor)</span>
        <span>vs</span>
        <span className="spoon__key">Spoon head</span>
      </p>

      <div className="spoon__chips" role="group" aria-label="Tremor frequency">
        {FREQS.map((f) => (
          <button key={f} type="button" onClick={() => setHz(f)} aria-pressed={hz === f}>
            {f} Hz
          </button>
        ))}
      </div>
      <p className="spoon__note">
        Illustration at half speed, scaled to roughly 90% suppression (the Simulink roll figure). Not a recording, and not a
        hardware measurement.
      </p>
    </div>
  )
}

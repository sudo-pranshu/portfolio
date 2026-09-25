import { useMemo } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { computeTrace, runs, toPath, FS, SECONDS } from './signal'

type Props = { compact?: boolean; caption?: boolean }

const W = 1000
const X0 = 0
const X1 = W

/**
 * Three lanes: raw input, band-passed output, detector state.
 * Computed live from signal.ts; nothing here is hand-drawn.
 */
export function SignalFigure({ compact = false, caption = true }: Props) {
  const reduce = useReducedMotion()
  const tr = useMemo(() => computeTrace(), [])
  const laneH = compact ? 78 : 96
  const gap = compact ? 26 : 34
  const top = 22
  const lanes = [top, top + laneH + gap, top + 2 * (laneH + gap)]
  const stateH = 18
  const H = lanes[2] + stateH + 30

  const rawMean = tr.raw.reduce((a, b) => a + b, 0) / tr.raw.length
  const rawPath = toPath(
    tr.raw.map((v) => v - rawMean),
    X0,
    X1,
    lanes[0] + laneH / 2,
    laneH / 2 / 0.85,
  )
  const fScale = laneH / 2 / 0.24
  const filtPath = toPath(tr.filtered, X0, X1, lanes[1] + laneH / 2, fScale)
  const envPath = toPath(tr.envelope, X0, X1, lanes[1] + laneH / 2, fScale)
  const yEnter = lanes[1] + laneH / 2 - tr.enter * fScale
  const yExit = lanes[1] + laneH / 2 - tr.exit * fScale
  const on = runs(tr.state)
  const n = tr.raw.length
  const xAt = (i: number) => X0 + ((X1 - X0) * i) / (n - 1)


  return (
    <figure className="sig">
      <div className="sig__plot">
      <div className="sig__labels" aria-hidden="true">
        <span className="label" style={{ top: `${(lanes[0] / H) * 100}%` }}>
          Raw accel.
        </span>
        <span className="label" style={{ top: `${(lanes[1] / H) * 100}%` }}>
          4.0–7.5 Hz
        </span>
        <span className="label label--accent" style={{ top: `${(lanes[2] / H) * 100}%` }}>
          Tremor state
        </span>
      </div>
      <m.svg
        initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
        viewBox={`0 0 ${W} ${H}`}
        className="sig__svg"
        role="img"
        aria-label="Synthetic accelerometer signal with slow voluntary movement, mains noise and a 5.4 hertz tremor burst. After notch and 4 to 7.5 hertz band-pass filtering only the tremor remains, and a two-threshold detector marks the tremor interval."
        preserveAspectRatio="none"
      >
        {/* second ticks */}
        {Array.from({ length: SECONDS + 1 }, (_, s) => (
          <g key={s}>
            <line
              x1={(s * FS * (X1 - X0)) / (n - 1)}
              x2={(s * FS * (X1 - X0)) / (n - 1)}
              y1={top - 8}
              y2={H - 22}
              className="sig__tick"
            />
          </g>
        ))}
        {lanes.slice(0, 2).map((y, i) => (
          <line key={i} x1={X0} x2={X1} y1={y + laneH / 2} y2={y + laneH / 2} className="sig__axis" />
        ))}

        <path d={rawPath} className="sig__raw" />

        <line x1={X0} x2={X1} y1={yEnter} y2={yEnter} className="sig__thr" />
        <line x1={X0} x2={X1} y1={yExit} y2={yExit} className="sig__thr sig__thr--exit" />
        <path d={envPath} className="sig__env" />
        <path d={filtPath} className="sig__filt" />

        <rect x={X0} y={lanes[2]} width={X1 - X0} height={stateH} className="sig__stateBg" />
        {on.map(([a, b]) => (
          <rect key={a} x={xAt(a)} y={lanes[2]} width={xAt(b) - xAt(a)} height={stateH} className="sig__state" />
        ))}
      </m.svg>
      </div>
      <div className="sig__axisLabels label" aria-hidden="true">
        {Array.from({ length: SECONDS + 1 }, (_, s) => (
          <span key={s}>{s} s</span>
        ))}
      </div>
      {caption && (
        <figcaption className="sig__cap">
          <span className="label label--fg">Fig. 02 · Motion pipeline, computed in your browser</span>
          <span className="muted">
            Synthetic input: slow arm movement, 50 Hz pickup and a 5.4 Hz burst, sampled at 104 Hz. Filters are the
            documented ones; detector thresholds (dashed) are illustrative.
          </span>
        </figcaption>
      )}
    </figure>
  )
}

import { m, useReducedMotion } from 'motion/react'

type B = { t: string; s: string; accent?: boolean }

const blocks: B[] = [
  { t: 'HAND + SPOON', s: 'gimbal, 50 g of food' },
  { t: 'LSM6DS3TR-C', s: 'onboard IMU, 208 Hz' },
  { t: 'EKF', s: 'roll + pitch estimate' },
  { t: 'LQR', s: 'u = −K·x, K is 2 × 4', accent: true },
  { t: 'MG995 · FS90MG', s: 'roll · pitch servos' },
]

/**
 * TremoSense closed loop. Two drawings of the same diagram: a horizontal one for wide screens
 * and a vertical one for phones, so labels never shrink below reading size.
 */
export function ControlLoop() {
  const reduce = useReducedMotion()
  const loop = {
    initial: reduce ? false : { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, margin: '0px 0px -10% 0px' },
    transition: { duration: 1.4, ease: 'easeInOut' as const, delay: 0.3 },
  }

  // Horizontal geometry
  const bw = 168
  const gap = 35
  const x = (i: number) => 10 + i * (bw + gap)
  const y = 110
  const bh = 74

  // Vertical geometry
  const vw = 220
  const vx = 90
  const vh = 62
  const vg = 34
  const vy = (i: number) => 90 + i * (vh + vg)

  const label =
    'Closed loop: hand tremor moves the spoon and gimbal; the onboard LSM6DS3TR-C IMU samples at 208 hertz; an extended Kalman filter estimates roll and pitch; an LQR controller with a 2 by 4 gain computes commands; MG995 and FS90MG servos act back on the spoon every 10 milliseconds.'

  return (
    <figure className="loop">
      <svg viewBox="0 0 1000 300" className="loop__svg loop__svg--h" role="img" aria-label={label}>
        <defs>
          <marker id="lp-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="loop__head" />
          </marker>
        </defs>
        {/* disturbance into the plant */}
        <text x={x(0)} y={34} className="loop__dist">HAND TREMOR</text>
        <text x={x(0)} y={52} className="loop__sub">clinical band 3–7 Hz</text>
        <path d={`M${x(0) + bw / 2} 62 V${y - 2}`} className="loop__wire loop__wire--accent" markerEnd="url(#lp-a)" />
        {blocks.map((b, i) => (
          <g key={b.t} className={`loop__block ${b.accent ? 'loop__block--accent' : ''}`}>
            <rect x={x(i)} y={y} width={bw} height={bh} />
            <text x={x(i) + 12} y={y + 30} className="loop__t">
              {b.t}
            </text>
            <text x={x(i) + 12} y={y + 52} className="loop__sub">
              {b.s}
            </text>
            {i < blocks.length - 1 && (
              <path d={`M${x(i) + bw} ${y + bh / 2} H${x(i + 1) - 2}`} className="loop__wire" markerEnd="url(#lp-a)" />
            )}
          </g>
        ))}
        <m.path
          d={`M${x(4) + bw / 2} ${y + bh} V250 H${x(0) + bw / 2} V${y + bh + 2}`}
          className="loop__wire loop__wire--return"
          markerEnd="url(#lp-a)"
          {...loop}
        />
        <text x={500} y={276} textAnchor="middle" className="loop__sub">
          servo commands every 10 ms, through a Zephyr message queue
        </text>
      </svg>

      <svg viewBox="0 0 360 600" className="loop__svg loop__svg--v" role="img" aria-label={label}>
        <defs>
          <marker id="lp-av" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="loop__head" />
          </marker>
        </defs>
        <text x={vx} y={26} className="loop__dist">HAND TREMOR</text>
        <text x={vx} y={46} className="loop__sub">clinical band 3–7 Hz</text>
        <path d={`M${vx + vw / 2} 56 V${vy(0) - 2}`} className="loop__wire loop__wire--accent" markerEnd="url(#lp-av)" />
        {blocks.map((b, i) => (
          <g key={b.t} className={`loop__block ${b.accent ? 'loop__block--accent' : ''}`}>
            <rect x={vx} y={vy(i)} width={vw} height={vh} />
            <text x={vx + 14} y={vy(i) + 26} className="loop__t">
              {b.t}
            </text>
            <text x={vx + 14} y={vy(i) + 46} className="loop__sub">
              {b.s}
            </text>
            {i < blocks.length - 1 && (
              <path d={`M${vx + vw / 2} ${vy(i) + vh} V${vy(i + 1) - 2}`} className="loop__wire" markerEnd="url(#lp-av)" />
            )}
          </g>
        ))}
        <m.path
          d={`M${vx} ${vy(4) + vh / 2} H40 V${vy(0) + vh / 2} H${vx - 2}`}
          className="loop__wire loop__wire--return"
          markerEnd="url(#lp-av)"
          {...loop}
        />
        <text x={28} y={vy(2)} className="loop__sub" transform={`rotate(-90 28 ${vy(2)})`} textAnchor="middle">
          every 10 ms
        </text>
      </svg>
      <figcaption className="label">Fig. 01 · The loop, as implemented in the firmware</figcaption>
    </figure>
  )
}

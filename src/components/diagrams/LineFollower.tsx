import { m, useReducedMotion } from 'motion/react'

/**
 * Wall-E: two PID loops sharing the motors. The sensor count on the array is
 * not documented, so the array is drawn schematically and not numbered.
 */
export function LineFollower() {
  const reduce = useReducedMotion()
  return (
    <figure className="lf">
      <svg viewBox="0 0 1000 440" className="lf__svg lf__svg--h" role="img" aria-label="Diagram: a light sensor array over a line measures lateral error, which feeds the line-following PID. Positional feedback feeds the balancing PID. Both PID outputs set left and right motor speeds on the ESP32-driven robot.">
        {/* Surface + line */}
        <rect x="20" y="40" width="300" height="340" className="lf__surface" />
        <m.path
          d="M140 380 C 150 300, 210 250, 190 170 S 150 70, 170 40"
          className="lf__line"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        {/* LSA bar */}
        <rect x="70" y="200" width="200" height="22" className="lf__lsa" />
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i} cx={90 + i * 40} cy={211} r={6} className={i === 2 || i === 3 ? 'lf__sensor lf__sensor--on' : 'lf__sensor'} />
        ))}
        <text x="20" y="408" className="lf__lbl">LIGHT SENSOR ARRAY</text>
        <text x="20" y="428" className="lf__sub">reflectivity → line position</text>

        {/* Blocks */}
        <g className="lf__block">
          <rect x="400" y="80" width="220" height="80" />
          <text x="416" y="112" className="lf__lbl">LINE PID</text>
          <text x="416" y="134" className="lf__sub">error = position − centre</text>
        </g>
        <g className="lf__block">
          <rect x="400" y="260" width="220" height="80" />
          <text x="416" y="292" className="lf__lbl">BALANCE PID</text>
          <text x="416" y="314" className="lf__sub">positional feedback</text>
        </g>
        <g className="lf__block lf__block--accent">
          <rect x="720" y="170" width="250" height="80" />
          <text x="736" y="202" className="lf__lbl">ESP32 · SRA BOARD</text>
          <text x="736" y="224" className="lf__sub">left / right motor speed</text>
        </g>

        {/* Wires */}
        <path d="M270 211 H330 V120 H400" className="lf__wire" markerEnd="url(#lf-arrow)" />
        <path d="M350 300 H400" className="lf__wire" markerEnd="url(#lf-arrow)" />
        <text x="344" y="305" className="lf__sub" textAnchor="end">position</text>
        <path d="M620 120 H670 V195 H720" className="lf__wire" markerEnd="url(#lf-arrow)" />
        <path d="M620 300 H670 V225 H720" className="lf__wire" markerEnd="url(#lf-arrow)" />

        <defs>
          <marker id="lf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="lf__head" />
          </marker>
        </defs>
      </svg>
      <svg viewBox="0 0 360 560" className="lf__svg lf__svg--v" role="img" aria-label="Diagram: the light sensor array reads where the line sits and feeds the line PID; positional feedback feeds the balance PID; both set left and right motor speeds on the ESP32 and SRA board.">
        <rect x="20" y="10" width="320" height="200" className="lf__surface" />
        <path d="M150 210 C 160 160, 215 130, 200 90 S 160 40, 180 10" className="lf__line" />
        <rect x="80" y="100" width="200" height="22" className="lf__lsa" />
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i} cx={100 + i * 40} cy={111} r={6} className={i === 2 || i === 3 ? 'lf__sensor lf__sensor--on' : 'lf__sensor'} />
        ))}
        <text x="20" y="236" className="lf__lbl">LIGHT SENSOR ARRAY</text>
        <text x="20" y="256" className="lf__sub">reflectivity → line position</text>
        <g className="lf__block">
          <rect x="20" y="300" width="150" height="80" />
          <text x="34" y="332" className="lf__lbl">LINE PID</text>
          <text x="34" y="354" className="lf__sub">line offset</text>
        </g>
        <g className="lf__block">
          <rect x="190" y="300" width="150" height="80" />
          <text x="204" y="332" className="lf__lbl">BALANCE PID</text>
          <text x="204" y="354" className="lf__sub">position feedback</text>
        </g>
        <g className="lf__block lf__block--accent">
          <rect x="20" y="450" width="320" height="80" />
          <text x="34" y="482" className="lf__lbl">ESP32 · SRA BOARD</text>
          <text x="34" y="504" className="lf__sub">left / right motor speed</text>
        </g>
        <path d="M95 262 V298" className="lf__wire" markerEnd="url(#lf-arrow-v)" />
        <path d="M95 380 V448" className="lf__wire" markerEnd="url(#lf-arrow-v)" />
        <path d="M265 380 V448" className="lf__wire" markerEnd="url(#lf-arrow-v)" />
        <defs>
          <marker id="lf-arrow-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="lf__head" />
          </marker>
        </defs>
      </svg>
      <figcaption className="label">Two PID loops, one pair of motors. Schematic; sensor count not to scale.</figcaption>
    </figure>
  )
}

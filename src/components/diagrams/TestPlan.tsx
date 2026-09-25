/**
 * TremoSense simulation test plan on a linear frequency axis (MATLAB / Simulink, from the project README):
 * a 3–7 Hz sweep at 2–7° amplitude, and an 8° / 8 Hz input on all three axes for the residual-RMS test.
 * Annotations live in HTML below the drawing so they stay readable on phones.
 */
export function TestPlan() {
  const W = 640
  const H = 120
  const f1 = 12
  const x = (f: number) => (f / f1) * (W - 20) + 10
  const top = 10
  const base = 84
  return (
    <figure className="plan">
      <svg viewBox={`0 0 ${W} ${H}`} className="plan__svg" role="img" aria-label="Frequency axis from 0 to 12 hertz. The 3 to 7 hertz clinical tremor band is shaded; a marker sits at 8 hertz for the residual RMS test.">
        <defs>
          <pattern id="plan-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" className="plan__hatch" />
          </pattern>
        </defs>
        <rect x={x(3)} y={top} width={x(7) - x(3)} height={base - top} fill="url(#plan-hatch)" />
        <rect x={x(3)} y={top} width={x(7) - x(3)} height={base - top} className="plan__band" />
        <text x={x(3) + 8} y={top + 18} className="plan__a">A</text>
        <line x1={x(8)} x2={x(8)} y1={top + 6} y2={base} className="plan__marker" />
        <rect x={x(8) - 5} y={top + 1} width={10} height={10} className="plan__dot" />
        <text x={x(8) + 12} y={top + 11} className="plan__a">B</text>
        <line x1={x(0)} x2={x(f1)} y1={base} y2={base} className="plan__axis" />
        {Array.from({ length: f1 + 1 }, (_, f) => (
          <g key={f}>
            <line x1={x(f)} x2={x(f)} y1={base} y2={base + 5} className="plan__axis" />
            {f % 2 === 0 || f === 3 || f === 7 ? (
              <text x={x(f)} y={base + 22} textAnchor="middle" className="plan__tick">
                {f}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <figcaption className="plan__cap">
        <span className="label">Hz</span>
        <dl className="plan__legend">
          <div>
            <dt>
              <span className="plan__key plan__key--band" aria-hidden="true" /> A · Sweep, 3–7 Hz at 2–7°
            </dt>
            <dd>Roll suppression above 90% and pitch above 80% across most of the band.</dd>
          </div>
          <div>
            <dt>
              <span className="plan__key plan__key--mark" aria-hidden="true" /> B · 8° at 8 Hz, all three axes
            </dt>
            <dd>Residual RMS 0.346° on roll, 0.573° on pitch.</dd>
          </div>
        </dl>
        <span className="muted plan__src">MATLAB / Simulink, 50 g of food on the spoon. Hardware benchmarking is still to come.</span>
      </figcaption>
    </figure>
  )
}

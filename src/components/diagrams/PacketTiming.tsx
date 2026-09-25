/**
 * Sample-to-packet timing. 104 Hz, 10 samples per 248-byte packet (documented);
 * the millisecond figures are arithmetic from those two numbers.
 */
export function PacketTiming() {
  const packets = 3
  const per = 10
  const W = 1000
  const pad = 8
  const span = (W - pad * 2) / (packets * per)
  return (
    <figure className="pkt">
      <svg
        viewBox={`0 0 ${W} 120`}
        className="pkt__svg"
        role="img"
        aria-label="Thirty samples at 104 hertz grouped into three packets of ten samples each. One sample every 9.6 milliseconds; one packet about every 96 milliseconds."
      >
        {Array.from({ length: packets * per }, (_, i) => {
          const x = pad + span * i + span / 2
          return <line key={i} x1={x} x2={x} y1={20} y2={52} className={`pkt__tick ${i % per === 0 ? 'pkt__tick--first' : ''}`} />
        })}
        {Array.from({ length: packets }, (_, p) => {
          const x0 = pad + span * p * per + 3
          const x1 = pad + span * (p + 1) * per - 3
          return (
            <g key={p}>
              <path d={`M${x0} 64 V74 H${x1} V64`} className="pkt__bracket" />
              <text x={(x0 + x1) / 2} y={98} textAnchor="middle" className="pkt__text">
                PACKET {p + 1} · 248 B
              </text>
            </g>
          )
        })}
        <line x1={0} x2={W} y1={52} y2={52} className="pkt__base" />
      </svg>
      <figcaption className="pkt__cap">
        <span>
          <span className="num pkt__n">9.6</span> <span className="label">ms between samples</span>
        </span>
        <span>
          <span className="num pkt__n">≈96</span> <span className="label">ms between packets</span>
        </span>
        <span className="label">Derived from 104 Hz and 10 samples per packet</span>
      </figcaption>
    </figure>
  )
}

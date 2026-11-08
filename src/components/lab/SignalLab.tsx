import { useMemo, useState } from 'react'

/**
 * ParkinSense tremor analysis, in the browser. A generated gyroscope window (tremor + optional arm swing + noise)
 * goes through the documented method: mean removal, Welch PSD (2 s Hann segments, 50 % overlap), peak search in
 * 3.5–7.5 Hz. A second trace shows the 0.5–3 Hz arm-movement band the pipeline uses for motion context.
 */
const FS = 104
const WIN = 4 * FS // 4 s analysis window
const SEG = 2 * FS // 2 s Hann segments
const BAND: [number, number] = [3.5, 7.5]
const FMAX = 14
const DF = 0.1

function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NOISE = (() => {
  const r = rng(7)
  return Array.from({ length: WIN }, () => (r() + r() + r() + r() - 2) * 1.7)
})()

function psd(x: number[]) {
  const nF = Math.round(FMAX / DF) + 1
  const out = new Array(nF).fill(0)
  const hop = SEG / 2
  let count = 0
  const w = Array.from({ length: SEG }, (_, n) => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (SEG - 1)))
  for (let s = 0; s + SEG <= x.length; s += hop) {
    const seg = x.slice(s, s + SEG)
    const mean = seg.reduce((a, b) => a + b, 0) / SEG
    const y = seg.map((v, n) => (v - mean) * w[n])
    for (let k = 0; k < nF; k++) {
      const f = k * DF
      let re = 0
      let im = 0
      for (let n = 0; n < SEG; n++) {
        const ph = (2 * Math.PI * f * n) / FS
        re += y[n] * Math.cos(ph)
        im -= y[n] * Math.sin(ph)
      }
      out[k] += re * re + im * im
    }
    count++
  }
  return out.map((v) => v / Math.max(1, count))
}

/** Zero-phase band-pass by zeroing DFT bins outside [lo, hi] Hz. */
function bandpass(x: number[], lo: number, hi: number) {
  const N = x.length
  const mean = x.reduce((a, b) => a + b, 0) / N
  const y = new Array(N).fill(0)
  const kLo = Math.ceil((lo * N) / FS)
  const kHi = Math.floor((hi * N) / FS)
  for (let k = kLo; k <= kHi; k++) {
    let re = 0
    let im = 0
    for (let n = 0; n < N; n++) {
      const ph = (2 * Math.PI * k * n) / N
      re += (x[n] - mean) * Math.cos(ph)
      im -= (x[n] - mean) * Math.sin(ph)
    }
    for (let n = 0; n < N; n++) {
      const ph = (2 * Math.PI * k * n) / N
      y[n] += (2 / N) * (re * Math.cos(ph) - im * Math.sin(ph))
    }
  }
  return y
}

const path = (arr: number[], w: number, h: number, span: number) => {
  const dx = w / (arr.length - 1)
  return 'M' + arr.map((v, i) => `${(i * dx).toFixed(1)},${(h / 2 - (v / span) * (h / 2)).toFixed(1)}`).join(' L')
}

export function SignalLab() {
  const [hz, setHz] = useState(5)
  const [amp, setAmp] = useState(120)
  const [noise, setNoise] = useState(20)
  const [arm, setArm] = useState(true)
  const [show, setShow] = useState<'raw' | 'arm'>('raw')

  const d = useMemo(() => {
    const x = Array.from({ length: WIN }, (_, n) => {
      const t = n / FS
      return amp * Math.sin(2 * Math.PI * hz * t) + (arm ? 90 * Math.sin(2 * Math.PI * 1.0 * t + 0.8) : 0) + noise * NOISE[n]
    })
    const p = psd(x)
    // strongest peak in 0.5–FMAX Hz, and the strongest inside the detection band
    let pk = 5
    let pb = Math.round(BAND[0] / DF)
    for (let k = 5; k < p.length; k++) if (p[k] > p[pk]) pk = k
    for (let k = Math.round(BAND[0] / DF); k <= Math.round(BAND[1] / DF); k++) if (p[k] > p[pb]) pb = k
    return { x, p, pk: pk * DF, pb: pb * DF, armTrace: bandpass(x, 0.5, 3) }
  }, [hz, amp, noise, arm])

  const span = Math.max(150, ...d.x.map(Math.abs)) * 1.05
  const pmax = Math.max(...d.p)
  const insideBand = d.pk >= BAND[0] && d.pk <= BAND[1]
  const spec = 'M' + d.p.map((v, k) => `${((k * DF) / FMAX * 600).toFixed(1)},${(110 - (Math.sqrt(v / pmax) * 104)).toFixed(1)}`).join(' L')
  const bx0 = (BAND[0] / FMAX) * 600
  const bx1 = (BAND[1] / FMAX) * 600

  return (
    <div className="sl">
      <div className="sl__plots">
        <div className="sl__plot">
          <div className="sl__bar">
            <span className="label">Gyroscope, 4 s window at 104 Hz</span>
            <div className="sl__seg" role="group" aria-label="Trace">
              <button type="button" aria-pressed={show === 'raw'} onClick={() => setShow('raw')}>
                Raw
              </button>
              <button type="button" aria-pressed={show === 'arm'} onClick={() => setShow('arm')}>
                0.5–3 Hz arm band
              </button>
            </div>
          </div>
          <svg viewBox="0 0 600 130" preserveAspectRatio="none" role="img" aria-label="Generated gyroscope trace">
            <line x1="0" x2="600" y1="65" y2="65" className="sl__axis" />
            <path d={path(show === 'raw' ? d.x : d.armTrace, 600, 130, span)} className="sl__line" vectorEffect="non-scaling-stroke" fill="none" />
            <rect className="sl__scan" x="0" y="0" width="2" height="130" />
          </svg>
        </div>
        <div className="sl__plot">
          <div className="sl__bar">
            <span className="label">Welch spectrum · detection band 3.5–7.5 Hz</span>
          </div>
          <svg viewBox="0 0 600 130" preserveAspectRatio="none" role="img" aria-label="Spectrum of the generated trace">
            <rect x={bx0} y="0" width={bx1 - bx0} height="112" className="sl__band" />
            <line x1="0" x2="600" y1="110" y2="110" className="sl__axis" />
            <path d={spec} className="sl__line sl__line--spec" vectorEffect="non-scaling-stroke" fill="none" />
            <line x1={(d.pk / FMAX) * 600} x2={(d.pk / FMAX) * 600} y1="0" y2="110" className="sl__peak" vectorEffect="non-scaling-stroke" />
            {[0, 2, 4, 6, 8, 10, 12, 14].map((f) => (
              <text key={f} x={(f / FMAX) * 600} y="126" className="sl__tick" textAnchor={f === 0 ? 'start' : f === 14 ? 'end' : 'middle'}>
                {f}
              </text>
            ))}
          </svg>
        </div>
      </div>

      <div className="sl__ctl">
        <label>
          <span className="label">Tremor frequency</span>
          <input type="range" min="3" max="11" step="0.5" value={hz} onChange={(e) => setHz(+e.target.value)} />
          <output className="num">{hz.toFixed(1)} Hz</output>
        </label>
        <label>
          <span className="label">Tremor amplitude</span>
          <input type="range" min="0" max="200" step="10" value={amp} onChange={(e) => setAmp(+e.target.value)} />
          <output className="num">{amp} deg/s</output>
        </label>
        <label>
          <span className="label">Noise</span>
          <input type="range" min="0" max="60" step="5" value={noise} onChange={(e) => setNoise(+e.target.value)} />
          <output className="num">{noise}</output>
        </label>
        <label className="sl__check">
          <input type="checkbox" checked={arm} onChange={(e) => setArm(e.target.checked)} />
          <span className="label">1 Hz arm swing</span>
        </label>
      </div>

      <dl className="sl__out" aria-live="polite">
        <div>
          <dt className="label">Strongest peak</dt>
          <dd className="num">{amp === 0 ? 'none' : `${d.pk.toFixed(1)} Hz`}</dd>
        </div>
        <div>
          <dt className="label">Peak in 3.5–7.5 Hz</dt>
          <dd className="num">{amp === 0 ? 'none' : `${d.pb.toFixed(1)} Hz`}</dd>
        </div>
        <div>
          <dt className="label">Detection band</dt>
          <dd className={insideBand && amp > 0 ? 'sl__yes' : ''}>{amp === 0 ? 'No tremor' : insideBand ? 'Tremor-band peak' : 'Peak outside band'}</dd>
        </div>
      </dl>
      <p className="sl__note label">Generated signal · the method follows the repository’s documented pipeline</p>
    </div>
  )
}

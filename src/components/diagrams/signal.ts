/**
 * Synthetic wrist-accelerometer trace + the ParkinSense motion chain, computed in the browser.
 * The INPUT is synthetic (clearly labelled in the UI). The FILTERS are real:
 * 50 Hz notch and a 4.0–7.5 Hz Butterworth band-pass (2nd-order HP + 2nd-order LP), at fs = 104 Hz.
 */

export const FS = 104
export const SECONDS = 6

type Biquad = { b0: number; b1: number; b2: number; a1: number; a2: number }

function lowpass(fc: number, fs: number, q = Math.SQRT1_2): Biquad {
  const w = (2 * Math.PI * fc) / fs
  const alpha = Math.sin(w) / (2 * q)
  const c = Math.cos(w)
  const a0 = 1 + alpha
  return { b0: (1 - c) / 2 / a0, b1: (1 - c) / a0, b2: (1 - c) / 2 / a0, a1: (-2 * c) / a0, a2: (1 - alpha) / a0 }
}

function highpass(fc: number, fs: number, q = Math.SQRT1_2): Biquad {
  const w = (2 * Math.PI * fc) / fs
  const alpha = Math.sin(w) / (2 * q)
  const c = Math.cos(w)
  const a0 = 1 + alpha
  return { b0: (1 + c) / 2 / a0, b1: -(1 + c) / a0, b2: (1 + c) / 2 / a0, a1: (-2 * c) / a0, a2: (1 - alpha) / a0 }
}

function notch(fc: number, fs: number, q = 8): Biquad {
  const w = (2 * Math.PI * fc) / fs
  const alpha = Math.sin(w) / (2 * q)
  const c = Math.cos(w)
  const a0 = 1 + alpha
  return { b0: 1 / a0, b1: (-2 * c) / a0, b2: 1 / a0, a1: (-2 * c) / a0, a2: (1 - alpha) / a0 }
}

function run(f: Biquad, x: number[]) {
  const y: number[] = []
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0
  for (const v of x) {
    const o = f.b0 * v + f.b1 * x1 + f.b2 * x2 - f.a1 * y1 - f.a2 * y2
    x2 = x1
    x1 = v
    y2 = y1
    y1 = o
    y.push(o)
  }
  return y
}

const smooth = (a: number, b: number, t: number) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return k * k * (3 - 2 * k)
}

/** Deterministic pseudo-noise so the figure is identical on every render. */
function lcg(seed = 7) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296 - 0.5
  }
}

export type Trace = {
  t: number[]
  raw: number[]
  filtered: number[]
  envelope: number[]
  state: boolean[]
  enter: number
  exit: number
  tremorWindow: [number, number]
}

let cache: Trace | null = null

export function computeTrace(): Trace {
  if (cache) return cache
  const n = FS * SECONDS
  const rnd = lcg()
  const t: number[] = []
  const raw: number[] = []
  for (let i = 0; i < n; i++) {
    const s = i / FS
    const env = smooth(1.9, 2.4, s) * (1 - smooth(4.3, 4.8, s))
    const v =
      1.0 + // gravity, 1 g
      0.5 * Math.sin(2 * Math.PI * 0.45 * s) + // slow voluntary movement
      0.26 * env * Math.sin(2 * Math.PI * 5.4 * s) + // rest tremor burst
      0.07 * Math.sin(2 * Math.PI * 50 * s) + // mains pickup
      0.05 * rnd()
    t.push(s)
    raw.push(v)
  }
  // Gravity removal (mean subtraction over the window), notch, band-pass
  const mean = raw.reduce((a, b) => a + b, 0) / n
  const g = raw.map((v) => v - mean)
  const filtered = run(lowpass(7.5, FS), run(highpass(4.0, FS), run(notch(50, FS), g)))

  // Rectified, smoothed envelope and a two-threshold (hysteresis) state
  const envelope: number[] = []
  let e = 0
  for (const v of filtered) {
    e += 0.06 * (Math.abs(v) - e)
    envelope.push(e)
  }
  const peak = Math.max(...envelope)
  const enter = peak * 0.55
  const exit = peak * 0.28
  const state: boolean[] = []
  let on = false
  for (const v of envelope) {
    if (!on && v > enter) on = true
    else if (on && v < exit) on = false
    state.push(on)
  }
  cache = { t, raw, filtered, envelope, state, enter, exit, tremorWindow: [2.15, 4.55] }
  return cache
}

/** Map a series into an SVG path within a lane. */
export function toPath(ys: number[], x0: number, x1: number, yMid: number, scale: number) {
  const n = ys.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * i) / (n - 1)
    const y = yMid - ys[i] * scale
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)
  }
  return d
}

/** Contiguous runs where state is true, as [startIndex, endIndex]. */
export function runs(state: boolean[]) {
  const out: [number, number][] = []
  let s = -1
  state.forEach((v, i) => {
    if (v && s < 0) s = i
    if (!v && s >= 0) {
      out.push([s, i - 1])
      s = -1
    }
  })
  if (s >= 0) out.push([s, state.length - 1])
  return out
}

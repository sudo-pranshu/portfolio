import { useState } from 'react'
import { asset } from '../../config/personal'

/** Drag (or use arrow keys on) the divider to compare the hand-drawn photo with CircuitVision's output. */
export function BeforeAfter() {
  const [pos, setPos] = useState(50)
  return (
    <figure className="ba">
      <div className="ba__frame" style={{ ['--pos' as string]: `${pos}%` }}>
        <picture>
          <source srcSet={asset('assets/work/cv-u01-overlay.webp')} type="image/webp" />
          <img
            className="ba__img"
            src={asset('assets/work/cv-u01-overlay.jpg')}
            width={1400}
            height={512}
            alt="CircuitVision output: each detected component boxed and labelled with its nodes, each wire net drawn in its own colour"
          />
        </picture>
        <picture className="ba__top">
          <source srcSet={asset('assets/work/cv-u01-input.webp')} type="image/webp" />
          <img
            className="ba__img"
            src={asset('assets/work/cv-u01-input.jpg')}
            width={1400}
            height={512}
            alt="Hand-drawn circuit on plain paper: a diode, resistor, inductor, capacitor and a +5V battery"
          />
        </picture>
        <span className="ba__line" aria-hidden="true" />
        <span className="ba__tag ba__tag--l label">Photo</span>
        <span className="ba__tag ba__tag--r label">Detected + traced</span>
        <input
          className="ba__range"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare the photo with the reconstructed circuit"
        />
      </div>
      <figcaption className="label">
        Fig. 01 · A real hand-drawn test photo through the trained detector. Topology matches the hand-written reference;
        the battery value was misread.
      </figcaption>
    </figure>
  )
}

import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { asset } from '../../config/personal'
import { easeOut } from '../../animations/motion'

type Step = {
  id: string
  name: string
  what: string
  img?: { src: string; w: number; h: number; alt: string }
  code?: string
  facts: [string, string][]
}

const netlist = `* CircuitVision netlist
* ground: implicit: first source, second terminal
D1 0 3 DMOD
L1 2 0 1m
C1 2 1 1u
R1 3 2 1k
V1 1 0 45
.model DMOD D
.op
.end`

const steps: Step[] = [
  {
    id: 'binarise',
    name: 'Binarise',
    what: 'A grey closing estimates the paper, ink is measured as contrast relative to that paper, and Otsu thresholds the result. That survives grid paper, shadows and JPEG noise.',
    img: { src: 'cv-preprocess', w: 1187, h: 346, alt: 'Four panels: a shaded grid-paper input, the estimated paper, contrast relative to paper, and the final binary ink mask' },
    facts: [
      ['Method', 'Grey closing → paper-relative contrast → Otsu'],
      ['Handles', 'Grid paper, shadows, uneven light'],
    ],
  },
  {
    id: 'detect',
    name: 'Detect',
    what: 'YOLOv8s finds components, junctions, crossovers and text. It was trained on the CGHD handwritten-circuit dataset and tested on a drafter it never saw.',
    img: { src: 'cv-gate2-overlays', w: 1600, h: 636, alt: 'CGHD training photos with converted bounding-box labels drawn over each symbol' },
    facts: [
      ['Classes', 'Resistor, capacitor, inductor, voltage source, diode, ground, junction, crossover, text'],
      ['Data', '2,981 train · 96 val · 96 test photos'],
      ['Test mAP50 / 50–95', '0.904 / 0.611 (real)'],
      ['Weakest class', 'Voltage source, AP50 0.48'],
    ],
  },
  {
    id: 'orient',
    name: 'Orient',
    what: 'A HOG + linear SVM classifier reads each symbol’s rotation, which fixes the polarity of diodes and sources.',
    img: { src: 'cv-orientation', w: 1041, h: 368, alt: 'A diode symbol at 0, 90, 180 and 270 degrees, with the plus side marked for each' },
    facts: [
      ['Classifier accuracy', 'Voltage source 0.906, diode 0.775'],
      ['In the pipeline', '0.833 with ground-truth boxes, 0.639 with detector boxes'],
    ],
  },
  {
    id: 'trace',
    name: 'Trace wires',
    what: 'Symbols are masked so they can’t short wires together, connected ink becomes nets, terminal rings attach each component to its nets, and crossovers are kept apart. All sizes scale with the symbol size.',
    img: { src: 'cv-tracing', w: 1238, h: 609, alt: 'A bridge circuit on grid paper with symbols masked and each wire net coloured, next to the generated netlist' },
    facts: [
      ['Exact topology', '0.994 over 11 photo conditions (synthetic)'],
      ['Out of scope', 'Transistors, ICs, switches: masked, never in the netlist'],
    ],
  },
  {
    id: 'ocr',
    name: 'Read values',
    what: 'EasyOCR reads the labels next to each component. Values like 4k7 and 330R are parsed, checked against the component type, and attached once.',
    img: { src: 'cv-divider', w: 1041, h: 452, alt: 'A divider drawing and its output overlay, with component references and node numbers' },
    facts: [
      ['Synthetic labels', '0.914 exact, 0.950 character accuracy'],
      ['Real handwriting', '0.021 exact: the weakest stage'],
    ],
  },
  {
    id: 'netlist',
    name: 'Netlist',
    what: 'Components and nets become a SPICE netlist. Every netlist states its ground rule: the drawn ground symbol, or an implicit ground when there is none.',
    code: netlist,
    facts: [['Output', 'From the photo above; the battery value was read as 45 instead of 5']],
  },
  {
    id: 'validate',
    name: 'Validate + simulate',
    what: 'A context-free grammar and an Earley recogniser check the netlist, semantic checks catch impossible circuits, and ngspice computes the operating point. The Gradio app shows all of it.',
    img: { src: 'cv-app', w: 1400, h: 1092, alt: 'CircuitVision web app: a hand-drawn divider, the detected nets, the generated netlist and the validated DC operating point' },
    facts: [
      ['Checks', 'CFG / Earley + semantic constraints'],
      ['Simulation', 'ngspice .op'],
    ],
  },
]

/** Explorable image pipeline: WAI-ARIA tabs, arrow keys move between stages. */
export function CVPipeline() {
  const [i, setI] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent) => {
    let n = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % steps.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + steps.length) % steps.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = steps.length - 1
    else return
    e.preventDefault()
    setI(n)
    refs.current[n]?.focus()
  }
  const s = steps[i]
  return (
    <div className="cvp">
      <div className="cvp__rail" role="tablist" aria-label="CircuitVision image pipeline" onKeyDown={onKey}>
        {steps.map((st, k) => (
          <button
            key={st.id}
            ref={(el) => {
              refs.current[k] = el
            }}
            role="tab"
            id={`cvt-${st.id}`}
            aria-selected={k === i}
            aria-controls={`cvp-${st.id}`}
            tabIndex={k === i ? 0 : -1}
            className={`cvp__tab ${k === i ? 'is-active' : ''} ${k < i ? 'is-past' : ''}`}
            onClick={() => setI(k)}
          >
            <span className="label">{String(k + 1).padStart(2, '0')}</span>
            <span className="cvp__name">{st.name}</span>
          </button>
        ))}
      </div>
      <div className="cvp__panel" role="tabpanel" id={`cvp-${s.id}`} aria-labelledby={`cvt-${s.id}`}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={s.id}
            className="cvp__inner"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <div className="cvp__text">
              <h3 className="cvp__h">{s.name}</h3>
              <p>{s.what}</p>
              <dl className="spec">
                {s.facts.map(([k, v]) => (
                  <div className="spec__row" key={k}>
                    <dt className="label">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="cvp__media">
              {s.img ? (
                <picture>
                  <source srcSet={asset(`assets/work/${s.img.src}.webp`)} type="image/webp" />
                  <img
                    src={asset(`assets/work/${s.img.src}.jpg`)}
                    width={s.img.w}
                    height={s.img.h}
                    alt={s.img.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              ) : s.code ? (
                <pre className="cvp__code" aria-label="Generated SPICE netlist">
                  {s.code}
                </pre>
              ) : (
                <div className="cvp__empty label">No figure for this stage; numbers at left</div>
              )}
            </div>
          </m.div>
        </AnimatePresence>
      </div>
      <p className="cvp__hint label">Select a stage. Arrow keys work.</p>
    </div>
  )
}

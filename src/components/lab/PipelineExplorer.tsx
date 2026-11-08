import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { easeOut } from '../../animations/motion'
import { statusLabel, type Stage } from '../../data/lab'

/**
 * Selectable pipeline. Tabs (arrow keys, Home, End) pick a stage; the panel shows its purpose, what goes in and
 * out, and the documented parameters. "Follow the data" steps through the stages in order, once, when pressed.
 */
export function PipelineExplorer({ stages, label }: { stages: Stage[]; label: string }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const s = stages[i]

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => {
      if (i >= stages.length - 1) setPlaying(false)
      else setI(i + 1)
    }, 1500)
    return () => window.clearTimeout(id)
  }, [playing, i, stages.length])

  const go = (n: number) => {
    setPlaying(false)
    setI(n)
    refs.current[n]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const last = stages.length - 1
    let n = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = i === last ? 0 : i + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = i === 0 ? last : i - 1
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = last
    else return
    e.preventDefault()
    go(n)
  }

  return (
    <div className="px">
      <div className="px__bar">
        <span className="label">Pipeline · {stages.length} stages</span>
        <button
          type="button"
          className="px__play link"
          onClick={() => {
            setI(0)
            setPlaying((p) => !p)
          }}
          aria-pressed={playing}
        >
          {playing ? 'Stop' : 'Follow the data'} <span className="arrow">→</span>
        </button>
      </div>

      <div className="px__rail" role="tablist" aria-label={label} onKeyDown={onKey}>
        {stages.map((st, k) => (
          <button
            key={st.id}
            ref={(el) => {
              refs.current[k] = el
            }}
            role="tab"
            id={`px-${label}-${st.id}`}
            aria-selected={k === i}
            aria-controls={`pxp-${label}`}
            tabIndex={k === i ? 0 : -1}
            className={`px__node ${k === i ? 'is-active' : ''} ${k < i ? 'is-past' : ''} px__node--${st.status}`}
            onClick={() => go(k)}
          >
            <span className="px__n label">{String(k + 1).padStart(2, '0')}</span>
            <span className="px__name">{st.name}</span>
            <span className="px__short">{st.short}</span>
            {k < stages.length - 1 && <span className={`px__wire ${playing && k === i ? 'is-live' : ''}`} aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div className="px__panel" role="tabpanel" id={`pxp-${label}`} aria-labelledby={`px-${label}-${s.id}`}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={s.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="px__inner"
          >
            <div className="px__text">
              <span className={`px__status px__status--${s.status} label`}>{statusLabel[s.status]}</span>
              <h3 className="px__h serif">{s.name}</h3>
              <p>{s.purpose}</p>
              {(s.inputs.length > 0 || s.outputs.length > 0) && (
                <div className="px__io">
                  <div>
                    <span className="label">In</span>
                    <ul>
                      {s.inputs.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="px__io-arrow" aria-hidden="true">
                    →
                  </span>
                  <div>
                    <span className="label">Out</span>
                    <ul>
                      {s.outputs.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <dl className="spec px__spec">
              {s.facts.map(([k, v]) => (
                <div className="spec__row" key={k}>
                  <dt className="label">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** PPG signal-lock state machine. State names are from the resume; transition conditions are not published, so none are drawn. */
export function LockStates() {
  const states = ['SEARCHING', 'LOCKED', 'TRACKING']
  return (
    <figure className="lock">
      <ol className="lock__row" aria-label="PPG lock states, in order">
        {states.map((s, i) => (
          <li key={s} className={`lock__state ${i === 2 ? 'lock__state--on' : ''}`}>
            <span className="label">S{i}</span>
            <span className="lock__name">{s}</span>
          </li>
        ))}
      </ol>
      <figcaption className="label">Signal-lock sequence in the PPG pipeline</figcaption>
    </figure>
  )
}

const stages = ['Sense', 'Perceive', 'Feed back', 'Assist'] as const

const rows: { device: string; path: string; cells: [string, string, string, string] }[] = [
  {
    device: 'Echo-Stride',
    path: 'Obstacles',
    cells: [
      'Ultrasonic sensors measure the path ahead',
      'Arduino Uno detects an obstacle',
      'Vibration motor and buzzer',
      'Real-time warning in the hand',
    ],
  },
  {
    device: 'Echo-Stride',
    path: 'Location',
    cells: [
      'GPS L80-M39 position fix',
      'Sent over HC-05 Bluetooth to the phone',
      'Tasker texts a Google Maps link',
      'Trusted contacts know where the user is',
    ],
  },
  {
    device: 'EyeCue',
    path: 'Scene',
    cells: [
      'ESP32-CAM captures frames',
      'TensorFlow Lite recognises objects and people, on-device',
      'Serial output today; speech output in progress',
      'Awareness of what is around',
    ],
  },
]

/** NaviSight as one assistive system: each row is a path through the same four stages. */
export function AssistMatrix() {
  return (
    <figure className="amx">
      <div className="amx__grid" role="table" aria-label="NaviSight: how each path moves from sensing to assistance">
        <div className="amx__row amx__row--head" role="row">
          <span role="columnheader" className="label">
            Path
          </span>
          {stages.map((s, i) => (
            <span key={s} role="columnheader" className="label">
              {String(i + 1).padStart(2, '0')} {s}
            </span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.device + r.path} className="amx__row" role="row">
            <span role="rowheader" className="amx__who">
              <span className="amx__dev">{r.device}</span>
              <span className="label">{r.path}</span>
            </span>
            {r.cells.map((c, i) => (
              <span key={i} role="cell" className="amx__cell" data-stage={stages[i]}>
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
      <figcaption className="label">Fig. 01 · One system, three paths. Stages are shared; devices are not.</figcaption>
    </figure>
  )
}

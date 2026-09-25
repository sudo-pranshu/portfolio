import type { ReactNode } from 'react'

type Props = { idx: string; title: ReactNode; aside?: ReactNode; as?: 'h1' | 'h2' }

export function SecHead({ idx, title, aside, as: H = 'h2' }: Props) {
  return (
    <div className="sec-head">
      <span className="sec-head__idx label label--accent">{idx}</span>
      <H className="sec-head__title h2">{title}</H>
      {aside && <div className="sec-head__aside muted">{aside}</div>}
    </div>
  )
}

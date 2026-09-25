import { interestLayers } from '../data/career'
import { SecHead } from './SecHead'
import { Reveal } from './Reveal'

/**
 * Areas of interest as a layered index, chip at the top, systems at the bottom.
 * No ranking, no levels: this is where Pranshu wants to work, not a skills claim.
 */
export function Interests({ idx, id = 'interests-h' }: { idx: string; id?: string }) {
  return (
    <section className="section wrap interests" aria-labelledby={id}>
      <SecHead
        idx={idx}
        title={<span id={id}>Areas of interest</span>}
        aside="Where I want to work next, from the chip up to the whole system. Some I have built in; others I am still learning."
      />
      <Reveal>
        <dl className="layers">
          {interestLayers.map((l) => (
            <div key={l.layer} className="layers__row">
              <dt className="label">{l.layer}</dt>
              <dd className="layers__clip">
                <ul className="layers__set">
                  {l.items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}

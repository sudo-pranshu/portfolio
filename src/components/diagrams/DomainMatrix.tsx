import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { domainColumns, domains } from '../../data/career'

/** Where each discipline actually appears. Rows = domains, columns = projects and roles. */
export function DomainMatrix() {
  return (
    <div className="matrix">
      <table className="matrix__table">
        <caption className="sr-only">Engineering domains and the projects or roles where each was used</caption>
        <thead>
          <tr>
            <th scope="col" className="matrix__corner label">
              Domain
            </th>
            {domainColumns.map((c) => (
              <th key={c.key} scope="col" className="matrix__col">
                <Link to={c.to} className="label">
                  {c.label}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domains.map((d) => (
            <tr key={d.name}>
              <th scope="row" className="matrix__row">
                <span className="matrix__name">{d.name}</span>
                <span className="matrix__note">{d.note}</span>
              </th>
              {domainColumns.map((c) => {
                const on = (d.in as readonly string[]).includes(c.key)
                return (
                  <td key={c.key} className={on ? 'is-on' : ''}>
                    {on ? <span className="matrix__mark" aria-label="yes" /> : <span className="sr-only">no</span>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Narrow screens: the same data as a list */}
      <ul className="matrix__list">
        {domains.map((d) => (
          <li key={d.name}>
            <span className="matrix__name">{d.name}</span>
            <span className="matrix__note">{d.note}</span>
            <span className="matrix__where label">
              {domainColumns
                .filter((c) => (d.in as readonly string[]).includes(c.key))
                .map((c, i) => (
                  <Fragment key={c.key}>
                    {i > 0 && ' / '}
                    <span>{c.label}</span>
                  </Fragment>
                ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

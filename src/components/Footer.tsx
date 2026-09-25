import { Link, useLocation } from 'react-router-dom'
import { personal, socials } from '../config/personal'
import { navItems } from '../config/nav'
import { getProject } from '../data/projects'

function sheetName(path: string) {
  if (path === '/') return 'Index'
  const p = path.match(/^\/work\/(.+)$/)
  if (p) return getProject(p[1])?.title ?? 'Not found'
  return navItems.find((n) => n.to === path)?.label ?? 'Not found'
}

/** Footer laid out as an engineering drawing title block. Every cell holds real information. */
export function Footer() {
  const { pathname } = useLocation()
  return (
    <footer className="foot" role="contentinfo">
      <div className="wrap">
        <div className="foot__block">
          <div className="foot__cell foot__cell--name">
            <span className="label">Drawn by</span>
            <span className="foot__name">{personal.name}</span>
          </div>
          <div className="foot__cell">
            <span className="label">Sheet</span>
            <span>{sheetName(pathname)}</span>
          </div>
          <div className="foot__cell">
            <span className="label">Based</span>
            <span>{personal.location}</span>
          </div>
          <div className="foot__cell">
            <span className="label">Rev.</span>
            <span>2026.09</span>
          </div>
          <div className="foot__cell foot__cell--wide">
            <span className="label">Write</span>
            <a className="inline-link" href={`mailto:${personal.email}`}>
              {personal.email}
            </a>
          </div>
          <div className="foot__cell foot__cell--wide">
            <span className="label">Elsewhere</span>
            <span className="foot__socials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-link">
                  {s.label}
                </a>
              ))}
            </span>
          </div>
          <nav className="foot__cell foot__cell--nav" aria-label="Footer">
            <span className="label">Index</span>
            <span className="foot__nav">
              <Link to="/">Home</Link>
              {navItems.map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label}
                </Link>
              ))}
              <a href={personal.resume} target="_blank" rel="noopener">
                Résumé
              </a>
            </span>
          </nav>
        </div>
      </div>
    </footer>
  )
}

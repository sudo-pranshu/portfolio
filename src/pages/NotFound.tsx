import { Link, useLocation } from 'react-router-dom'
import { Page } from '../components/Page'
import { projects } from '../data/projects'

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <Page title="Not found | Pranshu Kumar" description="This page does not exist." path={pathname}>
      <section className="wrap page-head nf">
        <span className="label label--accent">Error 404</span>
        <h1 className="page-head__title display">No such sheet</h1>
        <p className="page-head__lede serif">
          Nothing lives at <code className="nf__path">{pathname}</code>. Try one of these.
        </p>
        <ul className="nf__links">
          <li>
            <Link to="/" className="link">
              Home <span className="arrow">→</span>
            </Link>
          </li>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link to={`/work/${p.slug}`} className="link">
                {p.title} <span className="arrow">→</span>
              </Link>
            </li>
          ))}
          <li>
            <Link to="/contact" className="link">
              Contact <span className="arrow">→</span>
            </Link>
          </li>
        </ul>
      </section>
    </Page>
  )
}

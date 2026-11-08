import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setRecruiter, useRecruiter } from '../hooks/useRecruiter'

/** Shown on every page except the overview while recruiter mode is on: a clear way back and a way out. */
export function RecruiterBar() {
  const on = useRecruiter()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  if (!on || pathname === '/recruiter') return null
  return (
    <div className="rbar" role="region" aria-label="Recruiter mode">
      <div className="wrap rbar__in">
        <span className="label label--accent">Recruiter mode</span>
        <Link className="link" to="/recruiter">
          <span aria-hidden="true">← </span>Overview
        </Link>
        <button
          type="button"
          className="link"
          onClick={() => {
            setRecruiter(false)
            navigate('/')
          }}
        >
          Exit
        </button>
      </div>
    </div>
  )
}

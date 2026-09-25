import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { personal } from '../config/personal'
import { useTheme } from '../hooks/useTheme'
import { easeOut } from '../animations/motion'
import { navItems } from '../config/nav'


export function Nav() {
  const reduce = useReducedMotion()
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  // The menu belongs to the page it was opened on, so any navigation closes it.
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === pathname
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenAt((typeof v === 'function' ? v(open) : v) ? pathname : null)
  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenAt(null)
        btnRef.current?.focus()
      }
      if (e.key === 'Tab' && menuRef.current) {
        const f = menuRef.current.querySelectorAll<HTMLElement>('a,button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="nav">
      <div className="wrap nav__bar">
        <Link to="/" className="nav__mark" aria-label="Pranshu Kumar, home">
          <span className="nav__sq" aria-hidden="true" />
          <span>Pranshu Kumar</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {navItems.map((it) => (
            <NavLink key={it.to} to={it.to} className="nav__link">
              <span className="nav__idx">{it.idx}</span>
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__util">
          <button
            type="button"
            className="nav__theme"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span className="nav__themeicon" aria-hidden="true" />
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <a className="nav__cv" href={personal.resume} target="_blank" rel="noopener">
            Résumé<span aria-hidden="true"> ↗</span>
          </a>
          <button
            ref={btnRef}
            type="button"
            className="nav__menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.45, ease: easeOut } }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.25, ease: 'easeIn' } }}
          >
            <div className="wrap menu__inner">
              <ul className="menu__list">
                <li>
                  <NavLink to="/" end className="menu__link">
                    <span className="label">00</span>Home
                  </NavLink>
                </li>
                {navItems.map((it, i) => (
                  <m.li
                    key={it.to}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.04, duration: 0.5, ease: easeOut } }}
                  >
                    <NavLink to={it.to} className="menu__link">
                      <span className="label">{it.idx}</span>
                      {it.label}
                    </NavLink>
                  </m.li>
                ))}
              </ul>
              <div className="menu__foot">
                <a className="link" href={`mailto:${personal.email}`}>
                  {personal.email}
                </a>
                <div className="menu__foot-row">
                  <a className="link" href={personal.resume} target="_blank" rel="noopener">
                    Résumé PDF <span className="arrow">↗</span>
                  </a>
                  <button type="button" className="link" onClick={toggle}>
                    {theme === 'dark' ? 'Light theme' : 'Dark theme'}
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}

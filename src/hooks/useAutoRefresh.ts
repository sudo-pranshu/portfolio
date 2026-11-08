import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const GUARD = 'pk-refreshed'

/**
 * Picks up new deploys in an open tab. The build id baked into this bundle is compared with /version.json:
 * on returning to the tab and on every page change the site reloads if a newer build exists, so it never
 * reloads mid-read. A 5-minute check only marks the tab stale. Guarded against reload loops.
 */
function reload() {
  try {
    const last = Number(sessionStorage.getItem(GUARD) ?? 0)
    if (Date.now() - last < 60_000) return
    sessionStorage.setItem(GUARD, String(Date.now()))
  } catch {
    /* storage unavailable: reload anyway */
  }
  window.location.reload()
}

export function useAutoRefresh() {
  const { pathname } = useLocation()
  const stale = useRef(false)

  useEffect(() => {
    if (!import.meta.env.PROD) return
    const check = async () => {
      try {
        const r = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: 'no-store' })
        if (!r.ok) return
        const { id } = (await r.json()) as { id?: string }
        if (id && id !== __BUILD_ID__) stale.current = true
      } catch {
        /* offline: try again later */
      }
    }
    const reloadIfStale = async () => {
      await check()
      if (stale.current) reload()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') void reloadIfStale()
    }
    document.addEventListener('visibilitychange', onVisible)
    const timer = window.setInterval(() => void check(), 5 * 60_000)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!import.meta.env.PROD) return
    if (stale.current) reload()
  }, [pathname])
}

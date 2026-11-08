import { useSyncExternalStore } from 'react'

/**
 * Recruiter mode: a tab-session preference. It switches on from the nav toggle, the /recruiter URL or ?mode=recruiter,
 * persists while the visitor navigates, and is cleared by the toggle. It sets data-mode on <html> for styling.
 */
const KEY = 'pk-mode'
const listeners = new Set<() => void>()

function initial() {
  if (typeof window === 'undefined') return false
  const here = window.location.pathname + window.location.hash
  if (/\/recruiter\/?$/.test(here) || new URLSearchParams(window.location.search).get('mode') === 'recruiter') return true
  try {
    return sessionStorage.getItem(KEY) === 'recruiter'
  } catch {
    return false
  }
}

let current = initial()

function apply() {
  if (typeof document === 'undefined') return
  if (current) document.documentElement.dataset.mode = 'recruiter'
  else delete document.documentElement.dataset.mode
}
apply()

export function setRecruiter(on: boolean) {
  if (on === current) return
  current = on
  try {
    if (on) sessionStorage.setItem(KEY, 'recruiter')
    else sessionStorage.removeItem(KEY)
  } catch {
    /* storage unavailable: the mode still holds for this page load */
  }
  apply()
  listeners.forEach((l) => l())
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const useRecruiter = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => false,
  )

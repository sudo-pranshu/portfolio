import { useState } from 'react'
import { personal } from '../config/personal'

export function CopyEmail({ className = 'link' }: { className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personal.email)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.setTimeout(() => setState('idle'), 2200)
  }

  return (
    <button type="button" className={className} onClick={copy}>
      {state === 'copied' ? 'Copied to clipboard' : state === 'failed' ? 'Copy blocked, select the address' : 'Copy address'}
      <span className="sr-only" aria-live="polite">
        {state === 'copied' ? 'Email address copied' : ''}
      </span>
    </button>
  )
}

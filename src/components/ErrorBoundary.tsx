import { Component, type ErrorInfo, type ReactNode } from 'react'

type State = { failed: boolean }

/** Last line of defence: a render or chunk-load failure shows a way out instead of a blank screen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main id="main" className="fatal">
        <div className="wrap">
          <span className="label label--accent">Something went wrong</span>
          <h1 className="fatal__title serif">This page didn’t load</h1>
          <p className="fatal__text">
            A file may have changed while you were browsing. Reloading fetches the latest version.
          </p>
          <div className="fatal__row">
            <button type="button" className="rbtn rbtn--primary" onClick={() => window.location.reload()}>
              Reload
            </button>
            <a className="rbtn" href={import.meta.env.BASE_URL}>
              Home
            </a>
          </div>
        </div>
      </main>
    )
  }
}

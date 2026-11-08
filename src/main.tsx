import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'
import './styles/home.css'
import './styles/pages.css'
import './styles/case.css'
import './styles/diagrams.css'
import './styles/recruiter.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

/** VITE_HASH_ROUTER=1 builds a hash-routed copy for hosts without SPA rewrites. */
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </StrictMode>,
)

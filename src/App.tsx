import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { RecruiterBar } from './components/RecruiterBar'
import { useRecruiter } from './hooks/useRecruiter'
import Home from './pages/Home'

/** A deploy can leave an open tab pointing at files that no longer exist. Reload once to pick up the new build. */
const RELOAD_KEY = 'chunk-reload'
const reloadOnce = () => {
  try {
    if (sessionStorage.getItem(RELOAD_KEY)) return false
    sessionStorage.setItem(RELOAD_KEY, '1')
  } catch {
    return false
  }
  window.location.reload()
  return true
}
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (e) => {
    if (reloadOnce()) e.preventDefault()
  })
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      try {
        sessionStorage.removeItem(RELOAD_KEY)
      } catch {
        /* storage unavailable */
      }
    }, 5000)
  })
}
const retry = <T extends ComponentType<never>>(load: () => Promise<{ default: T }>) => () =>
  load().catch((err) => {
    if (reloadOnce()) return new Promise<{ default: T }>(() => {})
    throw err
  })

const loaders = {
  work: () => import('./pages/Work'),
  about: () => import('./pages/About'),
  experience: () => import('./pages/Experience'),
  education: () => import('./pages/Education'),
  contact: () => import('./pages/Contact'),
  resume: () => import('./pages/Resume'),
  lab: () => import('./pages/Lab'),
  recruiter: () => import('./pages/Recruiter'),
  notFound: () => import('./pages/NotFound'),
  parkinsense: () => import('./pages/work/ParkinSense'),
  circuitvision: () => import('./pages/work/CircuitVision'),
  tremosense: () => import('./pages/work/TremoSense'),
  navisight: () => import('./pages/work/NaviSight'),
  rlcar: () => import('./pages/work/RLCar'),
  walle: () => import('./pages/work/WallE'),
  traffic: () => import('./pages/work/Traffic'),
}
const Work = lazy(retry(loaders.work))
const About = lazy(retry(loaders.about))
const Experience = lazy(retry(loaders.experience))
const Education = lazy(retry(loaders.education))
const Contact = lazy(retry(loaders.contact))
const Resume = lazy(retry(loaders.resume))
const Lab = lazy(retry(loaders.lab))
const Recruiter = lazy(retry(loaders.recruiter))
const NotFound = lazy(retry(loaders.notFound))
const ParkinSense = lazy(retry(loaders.parkinsense))
const CircuitVision = lazy(retry(loaders.circuitvision))
const TremoSense = lazy(retry(loaders.tremosense))
const NaviSight = lazy(retry(loaders.navisight))
const RLCar = lazy(retry(loaders.rlcar))
const WallE = lazy(retry(loaders.walle))
const Traffic = lazy(retry(loaders.traffic))

/** Route chunks are small; fetch them all once the first page is idle so navigation never waits. */
function usePrefetchRoutes() {
  useEffect(() => {
    const run = () => Object.values(loaders).forEach((l) => l())
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(run)
    else window.setTimeout(run, 1200)
  }, [])
}

export default function App() {
  const location = useLocation()
  const recruiter = useRecruiter()
  usePrefetchRoutes()

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="rules" aria-hidden="true">
        <div className="wrap">
          <span />
        </div>
      </div>

      {/* Route change marker: a single accent hairline that sweeps once. */}
      <m.div
        key={location.pathname}
        className="route-bar"
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ scaleX: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3, delay: 0.45 } }}
      />

      <Nav />
      <RecruiterBar />

      <Suspense fallback={<main id="main" className="page-fallback" />}>
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={recruiter ? <Navigate to="/recruiter" replace /> : <Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/parkinsense" element={<ParkinSense />} />
            <Route path="/work/circuitvision" element={<CircuitVision />} />
            <Route path="/work/tremosense" element={<TremoSense />} />
            <Route path="/work/navisight" element={<NaviSight />} />
            <Route path="/work/rl-autonomous-car" element={<RLCar />} />
            <Route path="/work/wall-e" element={<WallE />} />
            <Route path="/work/traffic-management" element={<Traffic />} />
            <Route path="/about" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/recruiter" element={<Recruiter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <Footer />
    </MotionConfig>
    </LazyMotion>
  )
}

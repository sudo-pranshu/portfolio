import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import Home from './pages/Home'

const loaders = {
  work: () => import('./pages/Work'),
  about: () => import('./pages/About'),
  experience: () => import('./pages/Experience'),
  education: () => import('./pages/Education'),
  contact: () => import('./pages/Contact'),
  notFound: () => import('./pages/NotFound'),
  parkinsense: () => import('./pages/work/ParkinSense'),
  tremosense: () => import('./pages/work/TremoSense'),
  navisight: () => import('./pages/work/NaviSight'),
  rlcar: () => import('./pages/work/RLCar'),
  walle: () => import('./pages/work/WallE'),
  traffic: () => import('./pages/work/Traffic'),
}
const Work = lazy(loaders.work)
const About = lazy(loaders.about)
const Experience = lazy(loaders.experience)
const Education = lazy(loaders.education)
const Contact = lazy(loaders.contact)
const NotFound = lazy(loaders.notFound)
const ParkinSense = lazy(loaders.parkinsense)
const TremoSense = lazy(loaders.tremosense)
const NaviSight = lazy(loaders.navisight)
const RLCar = lazy(loaders.rlcar)
const WallE = lazy(loaders.walle)
const Traffic = lazy(loaders.traffic)

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

      <Suspense fallback={<main id="main" className="page-fallback" />}>
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/parkinsense" element={<ParkinSense />} />
            <Route path="/work/tremosense" element={<TremoSense />} />
            <Route path="/work/navisight" element={<NaviSight />} />
            <Route path="/work/rl-autonomous-car" element={<RLCar />} />
            <Route path="/work/wall-e" element={<WallE />} />
            <Route path="/work/traffic-management" element={<Traffic />} />
            <Route path="/about" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <Footer />
    </MotionConfig>
    </LazyMotion>
  )
}

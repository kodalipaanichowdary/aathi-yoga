import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SplashScreen from './pages/SplashScreen'
import AuthPage from './pages/auth/AuthPage'
import OtpVerification from './pages/OtpVerification'
import AppShell from './components/layout/AppShell'
import HomeDashboard from './pages/home/HomeDashboard'
import CategoryIndex from './pages/store/CategoryIndex'
import CategoryProducts from './pages/store/CategoryProducts'
import ProductDetail from './pages/store/ProductDetail'
import CartPage from './pages/cart/CartPage'
import CheckoutPage from './pages/cart/CheckoutPage'
import CourseCatalog from './pages/courses/CourseCatalog'
import CoursePlayer from './pages/courses/CoursePlayer'
import SessionComplete from './pages/courses/SessionComplete'
import MembershipPage from './pages/membership/MembershipPage'
import CoachingPage from './pages/coaching/CoachingPage'
import DietPlansPage from './pages/diet/DietPlansPage'
import SupportPage from './pages/support/SupportPage'
import MeditationSession from './pages/life/MeditationSession'
import ComingSoon from './pages/ComingSoon'
import { DURATION, EASE } from './lib/motion'

/**
 * Route changes use an asymmetric transition: the outgoing page leaves at
 * tap speed and the incoming one arrives with a short rise. `mode="wait"`
 * plays them in series, so a literal 600ms crossfade each way would put
 * 1.2s between taps — the 500-700ms band from the motion spec is spent on
 * section reveals instead, where it has room to breathe.
 */
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.hover * 1.5, ease: EASE.emphasized } },
  exit: { opacity: 0, transition: { duration: DURATION.tap, ease: EASE.standard } },
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><SplashScreen /></AnimatedPage>} />
        <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
        <Route path="/verify-otp" element={<AnimatedPage><OtpVerification /></AnimatedPage>} />

        <Route element={<AppShell />}>
          <Route path="/home" element={<AnimatedPage><HomeDashboard /></AnimatedPage>} />
          <Route path="/categories" element={<AnimatedPage><CategoryIndex /></AnimatedPage>} />
          <Route path="/store" element={<AnimatedPage><CategoryProducts /></AnimatedPage>} />
          <Route path="/store/:categorySlug" element={<AnimatedPage><CategoryProducts /></AnimatedPage>} />
          <Route path="/product/:productId" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
          <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
          <Route path="/courses" element={<AnimatedPage><CourseCatalog /></AnimatedPage>} />
          <Route path="/courses/:courseId/play" element={<AnimatedPage><CoursePlayer /></AnimatedPage>} />
          <Route path="/courses/:courseId/complete" element={<AnimatedPage><SessionComplete /></AnimatedPage>} />
          <Route path="/membership" element={<AnimatedPage><MembershipPage /></AnimatedPage>} />
          <Route path="/coaching" element={<AnimatedPage><CoachingPage /></AnimatedPage>} />
          <Route path="/diet" element={<AnimatedPage><DietPlansPage /></AnimatedPage>} />
          <Route path="/support" element={<AnimatedPage><SupportPage /></AnimatedPage>} />
          <Route path="/meditate" element={<AnimatedPage><MeditationSession /></AnimatedPage>} />
          <Route path="/coming-soon" element={<AnimatedPage><ComingSoon /></AnimatedPage>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

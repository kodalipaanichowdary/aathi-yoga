import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/useAuthStore'
import './SplashScreen.css'

const SPLASH_DURATION_MS = 700

export default function SplashScreen() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)

  function handleSkip() {
    navigate(currentUser ? '/home' : '/auth', { replace: true })
  }

  useEffect(() => {
    const timer = setTimeout(handleSkip, SPLASH_DURATION_MS)
    return () => clearTimeout(timer)
  }, [navigate, currentUser])

  return (
    <div className="splash" onClick={handleSkip} style={{ cursor: 'pointer' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Logo variant="badge" size="lg" />
      </motion.div>
    </div>
  )
}

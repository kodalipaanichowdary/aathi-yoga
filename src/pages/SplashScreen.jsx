import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/useAuthStore'
import './SplashScreen.css'

const SPLASH_DURATION_MS = 2400

export default function SplashScreen() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(currentUser ? '/home' : '/auth', { replace: true })
    }, SPLASH_DURATION_MS)
    return () => clearTimeout(timer)
  }, [navigate, currentUser])

  return (
    <div className="splash">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <Logo variant="badge" size="lg" />
      </motion.div>
    </div>
  )
}

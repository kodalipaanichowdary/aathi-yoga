import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import './AuthPage.css'

export default function AuthPage() {
  const location = useLocation()
  const initial = location.state ?? {}
  const [mode, setMode] = useState(initial.mode === 'signup' ? 'signup' : 'login')
  const [prefillData, setPrefillData] = useState(initial.prefill ?? initial)

  function handleSwitchToSignup(customPrefill) {
    if (customPrefill) {
      setPrefillData((prev) => ({ ...prev, ...customPrefill }))
    }
    setMode('signup')
  }

  function handleSwitchToLogin(customPrefill) {
    if (customPrefill) {
      setPrefillData((prev) => ({ ...prev, ...customPrefill }))
    }
    setMode('login')
  }

  return (
    <div className="auth-page">
      <motion.div className="auth-card" layout transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
            >
              <LoginForm onSwitchToSignup={handleSwitchToSignup} prefill={prefillData} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
            >
              <SignupForm onSwitchToLogin={handleSwitchToLogin} prefill={prefillData} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

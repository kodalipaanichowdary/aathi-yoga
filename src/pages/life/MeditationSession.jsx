import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CircularTimer from '../courses/CircularTimer'
import PoseIllustration from '../../components/icons/PoseIllustration'
import Button from '../../components/ui/Button'
import { MEDITATION_SESSION } from '../../data/meditation'
import './MeditationSession.css'

export default function MeditationSession() {
  const navigate = useNavigate()
  const [remainingSec, setRemainingSec] = useState(MEDITATION_SESSION.durationSec)
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)

  const finishSession = useCallback(() => {
    setRunning(false)
    setComplete(true)
  }, [])

  useEffect(() => {
    if (!running || remainingSec <= 0) return
    const timer = setInterval(() => {
      setRemainingSec((seconds) => Math.max(seconds - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [running, remainingSec])

  useEffect(() => {
    if (!running || remainingSec > 0) return
    const timeout = setTimeout(() => finishSession(), 0)
    return () => clearTimeout(timeout)
  }, [running, remainingSec, finishSession])

  function handleRestart() {
    setRemainingSec(MEDITATION_SESSION.durationSec)
    setComplete(false)
    setRunning(false)
  }

  const timerLabel = running ? 'Pause' : remainingSec === MEDITATION_SESSION.durationSec ? 'Start' : 'Resume'

  return (
    <div className="meditation-session">
      <button type="button" className="meditation-session__back" onClick={() => navigate('/home')} aria-label="Back to home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {complete ? (
        <motion.div
          className="meditation-session__complete"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PoseIllustration name="meditation" size={100} />
          <h1>Session Complete</h1>
          <p>You gave yourself {Math.round(MEDITATION_SESSION.durationSec / 60)} quiet minutes today. Well done.</p>
          <div className="meditation-session__complete-actions">
            <Button variant="outline" onClick={handleRestart}>
              Meditate Again
            </Button>
            <Button onClick={() => navigate('/home')}>Return to Home</Button>
          </div>
        </motion.div>
      ) : (
        <>
          <h1 className="meditation-session__title">{MEDITATION_SESSION.name}</h1>
          <p className="meditation-session__tagline">{MEDITATION_SESSION.tagline}</p>

          <CircularTimer remainingSec={remainingSec} durationSec={MEDITATION_SESSION.durationSec} />

          <div className="meditation-session__controls">
            <Button variant="outline" onClick={handleRestart}>
              Restart
            </Button>
            <Button onClick={() => setRunning((value) => !value)}>{timerLabel}</Button>
          </div>
        </>
      )}
    </div>
  )
}

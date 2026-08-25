import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useModeStore } from '../../store/useModeStore'
import { TAP } from '../../lib/motion'
import './TopPillToggle.css'

const MODES = [
  { id: 'yoga', label: 'AATHI YOGA' },
  { id: 'life', label: 'AATHI LIFE' },
]

const FAST_SPRING = { type: 'spring', stiffness: 520, damping: 30 }

export default function TopPillToggle() {
  const mode = useModeStore((state) => state.mode)
  const setMode = useModeStore((state) => state.setMode)
  const location = useLocation()
  const navigate = useNavigate()

  function handleSelectMode(id) {
    setMode(id)
    if (location.pathname !== '/home') {
      navigate('/home')
    }
  }

  return (
    <div className="top-pill-toggle-wrapper">
      <div className="top-pill-toggle" role="tablist" aria-label="Mode selection">
        {MODES.map((option) => {
          const active = mode === option.id
          return (
            <motion.button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`top-pill-toggle__pill ${active ? 'top-pill-toggle__pill--active' : ''}`.trim()}
              onClick={() => handleSelectMode(option.id)}
              whileTap={TAP}
            >
              {active && (
                <motion.span
                  layoutId="top-pill-toggle-active"
                  className="top-pill-toggle__active-bg"
                  transition={FAST_SPRING}
                />
              )}
              <span className="top-pill-toggle__label">{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

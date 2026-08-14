import { motion } from 'framer-motion'
import { useModeStore } from '../../store/useModeStore'
import { SPRING, TAP } from '../../lib/motion'
import './TopPillToggle.css'

const MODES = [
  { id: 'yoga', label: 'AATHI YOGA' },
  { id: 'life', label: 'AATHI LIFE' },
]

export default function TopPillToggle() {
  const mode = useModeStore((state) => state.mode)
  const setMode = useModeStore((state) => state.setMode)

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
              onClick={() => setMode(option.id)}
              whileTap={TAP}
            >
              {active && (
                <motion.span
                  layoutId="top-pill-toggle-active"
                  className="top-pill-toggle__active-bg"
                  transition={SPRING.indicator}
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

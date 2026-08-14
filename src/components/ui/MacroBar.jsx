import { motion } from 'framer-motion'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { DURATION, EASE } from '../../lib/motion'
import './MacroBar.css'

const MACROS = [
  { key: 'protein', label: 'Protein', kcalPerGram: 4 },
  { key: 'carbs', label: 'Carbs', kcalPerGram: 4 },
  { key: 'fat', label: 'Fat', kcalPerGram: 9 },
]

const BAR_VIEWPORT = { once: true, amount: 0.5 }

/**
 * Colour-coded macro split for a diet plan.
 *
 * Segment widths are static percentages; the reveal is a single `scaleX` on the
 * track, so the bar eases open instead of jumping and never animates a layout
 * property.
 */
export default function MacroBar({ macros, className = '' }) {
  const [ref, inView] = useInViewOnce(BAR_VIEWPORT)

  const shares = MACROS.map((macro) => ({
    ...macro,
    grams: macros[macro.key] ?? 0,
    kcal: (macros[macro.key] ?? 0) * macro.kcalPerGram,
  }))
  const totalKcal = shares.reduce((sum, share) => sum + share.kcal, 0) || 1

  return (
    <div className={`macro-bar ${className}`.trim()} ref={ref}>
      <div className="macro-bar__track">
        <motion.div
          className="macro-bar__fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={{ duration: DURATION.section, ease: EASE.standard }}
        >
          {shares.map((share) => (
            <span
              key={share.key}
              className={`macro-bar__segment macro-bar__segment--${share.key}`}
              style={{ width: `${(share.kcal / totalKcal) * 100}%` }}
            />
          ))}
        </motion.div>
      </div>

      <ul className="macro-bar__legend">
        {shares.map((share) => (
          <li key={share.key}>
            <span className={`macro-bar__dot macro-bar__dot--${share.key}`} aria-hidden="true" />
            <span className="macro-bar__legend-label">{share.label}</span>
            <span className="macro-bar__legend-value">{share.grams}g</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

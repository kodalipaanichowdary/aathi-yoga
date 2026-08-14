import { AnimatePresence, motion } from 'framer-motion'
import { DURATION, EASE, SPRING } from '../../lib/motion'
import './QtyStepper.css'

export default function QtyStepper({ qty, onIncrement, onDecrement, min = 1 }) {
  return (
    <div className="qty-stepper">
      <motion.button
        type="button"
        onClick={onDecrement}
        disabled={qty <= min}
        whileTap={{ scale: 0.85 }}
        transition={SPRING.press}
        aria-label="Decrease quantity"
      >
        −
      </motion.button>

      {/* Keyed on the value so the number rolls through rather than snapping. */}
      <span className="qty-stepper__value">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={qty}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.tap, ease: EASE.standard }}
          >
            {qty}
          </motion.span>
        </AnimatePresence>
      </span>

      <motion.button
        type="button"
        onClick={onIncrement}
        whileTap={{ scale: 0.85 }}
        transition={SPRING.press}
        aria-label="Increase quantity"
      >
        +
      </motion.button>
    </div>
  )
}

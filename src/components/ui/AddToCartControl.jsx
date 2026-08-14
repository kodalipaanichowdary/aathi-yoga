import { AnimatePresence, motion } from 'framer-motion'
import QtyStepper from './QtyStepper'
import { DURATION, EASE, SPRING } from '../../lib/motion'
import './AddToCartControl.css'

const swap = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: DURATION.tap, ease: EASE.standard },
}

/**
 * The add-to-cart morph. One fixed-height slot that cross-dissolves through
 * button -> spinner -> checkmark -> quantity selector, driven by the phase from
 * useAddToCartSequence.
 *
 * The slot has a fixed height and its states are absolutely positioned, so the
 * whole sequence runs without shifting a single pixel of surrounding layout.
 */
export default function AddToCartControl({
  phase,
  onAdd,
  qty = 0,
  onIncrement,
  onDecrement,
  label = 'Add to Cart',
  className = '',
}) {
  const showStepper = phase === 'idle' && qty > 0
  const showButton = phase === 'idle' && qty === 0

  return (
    <div
      className={`add-cart ${className}`.trim()}
      onClick={(event) => event.stopPropagation()}
      role="presentation"
    >
      <AnimatePresence initial={false}>
        {showButton && (
          <motion.button
            key="add"
            type="button"
            className="add-cart__button"
            onClick={onAdd}
            variants={{ visible: { scale: 1 }, hover: { scale: 1.03 } }}
            whileTap={{ scale: 0.96 }}
            initial={swap.initial}
            animate={swap.animate}
            exit={swap.exit}
            transition={swap.transition}
          >
            {label}
          </motion.button>
        )}

        {phase === 'loading' && (
          <motion.span
            key="loading"
            className="add-cart__state"
            initial={swap.initial}
            animate={swap.animate}
            exit={swap.exit}
            transition={swap.transition}
          >
            <motion.span
              className="add-cart__spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
            />
          </motion.span>
        )}

        {phase === 'done' && (
          <motion.span
            key="done"
            className="add-cart__state add-cart__state--done"
            initial={swap.initial}
            animate={swap.animate}
            exit={swap.exit}
            transition={SPRING.press}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <motion.path
                d="M5 12.5l4.4 4.4L19 7.5"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: DURATION.hover, ease: EASE.standard }}
              />
            </svg>
          </motion.span>
        )}

        {showStepper && (
          <motion.div
            key="stepper"
            className="add-cart__stepper"
            initial={swap.initial}
            animate={swap.animate}
            exit={swap.exit}
            transition={SPRING.press}
          >
            <QtyStepper qty={qty} onIncrement={onIncrement} onDecrement={onDecrement} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

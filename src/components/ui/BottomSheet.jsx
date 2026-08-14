import { useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion'
import { DURATION, SPRING } from '../../lib/motion'
import './BottomSheet.css'

const CLOSE_OFFSET = 120
const CLOSE_VELOCITY = 800

export default function BottomSheet({ open, onClose, children, className = '' }) {
  const y = useMotionValue(0)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (open) y.set(0)
  }, [open, y])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  function handleDragEnd(_event, info) {
    if (info.offset.y > CLOSE_OFFSET || info.velocity.y > CLOSE_VELOCITY) {
      onClose()
    } else {
      animate(y, 0, SPRING.sheet)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="bottom-sheet__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.hover }}
            onClick={onClose}
          />
          <motion.div
            className={`bottom-sheet ${className}`.trim()}
            style={{ y }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING.sheet}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="bottom-sheet__handle" />
            <div className="bottom-sheet__body">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

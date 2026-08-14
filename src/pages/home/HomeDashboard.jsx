import { AnimatePresence, motion } from 'framer-motion'
import { useModeStore } from '../../store/useModeStore'
import { DURATION, EASE } from '../../lib/motion'
import YogaHome from './YogaHome'
import LifeHome from './LifeHome'

/**
 * The mode switch is a same-route morph, not a navigation: the outgoing persona
 * settles down and fades, the incoming one rises in and re-runs its own hero
 * choreography. Ambient colour is handled separately by [data-mode] on the app
 * shell, which cross-fades over the same window.
 */
export default function HomeDashboard() {
  const mode = useModeStore((state) => state.mode)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: DURATION.section, ease: EASE.emphasized },
        }}
        exit={{
          opacity: 0,
          y: -12,
          scale: 0.99,
          transition: { duration: DURATION.hover, ease: EASE.standard },
        }}
      >
        {mode === 'life' ? <LifeHome /> : <YogaHome />}
      </motion.div>
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASE } from '../lib/motion'
import './HeroBackdrop.css'

/**
 * Decorative hero atmosphere: two slow-drifting gradient blooms and a soft
 * sunlight wash.
 *
 * Everything here is deliberately restrained — it should register as depth, not
 * as animation. Three guards keep it cheap:
 *   1. every loop animates only transform/opacity;
 *   2. loops run only while the hero is actually on screen (`live`);
 *   3. prefers-reduced-motion renders the static composition with no loops.
 *
 * `inherit={false}` keeps this layer out of the hero's stagger orchestration so
 * the decorative elements don't consume entry slots meant for real content.
 */
export default function HeroBackdrop({ tone = 'yoga' }) {
  const reduceMotion = useReducedMotion()
  const [live, setLive] = useState(true)

  const animating = live && !reduceMotion

  return (
    <motion.div
      className={`hero-backdrop hero-backdrop--${tone}`}
      aria-hidden="true"
      inherit={false}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.hero, ease: EASE.emphasized }}
      viewport={{ once: false, amount: 0.05 }}
      onViewportEnter={() => setLive(true)}
      onViewportLeave={() => setLive(false)}
    >
      <motion.span
        className="hero-backdrop__bloom hero-backdrop__bloom--a"
        animate={animating ? { x: [0, 26, 0], y: [0, -14, 0], scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 18, repeat: Infinity, ease: EASE.inOut }}
      />
      <motion.span
        className="hero-backdrop__bloom hero-backdrop__bloom--b"
        animate={animating ? { x: [0, -22, 0], y: [0, 16, 0], scale: [1.06, 1, 1.06] } : {}}
        transition={{ duration: 22, repeat: Infinity, ease: EASE.inOut }}
      />

      <motion.span
        className="hero-backdrop__sunlight"
        animate={animating ? { opacity: [0.28, 0.5, 0.28], scale: [1, 1.12, 1] } : { opacity: 0.36 }}
        transition={{ duration: 12, repeat: Infinity, ease: EASE.inOut }}
      />
    </motion.div>
  )
}

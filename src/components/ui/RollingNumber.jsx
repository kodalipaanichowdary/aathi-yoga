import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { DURATION, EASE } from '../../lib/motion'

const defaultFormat = (value) => Math.round(value).toLocaleString('en-IN')

/**
 * A number that rolls to its new value instead of snapping to it. Used for cart
 * totals, item counts and prices.
 *
 * The tween runs on a MotionValue and writes straight to the text node, so a
 * counting animation never triggers a React re-render.
 */
export default function RollingNumber({ value, format = defaultFormat, className = '', prefix = '' }) {
  const reduceMotion = useReducedMotion()
  const raw = useMotionValue(value)
  const text = useTransform(raw, (current) => `${prefix}${format(current)}`)

  useEffect(() => {
    if (reduceMotion) {
      raw.set(value)
      return
    }
    const controls = animate(raw, value, { duration: DURATION.hover * 1.6, ease: EASE.standard })
    return () => controls.stop()
  }, [value, raw, reduceMotion])

  return <motion.span className={className}>{text}</motion.span>
}

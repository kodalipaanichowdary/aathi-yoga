import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { VIEWPORT } from '../lib/motion'

/**
 * Viewport gate for scroll reveals: returns a ref to attach and whether the
 * element has come into view.
 *
 * Why this instead of Framer's `whileInView`: in this build `whileInView` does
 * not render its `initial` state for elements that start out of view — they sit
 * at their natural (already-visible) styles and only get inline styles once the
 * observer fires, so the reveal never actually plays. Driving `animate` from
 * useInView keeps the same IntersectionObserver gating while going through the
 * `animate` path, which does honour the pre-animation state.
 */
export function useInViewOnce(options = VIEWPORT) {
  const ref = useRef(null)
  const inView = useInView(ref, options)
  return [ref, inView]
}

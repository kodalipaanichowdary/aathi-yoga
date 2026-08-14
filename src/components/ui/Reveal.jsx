import { motion, useReducedMotion } from 'framer-motion'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { REVEAL, STAGGER_ITEM } from '../../lib/motion'

/**
 * Viewport-gated scroll reveal. The element is observed once; when it enters the
 * viewport it plays the named variant from the shared motion system and is then
 * left alone, so a long scroll never re-runs animation work.
 *
 * Under prefers-reduced-motion the wrapper renders a plain element with no
 * animation attached at all — not a zero-duration animation.
 */
export default function Reveal({
  variant = 'fadeUp',
  as = 'div',
  className = '',
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInViewOnce()
  const Tag = motion[as] ?? motion.div

  if (reduceMotion) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref}
      className={className}
      variants={REVEAL[variant] ?? REVEAL.fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Child of a `variant="stagger"` Reveal. Inherits the parent's hidden/visible
 * state, so siblings arrive one after another on the shared 70ms cadence.
 */
export function RevealItem({ as = 'div', className = '', children, ...rest }) {
  const reduceMotion = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  if (reduceMotion) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag className={className} variants={STAGGER_ITEM} {...rest}>
      {children}
    </Tag>
  )
}

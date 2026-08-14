import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { STAGGER_ITEM } from '../../lib/motion'
import './ScrollSection.css'

/**
 * A titled page section that reveals itself when scrolled into view.
 *
 * `reveal` picks which variant from the shared motion system it uses — the
 * homepage deliberately assigns a different one per section so no two blocks
 * arrive the same way. `reveal="stagger"` makes the section a container: it
 * doesn't animate itself, its children come in one after another.
 */
export default function ScrollSection({ title, action, children, className = '', reveal = 'fadeUp' }) {
  const staggering = reveal === 'stagger'

  const header = title && (
    <div className="scroll-section__header">
      <h2>{title}</h2>
      {action}
    </div>
  )

  return (
    <Reveal as="section" variant={reveal} className={`scroll-section ${className}`.trim()}>
      {staggering && title ? (
        <motion.div variants={STAGGER_ITEM}>{header}</motion.div>
      ) : (
        header
      )}
      {children}
    </Reveal>
  )
}

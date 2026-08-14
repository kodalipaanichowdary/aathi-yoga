import { motion } from 'framer-motion'
import { SPRING, TAP } from '../../lib/motion'
import './Button.css'

export default function Button({ variant = 'primary', className = '', type = 'button', children, ...rest }) {
  return (
    <motion.button
      type={type}
      className={`btn btn--${variant} ${className}`.trim()}
      whileTap={TAP}
      transition={SPRING.press}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

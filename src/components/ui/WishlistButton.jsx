import { motion } from 'framer-motion'
import { useWishlistStore } from '../../store/useWishlistStore'
import { DURATION, EASE, SPRING, TAP_FIRM } from '../../lib/motion'
import './WishlistButton.css'

export default function WishlistButton({ productId, className = '', size = 30 }) {
  const saved = useWishlistStore((state) => state.ids.includes(productId))
  const toggle = useWishlistStore((state) => state.toggle)

  return (
    <motion.button
      type="button"
      className={`wishlist-btn ${saved ? 'wishlist-btn--on' : ''} ${className}`.trim()}
      style={{ width: size, height: size }}
      onClick={(event) => {
        event.stopPropagation()
        toggle(productId)
      }}
      whileTap={TAP_FIRM}
      animate={saved ? { scale: [1, 1.28, 1] } : { scale: 1 }}
      transition={saved ? { duration: DURATION.tap * 2, ease: EASE.standard } : SPRING.press}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7 3.2C19 15.4 12 20 12 20z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  )
}

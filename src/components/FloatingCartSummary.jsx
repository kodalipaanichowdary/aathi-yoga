import { AnimatePresence, motion } from 'framer-motion'
import RollingNumber from './ui/RollingNumber'
import { computeCartTotals, useCartStore } from '../store/useCartStore'
import { useUiStore } from '../store/useUiStore'
import { useScrollActivity } from '../hooks/useScrollActivity'
import { getProductById } from '../data/products'
import { DURATION, EASE, SPRING } from '../lib/motion'
import './FloatingCartSummary.css'

export default function FloatingCartSummary() {
  const items = useCartStore((state) => state.items)
  const openCartDrawer = useUiStore((state) => state.openCartDrawer)
  const scrolling = useScrollActivity()

  const lineItems = items
    .map((item) => ({ product: getProductById(item.id), qty: item.qty }))
    .filter((line) => line.product)

  const itemCount = lineItems.reduce((sum, line) => sum + line.qty, 0)
  const { grandTotal } = computeCartTotals(lineItems)

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          type="button"
          key="floating-cart"
          className={`floating-cart ${scrolling ? 'floating-cart--compact' : ''}`.trim()}
          onClick={openCartDrawer}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          // Shrinks out of the way while the page is moving, expands back the
          // moment scrolling stops.
          animate={{ opacity: scrolling ? 0.9 : 1, y: 0, scale: scrolling ? 0.94 : 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={SPRING.bar}
        >
          {/* Keyed on the count so every cart change re-triggers the bounce. */}
          <motion.span
            key={itemCount}
            className="floating-cart__count"
            initial={{ scale: 0.5 }}
            animate={{ scale: [1.35, 0.94, 1] }}
            transition={{ duration: DURATION.hover * 1.4, ease: EASE.standard }}
          >
            {itemCount}
          </motion.span>

          <span className="floating-cart__label">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>

          <span className="floating-cart__total">
            <RollingNumber value={grandTotal} prefix="&#8377;" />
          </span>

          <span className="floating-cart__cta">View Cart &rarr;</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

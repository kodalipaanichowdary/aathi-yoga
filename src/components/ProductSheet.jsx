import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomSheet from './ui/BottomSheet'
import Button from './ui/Button'
import QtyStepper from './ui/QtyStepper'
import RollingNumber from './ui/RollingNumber'
import ProductDetailContent from '../pages/store/ProductDetailContent'
import { useUiStore } from '../store/useUiStore'
import { useCartStore } from '../store/useCartStore'
import { useToast } from './ui/useToast'
import { useAddToCartSequence } from '../hooks/useAddToCartSequence'
import { getProductById } from '../data/products'
import { DURATION, EASE } from '../lib/motion'
import './ProductSheet.css'

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: DURATION.tap, ease: EASE.standard },
}

export default function ProductSheet() {
  const openProductId = useUiStore((state) => state.openProductId)
  const closeProduct = useUiStore((state) => state.closeProduct)
  const product = openProductId ? getProductById(openProductId) : null

  return (
    <BottomSheet open={Boolean(product)} onClose={closeProduct} className="product-sheet">
      {product && <ProductSheetContent key={product.id} product={product} onClose={closeProduct} />}
    </BottomSheet>
  )
}

function ProductSheetContent({ product, onClose }) {
  const openCartDrawer = useUiStore((state) => state.openCartDrawer)
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const showToast = useToast()
  const [qty, setQty] = useState(1)

  const cartLine = items.find((item) => item.id === product.id)

  const { phase, start, busy } = useAddToCartSequence(() => {
    for (let i = 0; i < qty; i += 1) addItem(product)
    showToast(`${qty > 1 ? `${qty} x ` : ''}${product.name} added to cart`, 'success')
  })

  function handleViewCart() {
    onClose()
    openCartDrawer()
  }

  return (
    <>
      <ProductDetailContent product={product} onClose={onClose} onCategoryLinkClick={onClose} />

      <div className="product-sheet__action-bar">
        {/* `busy` keeps the pre-add controls mounted through the morph, so the
            checkmark isn't cut short the instant the cart state changes. */}
        {cartLine && !busy ? (
          <>
            <QtyStepper
              qty={cartLine.qty}
              min={0}
              onIncrement={() => incrementItem(product.id)}
              onDecrement={() => decrementItem(product.id)}
            />
            <Button className="product-sheet__view-cart" onClick={handleViewCart}>
              View Cart
            </Button>
          </>
        ) : (
          <>
            <QtyStepper
              qty={qty}
              min={1}
              onIncrement={() => setQty((current) => current + 1)}
              onDecrement={() => setQty((current) => Math.max(1, current - 1))}
            />
            <Button className="product-sheet__add" onClick={start} disabled={busy}>
              <AnimatePresence mode="wait" initial={false}>
                {phase === 'idle' && (
                  <motion.span key="label" className="product-sheet__add-label" {...swap}>
                    Add to Cart &middot; <RollingNumber value={product.price * qty} prefix="&#8377;" />
                  </motion.span>
                )}
                {phase === 'loading' && (
                  <motion.span key="loading" className="product-sheet__add-label" {...swap}>
                    <motion.span
                      className="product-sheet__spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.span>
                )}
                {phase === 'done' && (
                  <motion.span key="done" className="product-sheet__add-label" {...swap}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <motion.path
                        d="M5 12.5l4.4 4.4L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: DURATION.hover, ease: EASE.standard }}
                      />
                    </svg>
                    Added to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </>
        )}
      </div>
    </>
  )
}

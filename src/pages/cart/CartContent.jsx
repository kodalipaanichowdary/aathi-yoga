import { AnimatePresence, motion } from 'framer-motion'
import ProductImage from '../../components/ProductImage'
import PriceTag from '../../components/ui/PriceTag'
import QtyStepper from '../../components/ui/QtyStepper'
import Button from '../../components/ui/Button'
import RollingNumber from '../../components/ui/RollingNumber'
import { computeCartTotals, useCartStore } from '../../store/useCartStore'
import { useUiStore } from '../../store/useUiStore'
import { getProductById } from '../../data/products'
import { DURATION, EASE, SPRING } from '../../lib/motion'
import './CartContent.css'

export default function CartContent({ onNavigateAway, onCheckout, onBrowseProducts }) {
  const items = useCartStore((state) => state.items)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const openProduct = useUiStore((state) => state.openProduct)

  const lineItems = items
    .map((item) => ({ product: getProductById(item.id), qty: item.qty }))
    .filter((line) => line.product)

  const totals = computeCartTotals(lineItems)
  const totalCount = lineItems.reduce((sum, line) => sum + line.qty, 0)

  function handleClearCart() {
    if (window.confirm('Remove all items from your cart?')) {
      clearCart()
    }
  }

  function handleSelectProduct(id) {
    onNavigateAway?.()
    openProduct(id)
  }

  if (lineItems.length === 0) {
    return (
      <div className="cart-content cart-content--empty">
        <motion.span
          className="cart-content__empty-icon"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING.sheet}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" />
          </svg>
        </motion.span>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Button
          onClick={() => {
            onNavigateAway?.()
            onBrowseProducts()
          }}
        >
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="cart-content">
      <div className="cart-content__title">
        <h1>My Cart</h1>
        <span>
          {totalCount} item{totalCount !== 1 ? 's' : ''}
        </span>
      </div>

      <ul className="cart-content__list">
        {/* Removing a line slides it out and lets the rest close the gap. */}
        <AnimatePresence initial={false}>
          {lineItems.map(({ product, qty }) => (
            <motion.li
              key={product.id}
              className="cart-item"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // Transform + opacity only; `layout` closes the gap with a
              // projection transform rather than animating height.
              exit={{ opacity: 0, x: -28, scale: 0.96 }}
              transition={{ duration: DURATION.hover, ease: EASE.standard }}
            >
              <button
                type="button"
                className="cart-item__image-link"
                onClick={() => handleSelectProduct(product.id)}
                aria-label={`View ${product.name}`}
              >
                <ProductImage icon={product.icon} images={product.images} alt={product.name} className="cart-item__image" baseSize={26} />
              </button>

              <div className="cart-item__details">
                <button type="button" className="cart-item__name" onClick={() => handleSelectProduct(product.id)}>
                  {product.name}
                </button>
                <PriceTag price={product.price} originalPrice={product.originalPrice} />
              </div>

              <div className="cart-item__side">
                <span className="cart-item__line-total">
                  <RollingNumber value={product.price * qty} prefix="&#8377;" />
                </span>
                <QtyStepper
                  qty={qty}
                  onIncrement={() => incrementItem(product.id)}
                  onDecrement={() => decrementItem(product.id)}
                />
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeItem(product.id)}
                  aria-label={`Remove ${product.name} from cart`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Remove
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="cart-content__summary">
        <div className="cart-content__row">
          <span>Sub Total</span>
          <RollingNumber value={totals.subTotal} prefix="&#8377;" />
        </div>
        {totals.discount > 0 && (
          <div className="cart-content__row cart-content__row--discount">
            <span>Discount</span>
            <span>
              &minus;<RollingNumber value={totals.discount} prefix="&#8377;" />
            </span>
          </div>
        )}
        <div className="cart-content__row">
          <span>Delivery Charge</span>
          <RollingNumber value={totals.deliveryCharge} prefix="&#8377;" />
        </div>
        <div className="cart-content__row">
          <span>Tax</span>
          <RollingNumber value={totals.tax} prefix="&#8377;" />
        </div>
        <div className="cart-content__row cart-content__row--total">
          <span>Total</span>
          <RollingNumber value={totals.grandTotal} prefix="&#8377;" />
        </div>

        <Button
          onClick={() => {
            onNavigateAway?.()
            onCheckout()
          }}
        >
          Checkout
        </Button>
        <button type="button" className="cart-content__clear" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import ProductImage from './ProductImage'
import RatingStars from './ui/RatingStars'
import PriceTag from './ui/PriceTag'
import WishlistButton from './ui/WishlistButton'
import AddToCartControl from './ui/AddToCartControl'
import { useCartStore } from '../store/useCartStore'
import { useUiStore } from '../store/useUiStore'
import { useToast } from './ui/useToast'
import { useAddToCartSequence } from '../hooks/useAddToCartSequence'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { DURATION, EASE, SPRING, STAGGER, VIEWPORT_LIVE } from '../lib/motion'
import './ProductCard.css'

const hoverTransition = { duration: DURATION.hover, ease: EASE.standard }

/** Caps the stagger so a long grid's last card isn't waiting seconds to appear. */
const STAGGER_CYCLE = 5

/**
 * Hover is expressed as a variant rather than a `whileHover` object so the label
 * propagates to the card's direct children — the image and the price react to
 * the same single gesture instead of each tracking hover state separately.
 *
 * Entry is gated per card rather than inherited from the row: in this version of
 * Framer Motion a variant label only propagates to *direct* motion children, and
 * cards sit inside a plain row/grid `div`, so inheritance never reached them.
 * `index` supplies the stagger the container would otherwise have provided.
 */
function cardVariants(index) {
  return {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.section,
        ease: EASE.standard,
        delay: (index % STAGGER_CYCLE) * STAGGER,
      },
    },
    hover: { y: -12, transition: hoverTransition },
  }
}

const MEDIA_VARIANTS = {
  visible: { scale: 1, transition: hoverTransition },
  hover: { scale: 1.05, transition: hoverTransition },
}

const PRICE_VARIANTS = {
  visible: { scale: 1, transition: hoverTransition },
  hover: { scale: 1.05, transition: hoverTransition },
}

/** Stable per-product offset so the shine sweeps don't all fire in unison. */
function shineDelay(id) {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 1000
  return `${(hash / 1000) * 6}s`
}

export default function ProductCard({ product, index = 0 }) {
  const openProduct = useUiStore((state) => state.openProduct)
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const showToast = useToast()

  // Two gates, deliberately: entry plays once (`revealed`), while the looping
  // shine sweep tracks visibility continuously (`live`) so cards scrolled off
  // screen — or parked off the side of a horizontal row — animate nothing.
  const [revealRef, revealed] = useInViewOnce()
  const [liveRef, live] = useInViewOnce(VIEWPORT_LIVE)

  const cartLine = items.find((item) => item.id === product.id)
  const { phase, start } = useAddToCartSequence(() => {
    addItem(product)
    showToast(`${product.name} added to cart`, 'success')
  })

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  return (
    <motion.article
      ref={revealRef}
      className={`product-card ${live ? 'product-card--live' : ''}`.trim()}
      variants={cardVariants(index)}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      onClick={() => openProduct(product.id)}
    >
      <div className="product-card__media" ref={liveRef}>
        <motion.div className="product-card__media-inner" variants={MEDIA_VARIANTS}>
          <ProductImage icon={product.icon} images={product.images} alt={product.name} className="product-card__image" />
        </motion.div>

        <span className="product-card__scrim" aria-hidden="true" />
        <span className="product-card__shine" style={{ animationDelay: shineDelay(product.id) }} aria-hidden="true" />

        {/* Badges pop in with the card rather than being present from frame one. */}
        {discountPercent > 0 && (
          <motion.span
            className="product-card__ribbon"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={revealed ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            transition={{ ...SPRING.press, delay: revealed ? 0.12 : 0 }}
          >
            {discountPercent}% <small>OFF</small>
          </motion.span>
        )}

        <WishlistButton productId={product.id} className="product-card__wishlist" />

        <button
          type="button"
          className="product-card__quick-view"
          onClick={(event) => {
            event.stopPropagation()
            openProduct(product.id)
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          <span>Quick view</span>
        </button>

        {product.stock === 'low' && (
          <motion.span
            className="product-card__stock"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={revealed ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            transition={{ ...SPRING.press, delay: revealed ? 0.18 : 0 }}
          >
            Only {product.stockLeft} left
          </motion.span>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.shortDesc}</p>

        <div className="product-card__meta">
          <span className="product-card__rating-chip">
            <RatingStars rating={product.rating} count={product.ratingCount} />
          </span>
          <span className="product-card__weight">{product.meta}</span>
        </div>

        <span className="product-card__delivery">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM6 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          {product.delivery}
        </span>

        <motion.div className="product-card__price" variants={PRICE_VARIANTS}>
          <PriceTag price={product.price} originalPrice={product.originalPrice} />
        </motion.div>

        <AddToCartControl
          phase={phase}
          onAdd={start}
          qty={cartLine?.qty ?? 0}
          onIncrement={() => incrementItem(product.id)}
          onDecrement={() => decrementItem(product.id)}
        />
      </div>
    </motion.article>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGallery from '../../components/ProductGallery'
import RatingStars from '../../components/ui/RatingStars'
import PriceTag from '../../components/ui/PriceTag'
import WishlistButton from '../../components/ui/WishlistButton'
import { useToast } from '../../components/ui/useToast'
import { getCategory } from '../../data/products'
import { REVEAL, SPRING, STAGGER_ITEM, TAP } from '../../lib/motion'
import './ProductDetail.css'

const HIGHLIGHTS_BY_ICON = {
  mat: [
    'High-density surface grips the floor to keep every pose stable',
    'Perfect for daily vinyasa, hatha, or restorative practice',
    'Wipe down with a damp cloth and air dry after each session',
    'Rolls up easily for storage or travel',
  ],
  bag: [
    'Crafted for everyday devotional and practice routines',
    'Designed to make carrying, storing or using your essentials effortless',
    'Wipe clean or spot wash as needed',
    'Fits comfortably alongside your other practice or puja items',
  ],
  bracelet: [
    'Genuine beads strung on a durable, skin-friendly cord',
    'Worn daily for its calming and protective energy',
    'Avoid water, perfume and harsh chemicals to preserve the beads',
    'Adjustable stretch fit suits most wrist sizes',
  ],
  mala: [
    'Hand-strung 108-bead mala for japa and mantra meditation',
    'Ideal for daily chanting, meditation, or wearing as a necklace',
    'Store in a soft pouch away from direct sunlight and moisture',
    'Natural material develops a deeper patina with regular use',
  ],
  ring: [
    'Traditional design crafted for daily or ceremonial wear',
    'Worn on the recommended finger for its intended benefit',
    'Polish gently with a soft cloth; avoid harsh cleaning agents',
    'Available in adjustable sizing for a comfortable fit',
  ],
  rudraksha: [
    'Authentic rudraksha beads sourced and strung by hand',
    'Traditionally worn for focus, calm and spiritual grounding',
    'Keep away from water and chemicals to preserve the beads',
    'Elastic fit adjusts comfortably to most wrist sizes',
  ],
  idol: [
    'Cast in detailed metalwork for home or office worship',
    'Ideal for daily puja, gifting, or festive home decor',
    'Clean gently with a dry or lightly damp soft cloth',
    'Comes with a stable base for secure placement',
  ],
  pendant: [
    'Finely detailed pendant on a durable chain',
    'Worn daily as a symbol of faith and protection',
    'Avoid water and perfume contact to preserve the finish',
    'Chain length suits most necklines; layer with other pieces',
  ],
  tulasi: [
    'Made from sacred tulsi wood, cherished in daily worship',
    'Traditionally worn for chanting, meditation, or spiritual protection',
    'Keep dry and store away from direct sunlight',
    'Beads deepen in color naturally with regular wear',
  ],
}

export default function ProductDetailContent({ product, onClose, onCategoryLinkClick }) {
  const showToast = useToast()
  const category = getCategory(product.category)
  const highlights = HIGHLIGHTS_BY_ICON[product.icon] ?? HIGHLIGHTS_BY_ICON.bag
  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  async function handleShare() {
    const url = `${window.location.origin}/product/${product.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.shortDesc, url })
        return
      }
      await navigator.clipboard.writeText(url)
      showToast('Product link copied to clipboard', 'success')
    } catch (error) {
      // A user dismissing the native share sheet isn't a failure worth surfacing.
      if (error?.name === 'AbortError') return
      showToast('Sharing is not available on this device', 'info')
    }
  }

  return (
    <>
      <div className="product-detail__hero">
        {onClose && (
          <motion.button
            type="button"
            className="product-detail__close"
            onClick={onClose}
            whileTap={TAP}
            transition={SPRING.press}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>
        )}

        <div className="product-detail__hero-actions">
          <WishlistButton productId={product.id} size={34} />
          <motion.button
            type="button"
            className="product-detail__share"
            onClick={handleShare}
            whileTap={TAP}
            transition={SPRING.press}
            aria-label="Share this product"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3v11M12 3l-3.6 3.6M12 3l3.6 3.6M5 14v5.5h14V14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>

        <ProductGallery icon={product.icon} images={product.images} alt={product.name} discountPercent={discountPercent} />
      </div>

      <div className="product-detail__body">
        <h1 className="product-detail__name">{product.name}</h1>
        <p className="product-detail__desc">{product.shortDesc}</p>

        <div className="product-detail__meta-row">
          <RatingStars rating={product.rating} count={product.ratingCount} />
          <span className="product-detail__meta">{product.meta}</span>
        </div>

        <PriceTag price={product.price} originalPrice={product.originalPrice} />

        {category && (
          <Link to={`/store/${category.slug}`} onClick={onCategoryLinkClick} className="product-detail__category-link">
            View all {category.label} products &rarr;
          </Link>
        )}

        <div className="product-detail__delivery">
          <DeliveryRow
            title={product.delivery}
            detail="Dispatched from the nearest Aathi warehouse"
            icon={
              <path
                d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM6 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            }
          />
          <DeliveryRow
            title={product.stock === 'low' ? `Low stock — only ${product.stockLeft} left` : 'In stock'}
            detail={product.stock === 'low' ? 'Order soon to avoid a restock wait' : 'Ships within 24 hours'}
            tone={product.stock === 'low' ? 'warn' : 'ok'}
            icon={
              <>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            }
          />
          <DeliveryRow
            title="No return or replacement"
            detail="Blessed and handcrafted items are final sale once dispatched"
            icon={
              <>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            }
          />
        </div>

        <div className="product-detail__highlights">
          <h2>Highlights</h2>
          {/* Highlights arrive one line at a time rather than as a block of text. */}
          <motion.ul variants={REVEAL.stagger} initial="hidden" animate="visible">
            {highlights.map((point) => (
              <motion.li key={point} variants={STAGGER_ITEM}>
                {point}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </>
  )
}

function DeliveryRow({ icon, title, detail, tone = 'neutral' }) {
  return (
    <div className={`product-detail__delivery-row product-detail__delivery-row--${tone}`}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {icon}
      </svg>
      <span>
        <strong>{title}</strong>
        <em>{detail}</em>
      </span>
    </div>
  )
}

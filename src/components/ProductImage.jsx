import CategoryIcon from './icons/CategoryIcon'
import { PRODUCT_VIEWS, PRODUCT_VIEW_ICON_SCALE } from './productViews'
import './ProductImage.css'

/**
 * Product artwork. When `images` (real photos scraped from aathilife.com) are
 * available, `view` picks one from the set so the gallery pages through
 * distinct photos rather than one image reused three times. Products with no
 * scraped photos for their category fall back to the category glyph on a
 * tinted field, same as before.
 */
export default function ProductImage({ icon, images, view = 'front', className = '', baseSize = 36, alt = '' }) {
  if (images && images.length > 0) {
    const viewIndex = Math.max(0, PRODUCT_VIEWS.findIndex((candidate) => candidate.id === view))
    const photo = images[viewIndex % images.length]
    return (
      <div className={`product-image product-image--${view} ${className}`.trim()}>
        <img src={photo} alt={alt} className="product-image__photo" loading="lazy" />
      </div>
    )
  }

  const scale = PRODUCT_VIEW_ICON_SCALE[view] ?? 1

  return (
    <div className={`product-image product-image--${view} ${className}`.trim()}>
      <CategoryIcon name={icon} size={Math.round(baseSize * scale)} />
    </div>
  )
}

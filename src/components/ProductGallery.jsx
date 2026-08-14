import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductImage from './ProductImage'
import { PRODUCT_VIEWS } from './productViews'
import { DURATION, EASE, SPRING, TAP, slideVariants } from '../lib/motion'
import './ProductGallery.css'

const SWIPE_THRESHOLD = 50
const variants = slideVariants(70)

/**
 * Paged product gallery. Swipe, arrows or dots move between the three framings
 * ProductImage can render, one at a time and in the direction you travelled.
 */
export default function ProductGallery({ icon, images, alt = '', discountPercent = 0 }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  function go(step) {
    setDirection(step)
    setIndex((current) => (current + step + PRODUCT_VIEWS.length) % PRODUCT_VIEWS.length)
  }

  function jumpTo(next) {
    if (next === index) return
    setDirection(next > index ? 1 : -1)
    setIndex(next)
  }

  const view = PRODUCT_VIEWS[index]

  return (
    <div className="product-gallery">
      <div className="product-gallery__frame">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={view.id}
            className="product-gallery__slide"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: DURATION.hover, ease: EASE.standard }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_event, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) go(1)
              else if (info.offset.x > SWIPE_THRESHOLD) go(-1)
            }}
          >
            <ProductImage icon={icon} images={images} alt={alt} view={view.id} className="product-gallery__image" baseSize={54} />
          </motion.div>
        </AnimatePresence>

        {discountPercent > 0 && <span className="product-gallery__badge">{discountPercent}% OFF</span>}

        <motion.button
          type="button"
          className="product-gallery__arrow product-gallery__arrow--prev"
          onClick={() => go(-1)}
          whileTap={TAP}
          transition={SPRING.press}
          aria-label="Previous image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
        <motion.button
          type="button"
          className="product-gallery__arrow product-gallery__arrow--next"
          onClick={() => go(1)}
          whileTap={TAP}
          transition={SPRING.press}
          aria-label="Next image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <div className="product-gallery__dots">
        {PRODUCT_VIEWS.map((option, optionIndex) => (
          <button
            key={option.id}
            type="button"
            className={`product-gallery__dot ${optionIndex === index ? 'product-gallery__dot--active' : ''}`.trim()}
            onClick={() => jumpTo(optionIndex)}
            aria-label={`Show ${option.label} view`}
            aria-current={optionIndex === index}
          />
        ))}
      </div>
    </div>
  )
}

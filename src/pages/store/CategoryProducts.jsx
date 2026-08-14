import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageHeader from '../../components/layout/PageHeader'
import ProductCard from '../../components/ProductCard'
import { CATEGORIES, PRODUCTS, getCategory, getProductsByCategory } from '../../data/products'
import { DURATION, EASE, REVEAL, SPRING, TAP } from '../../lib/motion'
import './CategoryProducts.css'

const ALL_SLUG = 'all'

const SEARCH_PROMPTS = ['Search Bracelets', 'Search Mala', 'Search Rudraksha', 'Search Idols']

export default function CategoryProducts() {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const activeCategory = categorySlug ? getCategory(categorySlug) : null
  const activeSlug = activeCategory ? activeCategory.slug : ALL_SLUG

  const products = useMemo(() => {
    const base = activeCategory ? getProductsByCategory(activeCategory.slug) : PRODUCTS
    const query = search.trim().toLowerCase()
    if (!query) return base
    return base.filter((product) => product.name.toLowerCase().includes(query))
  }, [activeCategory, search])

  function handlePillClick(slug) {
    navigate(slug === ALL_SLUG ? '/store' : `/store/${slug}`)
  }

  return (
    <div className="category-products">
      <PageHeader
        searchValue={search}
        onSearchChange={setSearch}
        searchPrompts={SEARCH_PROMPTS}
        searchTags={CATEGORIES.slice(0, 4).map((category) => category.label)}
      />

      <div className="category-products__pills">
        <CategoryPill
          label="All Items"
          active={activeSlug === ALL_SLUG}
          onClick={() => handlePillClick(ALL_SLUG)}
        />
        {CATEGORIES.map((category) => (
          <CategoryPill
            key={category.slug}
            label={category.label}
            active={activeSlug === category.slug}
            onClick={() => handlePillClick(category.slug)}
          />
        ))}
      </div>

      <div className="category-products__heading">
        <h2>{activeCategory ? activeCategory.label : 'All Products'}</h2>
        <span>{products.length} items</span>
      </div>

      {/*
        Keyed on the category only — not on the search text — so switching
        category animates the old grid out and staggers the new one in, while
        typing filters in place without re-running the whole entry.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlug}
          variants={REVEAL.stagger}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, x: -18, transition: { duration: DURATION.tap, ease: EASE.standard } }}
        >
          {products.length === 0 ? (
            <p className="category-products__empty">No products match. Try a different search or category.</p>
          ) : (
            <div className="category-products__grid">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CategoryPill({ label, active, onClick }) {
  return (
    <motion.button
      type="button"
      className={`category-products__pill ${active ? 'category-products__pill--active' : ''}`.trim()}
      onClick={onClick}
      whileTap={TAP}
    >
      {active && (
        <motion.span
          layoutId="category-pill-active"
          className="category-products__pill-bg"
          transition={SPRING.indicator}
        />
      )}
      <span className="category-products__pill-label">{label}</span>
    </motion.button>
  )
}

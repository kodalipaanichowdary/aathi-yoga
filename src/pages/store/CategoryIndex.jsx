import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../../components/layout/PageHeader'
import CategoryIcon from '../../components/icons/CategoryIcon'
import Reveal from '../../components/ui/Reveal'
import { CATEGORIES, getProductsByCategory } from '../../data/products'
import { DURATION, EASE, STAGGER_ITEM } from '../../lib/motion'
import './CategoryIndex.css'

const hoverTransition = { duration: DURATION.hover, ease: EASE.standard }

const TILE_VARIANTS = {
  hidden: STAGGER_ITEM.hidden,
  visible: STAGGER_ITEM.visible,
  hover: { y: -6, transition: hoverTransition },
}

const ICON_VARIANTS = {
  visible: { scale: 1, rotate: 0, transition: hoverTransition },
  hover: { scale: 1.1, rotate: 5, transition: hoverTransition },
}

export default function CategoryIndex() {
  const navigate = useNavigate()

  return (
    <div className="category-index">
      <PageHeader />

      <div className="category-index__intro">
        <h1>Shop by Category</h1>
        <p>Everything you need for your practice, organized just for you.</p>
      </div>

      <Reveal variant="stagger" className="category-index__grid">
        {CATEGORIES.map((category) => {
          const count = getProductsByCategory(category.slug).length
          return (
            <motion.button
              key={category.slug}
              type="button"
              className="category-tile"
              variants={TILE_VARIANTS}
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/store/${category.slug}`)}
            >
              <motion.div className="category-tile__media" variants={ICON_VARIANTS}>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.label}
                    className="category-tile__img"
                    loading="lazy"
                  />
                ) : (
                  <span className="category-tile__icon">
                    <CategoryIcon name={category.icon} size={26} />
                  </span>
                )}
              </motion.div>
              <span className="category-tile__label">{category.label}</span>
              <span className="category-tile__count">{count} items</span>
            </motion.button>
          )
        })}
      </Reveal>
    </div>
  )
}

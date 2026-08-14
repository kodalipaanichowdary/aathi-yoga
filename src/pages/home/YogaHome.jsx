import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../../components/layout/PageHeader'
import HeroBackdrop from '../../components/HeroBackdrop'
import ScrollSection from '../../components/ui/ScrollSection'
import ProductCard from '../../components/ProductCard'
import CategoryIcon from '../../components/icons/CategoryIcon'
import { CATEGORIES, getProductsByTag, getProductsByCategory } from '../../data/products'
import { MEMBERSHIP_PLANS } from '../../data/membership'
import { COACHES } from '../../data/coaches'
import CoachShowcaseCarousel from '../coaching/CoachShowcaseCarousel'
import { DIET_PLANS } from '../../data/dietPlans'
import { DURATION, EASE, HERO_ITEM, HERO_SEQUENCE, SPRING, TAP_FIRM } from '../../lib/motion'
import './YogaHome.css'

const PRODUCT_SECTIONS = [
  { title: 'Featured', type: 'tag', value: 'featured' },
  { title: 'Trending', type: 'tag', value: 'trending' },
  { title: 'Popular', type: 'tag', value: 'popular' },
  { title: 'Recently Added', type: 'tag', value: 'recently-added' },
  { title: 'Accessories', type: 'category', value: 'accessories' },
  { title: 'Recommended', type: 'tag', value: 'recommended' },
]

const SEARCH_PROMPTS = [
  'Search Rudraksha',
  'Search Meditation',
  'Search Diet Plans',
  'Search Coaching',
]

const SEARCH_TAGS = ['Bracelets', 'Mala', 'Meditation', 'Metal Idols']

/** "Categories -> slide" from the reveal table, expressed as a hero-entry item. */
const CATEGORY_SHELF_ITEM = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.hero, ease: EASE.emphasized } },
}

export default function YogaHome() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <div className="yoga-home">
      {/*
        Single orchestrator for the whole above-the-fold entry. Children with
        variants arrive in document order on the shared 70ms cadence:
        logo -> greeting -> search -> categories -> CTA cards. Products below
        take over with their own in-view stagger.
      */}
      <motion.div className="yoga-home__intro" variants={HERO_SEQUENCE} initial="hidden" animate="visible">
        <div className="yoga-home__hero-wrap">
          <div className="yoga-home__hero">
            <PageHeader
              brand
              brandLabel="Aathi Yoga"
              searchValue={search}
              onSearchChange={setSearch}
              onSearchSubmit={() => navigate('/store')}
              searchPrompts={SEARCH_PROMPTS}
              searchTags={SEARCH_TAGS}
            />
          </div>

          <motion.div className="yoga-home__categories-card" variants={CATEGORY_SHELF_ITEM}>
            <div className="yoga-home__categories">
              <CategoryChip label="All Items" icon="all" accent onClick={() => navigate('/store')} />
              {CATEGORIES.map((category) => (
                <CategoryChip
                  key={category.slug}
                  label={category.label}
                  icon={category.icon}
                  image={category.image}
                  onClick={() => navigate(`/store/${category.slug}`)}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="yoga-home__quick-actions" variants={HERO_ITEM}>
          <motion.button
            type="button"
            className="yoga-home__quick-shop"
            whileHover={{ y: -3 }}
            whileTap={TAP_FIRM}
            onClick={() => navigate('/categories')}
          >
            <span className="yoga-home__quick-title">Shop the Store</span>
            <span>Malas, bracelets, idols &amp; more</span>
          </motion.button>
          <motion.button
            type="button"
            className="yoga-home__quick-courses"
            whileHover={{ y: -3 }}
            whileTap={TAP_FIRM}
            onClick={() => navigate('/courses')}
          >
            <span className="yoga-home__quick-title">Explore Courses</span>
            <span>Guided flows for every level</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {PRODUCT_SECTIONS.map(({ title, type, value }) => {
        const products = type === 'category' ? getProductsByCategory(value) : getProductsByTag(value)
        if (products.length === 0) return null
        return (
          <ScrollSection
            key={title}
            title={title}
            action={
              <button
                type="button"
                onClick={() => navigate(type === 'category' ? `/store/${value}` : '/store')}
              >
                See All
              </button>
            }
          >
            <div className="scroll-section__row">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </ScrollSection>
        )
      })}

      <ScrollSection title="Coaching" reveal="blur">
        <p className="yoga-home__coaching-lead">
          Connect with certified yoga and meditation guides for 1-on-1 sessions.
        </p>
        <CoachShowcaseCarousel
          coaches={COACHES}
        />
      </ScrollSection>

      <ScrollSection title="Personalised Diet Plans" reveal="scale">
        <div className="yoga-home__promo-row">
          {DIET_PLANS.map((plan) => (
            <motion.button
              key={plan.id}
              type="button"
              className="yoga-home__promo-card"
              onClick={() => navigate('/diet')}
              whileHover={{ y: -3 }}
              whileTap={TAP_FIRM}
              transition={{ duration: DURATION.hover, ease: EASE.standard }}
            >
              <strong>{plan.name}</strong>
              <span>{plan.calories}</span>
            </motion.button>
          ))}
        </div>
      </ScrollSection>

      <ScrollSection title="Need Help?" reveal="blur">
        <motion.button
          type="button"
          className="yoga-home__support-banner"
          onClick={() => navigate('/support')}
          whileHover={{ y: -3 }}
          whileTap={TAP_FIRM}
          transition={{ duration: DURATION.hover, ease: EASE.standard }}
        >
          <span>Have a question about your order, a course, or your membership?</span>
          <span className="yoga-home__support-cta">Contact Support →</span>
        </motion.button>
      </ScrollSection>
    </div>
  )
}

function CategoryChip({ label, icon, image, accent = false, onClick }) {
  return (
    <motion.button
      type="button"
      className="yoga-home__category-chip"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={SPRING.press}
    >
      <span
        className={`yoga-home__category-icon ${accent ? 'yoga-home__category-icon--all' : ''}`.trim()}
      >
        {image ? (
          <img src={image} alt={label} className="yoga-home__category-img" />
        ) : (
          <CategoryIcon name={icon} size={22} />
        )}
      </span>
      <span className="yoga-home__category-label">{label}</span>
    </motion.button>
  )
}

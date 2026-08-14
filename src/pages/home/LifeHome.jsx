import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../../components/layout/PageHeader'
import ScrollSection from '../../components/ui/ScrollSection'
import PoseIllustration from '../../components/icons/PoseIllustration'
import Button from '../../components/ui/Button'
import { useUiStore } from '../../store/useUiStore'
import { COURSES } from '../../data/courses'
import { ARTICLES } from '../../data/articles'
import { MEDITATION_SESSION } from '../../data/meditation'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { DURATION, EASE, HERO_SEQUENCE, STAGGER, TAP_FIRM } from '../../lib/motion'
import './LifeHome.css'

const FREE_CLASSES = COURSES.slice(0, 5)

/** Life mode's prompts are about practice, not products. */
const SEARCH_PROMPTS = [
  'Search Meditation',
  'Search Breathwork',
  'Search Beginner Flow',
  'Search Articles',
]

const SEARCH_TAGS = ['Meditation', 'Breathwork', 'Beginner', 'Balance']

const cardHover = { duration: DURATION.hover, ease: EASE.standard }

export default function LifeHome() {
  const navigate = useNavigate()
  const openArticle = useUiStore((state) => state.openArticle)
  const [search, setSearch] = useState('')

  return (
    <div className="life-home">
      <motion.div className="life-home__intro" variants={HERO_SEQUENCE} initial="hidden" animate="visible">
        <div className="life-home__hero-wrap">
          <div className="life-home__hero">
            <PageHeader
              brand
              brandLabel="Aathi Life"
              searchValue={search}
              onSearchChange={setSearch}
              onSearchSubmit={() => navigate('/courses')}
              searchPrompts={SEARCH_PROMPTS}
              searchTags={SEARCH_TAGS}
            />
          </div>
        </div>
      </motion.div>

      {/* Free Yoga Class Banner from user reference image */}
      <motion.div
        className="life-free-banner"
        onClick={() => navigate('/courses')}
        whileHover={{ scale: 1.02 }}
        whileTap={TAP_FIRM}
      >
        <div className="life-free-banner__mandala" aria-hidden="true" />
        <h2>Free yoga class</h2>
      </motion.div>

      {/* Memberships Section from user reference image */}
      <section className="life-home__section">
        <div className="life-home__section-header">
          <h2>Memberships</h2>
          <button type="button" className="life-home__see-all" onClick={() => navigate('/membership')}>
            See All
          </button>
        </div>

        <div className="life-home__memberships-list">
          <motion.div
            className="life-membership-item-card"
            onClick={() => navigate('/membership')}
            whileHover={{ y: -3 }}
            whileTap={TAP_FIRM}
          >
            <div className="life-membership-item-card__img-wrap">
              <img
                src="/assets/coaches/vikram-nair.jpg"
                alt="Group class"
                className="life-membership-item-card__img"
              />
            </div>
            <div className="life-membership-item-card__content">
              <h3>Group class</h3>
              <p>we will be covering 17 asanas 3 pranayamas, Kriya and relaxation techniques.</p>
              <div className="life-membership-item-card__divider" />
              <div className="life-membership-item-card__price-row">
                <strong>&#8377;1800 / month</strong>
                <span>Onwards</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="life-membership-item-card"
            onClick={() => navigate('/membership')}
            whileHover={{ y: -3 }}
            whileTap={TAP_FIRM}
          >
            <div className="life-membership-item-card__img-wrap">
              <img
                src="/assets/coaches/ananya-rao.jpg"
                alt="One on one training"
                className="life-membership-item-card__img"
              />
            </div>
            <div className="life-membership-item-card__content">
              <h3>One on one training</h3>
              <p>In one-on-one classes, the focus is on addressing individual mental and physical health needs</p>
              <div className="life-membership-item-card__divider" />
              <div className="life-membership-item-card__price-row">
                <strong>&#8377;8500 / month</strong>
                <span>Onwards</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Yoga Articles Section from user reference image */}
      <section className="life-home__section">
        <div className="life-home__section-header">
          <h2>Yoga Articles</h2>
          <button type="button" className="life-home__see-all" onClick={() => openArticle(ARTICLES[0].id)}>
            See All
          </button>
        </div>

        <div className="scroll-section__row life-home__articles-row">
          {ARTICLES.map((article, index) => (
            <LifeArticleCard
              key={article.id}
              article={article}
              index={index}
              onOpen={() => openArticle(article.id)}
            />
          ))}
        </div>
      </section>

      {/* Free Yoga Classes Carousel */}
      <ScrollSection
        title="Free Yoga Classes"
        reveal="stagger"
        action={
          <button type="button" onClick={() => navigate('/courses')}>
            See All
          </button>
        }
      >
        <div className="scroll-section__row life-home__class-row">
          {FREE_CLASSES.map((course, index) => (
            <LifeClassCard
              key={course.id}
              course={course}
              index={index}
              onStart={() => navigate(`/courses/${course.id}/play`)}
            />
          ))}
        </div>
      </ScrollSection>

      {/* Meditation Section */}
      <ScrollSection title="Meditation" reveal="scale">
        <div className="life-meditation-card">
          {MEDITATION_SESSION.cover ? (
            <div className="life-meditation-card__cover-wrap">
              <img src={MEDITATION_SESSION.cover} alt={MEDITATION_SESSION.name} className="life-meditation-card__cover-img" loading="lazy" />
            </div>
          ) : (
            <PoseIllustration name="meditation" size={72} />
          )}
          <div className="life-meditation-card__info">
            <strong>{MEDITATION_SESSION.name}</strong>
            <p>{MEDITATION_SESSION.tagline}</p>
            <span>{Math.round(MEDITATION_SESSION.durationSec / 60)} min session</span>
          </div>
          <Button onClick={() => navigate('/meditate')}>Start Session</Button>
        </div>
      </ScrollSection>
    </div>
  )
}

/**
 * Cards in a horizontal row sit inside a plain scroller `div`, so a variant label
 * on the section never reaches them (propagation is direct-children only here).
 * Each card gates its own entry and takes the row stagger from its index.
 */
function cardEntryVariants(index) {
  return {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.section, ease: EASE.standard, delay: (index % 5) * STAGGER },
    },
    hover: { y: -6, transition: cardHover },
  }
}

function LifeClassCard({ course, index, onStart }) {
  const [ref, revealed] = useInViewOnce()

  return (
    <motion.article
      ref={ref}
      className="life-class-card"
      variants={cardEntryVariants(index)}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
    >
      <motion.div
        className="life-class-card__thumb"
        variants={{ visible: { scale: 1, transition: cardHover }, hover: { scale: 1.05, transition: cardHover } }}
      >
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.name} className="life-class-card__img" loading="lazy" />
        ) : (
          <PoseIllustration name={course.poses[0].illustration} size={56} />
        )}
      </motion.div>
      <h3>{course.name}</h3>
      <p>{course.shortDesc}</p>
      <div className="life-class-card__meta">
        <span>{course.duration} min</span>
        <span className={`life-class-card__badge life-class-card__badge--${course.difficulty}`}>
          {course.difficulty}
        </span>
      </div>
      <Button variant="outline" onClick={onStart}>
        Start
      </Button>
    </motion.article>
  )
}

function LifeArticleCard({ article, index, onOpen }) {
  const [ref, revealed] = useInViewOnce()

  return (
    <motion.article
      ref={ref}
      className="life-article-card"
      variants={cardEntryVariants(index)}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
      whileHover="hover"
      whileTap={TAP_FIRM}
    >
      <div className="life-article-card__cover">
        {article.image ? (
          <img src={article.image} alt={article.title} className="life-article-card__img" loading="lazy" />
        ) : (
          <PoseIllustration name="child" size={40} />
        )}
      </div>
      <h3>{article.title}</h3>
      <span className="life-article-card__time">{article.readingTime}</span>
      <button type="button" className="life-article-card__open" onClick={onOpen}>
        Open Article
      </button>
    </motion.article>
  )
}

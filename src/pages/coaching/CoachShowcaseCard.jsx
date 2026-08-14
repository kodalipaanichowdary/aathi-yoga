import { motion } from 'framer-motion'
import CoachPortrait from './CoachPortrait'
import RatingStars from '../../components/ui/RatingStars'
import { DURATION, EASE, HOVER_LIFT_SM, TAP } from '../../lib/motion'
import './CoachShowcaseCarousel.css'

/** First sentence of the bio, used as the card's short description. */
function shortDescription(bio) {
  const [firstSentence] = bio.split(/(?<=[.!?])\s+/)
  return firstSentence
}

const CARD_VARIANTS = {
  rest: { y: 0 },
  hover: HOVER_LIFT_SM,
}

const MEDIA_VARIANTS = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: DURATION.hover, ease: EASE.standard } },
}

const HINT_VARIANTS = {
  rest: { opacity: 0, y: 6 },
  hover: { opacity: 1, y: 0, transition: { duration: DURATION.hover, ease: EASE.standard } },
}

/**
 * Compact coach card for the home-page carousel. Reusable and stateless — the
 * carousel owns position/index, this only knows how to render one coach.
 */
export default function CoachShowcaseCard({ coach, index, onOpenProfile }) {
  const desc = shortDescription(coach.bio)

  return (
    <motion.article
      className="coach-showcase-card"
      variants={CARD_VARIANTS}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={TAP}
      tabIndex={0}
      role="button"
      aria-label={`View ${coach.name}'s profile — ${coach.specialty}`}
      onClick={() => onOpenProfile(coach.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenProfile(coach.id)
        }
      }}
    >
      <div className="coach-showcase-card__media">
        <motion.div className="coach-showcase-card__media-inner" variants={MEDIA_VARIANTS}>
          {coach.image ? (
            <img src={coach.image} alt={coach.name} className="coach-showcase-card__photo" loading="lazy" />
          ) : (
            <div className="coach-showcase-card__fallback">
              <CoachPortrait name={coach.name} index={index} size={88} showStatus={false} />
            </div>
          )}
        </motion.div>
        <span className="coach-showcase-card__badge">{coach.specialty}</span>
      </div>

      <div className="coach-showcase-card__body">
        <h3 className="coach-showcase-card__name">{coach.name}</h3>
        <p className="coach-showcase-card__desc">{desc}</p>
        <div className="coach-showcase-card__meta">
          <RatingStars rating={coach.rating} count={coach.sessions} />
          <span className="coach-showcase-card__meta-label">sessions</span>
        </div>
        <motion.span className="coach-showcase-card__hint" variants={HINT_VARIANTS}>
          View profile &rarr;
        </motion.span>
      </div>
    </motion.article>
  )
}

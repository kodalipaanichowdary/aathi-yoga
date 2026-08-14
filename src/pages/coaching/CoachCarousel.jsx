import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import RatingStars from '../../components/ui/RatingStars'
import { useToast } from '../../components/ui/useToast'
import CoachPortrait from './CoachPortrait'
import CoachProfileModal from './CoachProfileModal'
import { SPRING, TAP, slideVariants } from '../../lib/motion'
import './CoachCarousel.css'

const SWIPE_THRESHOLD = 60
const variants = slideVariants(60)

export default function CoachCarousel({ coaches }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [profileId, setProfileId] = useState(null)
  const showToast = useToast()

  const coach = coaches[index]
  const profileCoach = coaches.find((entry) => entry.id === profileId) ?? null

  function go(step) {
    setDirection(step)
    setIndex((current) => (current + step + coaches.length) % coaches.length)
  }

  function handleBook(target) {
    showToast(`Session request sent to ${target.name}. They'll confirm your slot shortly.`, 'success')
  }

  function handleDragEnd(_event, info) {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1)
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1)
  }

  return (
    <div className="coach-carousel">
      <div className="coach-carousel__viewport">
        <motion.button
          type="button"
          className="coach-carousel__arrow"
          onClick={() => go(-1)}
          whileTap={TAP}
          transition={SPRING.press}
          aria-label="Previous coach"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <div className="coach-carousel__slide-area">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.article
              key={coach.id}
              className="coach-card"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING.indicator}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
            >
              <div className="coach-card__top">
                <CoachPortrait name={coach.name} index={index} online={coach.online} size={92} />

                <div className="coach-card__identity">
                  <h2 className="coach-card__name">{coach.name}</h2>
                  <p className="coach-card__specialty">{coach.specialty}</p>
                  <div className="coach-card__stats">
                    <span className="coach-card__rating">
                      <RatingStars rating={coach.rating} />
                    </span>
                    <span className="coach-card__sessions">{coach.sessions.toLocaleString('en-IN')} sessions</span>
                  </div>
                  <span
                    className={`coach-card__availability ${
                      coach.online ? 'coach-card__availability--online' : ''
                    }`.trim()}
                  >
                    {coach.online ? 'Available now' : 'Offline — booking open'}
                  </span>
                </div>
              </div>

              <dl className="coach-card__facts">
                <div>
                  <dt>Experience</dt>
                  <dd>{coach.experience}</dd>
                </div>
                <div>
                  <dt>Hours</dt>
                  <dd>{coach.availability}</dd>
                </div>
                <div>
                  <dt>Languages</dt>
                  <dd>{coach.languages.join(' · ')}</dd>
                </div>
              </dl>

              <div className="coach-card__chips">
                {coach.focus.map((item) => (
                  <span key={item} className="coach-card__chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="coach-card__actions">
                <Button className="coach-card__cta" onClick={() => handleBook(coach)}>
                  Book Session
                </Button>
                <Button variant="outline" className="coach-card__cta" onClick={() => setProfileId(coach.id)}>
                  View Profile
                </Button>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          className="coach-carousel__arrow"
          onClick={() => go(1)}
          whileTap={TAP}
          transition={SPRING.press}
          aria-label="Next coach"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <div className="coach-carousel__dots">
        {coaches.map((entry, entryIndex) => (
          <button
            key={entry.id}
            type="button"
            className={`coach-carousel__dot ${entryIndex === index ? 'coach-carousel__dot--active' : ''}`.trim()}
            onClick={() => {
              setDirection(entryIndex > index ? 1 : -1)
              setIndex(entryIndex)
            }}
            aria-label={`Go to ${entry.name}`}
          />
        ))}
      </div>

      <CoachProfileModal
        coach={profileCoach}
        coachIndex={profileCoach ? coaches.indexOf(profileCoach) : 0}
        onClose={() => setProfileId(null)}
        onBook={handleBook}
      />
    </div>
  )
}

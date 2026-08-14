import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import RatingStars from '../../components/ui/RatingStars'
import CoachPortrait from './CoachPortrait'
import { DURATION, REVEAL, SPRING, STAGGER_ITEM, TAP } from '../../lib/motion'
import './CoachProfileModal.css'

/**
 * Coach profile as a centered modal rather than a route, so opening a profile
 * never loses your place in the carousel.
 */
export default function CoachProfileModal({ coach, coachIndex = 0, onClose, onBook }) {
  useEffect(() => {
    if (!coach) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [coach, onClose])

  return (
    <AnimatePresence>
      {coach && (
        <>
          <motion.div
            className="coach-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.hover }}
            onClick={onClose}
          />

          <div className="coach-modal__layer">
            <motion.div
              className="coach-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${coach.name} profile`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={SPRING.sheet}
            >
              <motion.button
                type="button"
                className="coach-modal__close"
                onClick={onClose}
                whileTap={TAP}
                transition={SPRING.press}
                aria-label="Close profile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.button>

              <div className="coach-modal__body">
                <div className="coach-modal__head">
                  <CoachPortrait name={coach.name} image={coach.image} index={coachIndex} online={coach.online} size={104} />
                  <h2>{coach.name}</h2>
                  <p className="coach-modal__specialty">{coach.specialty}</p>
                  <div className="coach-modal__badges">
                    <span className="coach-modal__badge">
                      <RatingStars rating={coach.rating} />
                    </span>
                    <span className="coach-modal__badge">{coach.sessions.toLocaleString('en-IN')} sessions</span>
                    <span
                      className={`coach-modal__badge ${
                        coach.online ? 'coach-modal__badge--online' : ''
                      }`.trim()}
                    >
                      {coach.online ? 'Available now' : 'Offline'}
                    </span>
                  </div>
                </div>

                <p className="coach-modal__bio">{coach.bio}</p>

                <motion.div
                  className="coach-modal__sections"
                  variants={REVEAL.stagger}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.section variants={STAGGER_ITEM}>
                    <h3>Focus areas</h3>
                    <div className="coach-modal__chips">
                      {coach.focus.map((item) => (
                        <span key={item} className="coach-modal__chip">
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.section>

                  <motion.section variants={STAGGER_ITEM}>
                    <h3>Details</h3>
                    <dl className="coach-modal__facts">
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
                  </motion.section>

                  {coach.testimonials?.length > 0 && (
                    <motion.section variants={STAGGER_ITEM}>
                      <h3>What students say</h3>
                      <div className="coach-modal__quotes">
                        {coach.testimonials.map((testimonial) => (
                          <blockquote key={testimonial.author} className="testimonial-card">
                            <p className="testimonial-card__quote">&ldquo;{testimonial.quote}&rdquo;</p>
                            <cite className="testimonial-card__author">&mdash; {testimonial.author}</cite>
                          </blockquote>
                        ))}
                      </div>
                    </motion.section>
                  )}
                </motion.div>
              </div>

              <div className="coach-modal__footer">
                <Button
                  onClick={() => {
                    onBook(coach)
                    onClose()
                  }}
                >
                  Book Session with {coach.name.split(' ')[0]}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import CoachShowcaseCard from './CoachShowcaseCard'
import CoachProfileModal from './CoachProfileModal'
import { useToast } from '../../components/ui/useToast'
import { SPRING, TAP } from '../../lib/motion'
import './CoachShowcaseCarousel.css'

export default function CoachShowcaseCarousel({ coaches }) {
  const [index, setIndex] = useState(0)
  const [profileId, setProfileId] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const trackRef = useRef(null)
  const showToast = useToast()

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild
    if (!card) return

    const cardWidth = card.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(track).gap || '14') || 14
    const step = cardWidth + gap
    const scrollLeft = track.scrollLeft
    const maxScroll = track.scrollWidth - track.clientWidth

    const newIndex = Math.min(coaches.length - 1, Math.max(0, Math.round(scrollLeft / step)))
    setIndex(newIndex)
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < maxScroll - 5)
  }, [coaches.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    updateScrollState()
    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  function go(delta) {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild
    if (!card) return

    const cardWidth = card.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(track).gap || '14') || 14
    const step = cardWidth + gap
    track.scrollBy({ left: delta * step, behavior: 'smooth' })
  }

  function scrollToIndex(targetIndex) {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild
    if (!card) return

    const cardWidth = card.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(track).gap || '14') || 14
    const step = cardWidth + gap
    track.scrollTo({ left: targetIndex * step, behavior: 'smooth' })
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
  }

  function handleBook(target) {
    showToast(`Session request sent to ${target.name}. They'll confirm your slot shortly.`, 'success')
  }

  const profileCoach = coaches.find((entry) => entry.id === profileId) ?? null

  return (
    <div className="coach-showcase">
      <div
        className="coach-showcase__viewport"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Coach carousel"
        onKeyDown={handleKeyDown}
      >
        <div className="coach-showcase__track" ref={trackRef}>
          {coaches.map((coach, i) => (
            <CoachShowcaseCard key={coach.id} coach={coach} index={i} onOpenProfile={setProfileId} />
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        className="coach-showcase__arrow coach-showcase__arrow--prev"
        onClick={() => go(-1)}
        disabled={!canScrollLeft}
        whileTap={TAP}
        transition={SPRING.press}
        aria-label="Show previous coaches"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
      <motion.button
        type="button"
        className="coach-showcase__arrow coach-showcase__arrow--next"
        onClick={() => go(1)}
        disabled={!canScrollRight}
        whileTap={TAP}
        transition={SPRING.press}
        aria-label="Show more coaches"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      <div className="coach-showcase__dots" aria-hidden="true">
        {coaches.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            className={`coach-showcase__dot ${dotIndex === index ? 'coach-showcase__dot--active' : ''}`.trim()}
            onClick={() => scrollToIndex(dotIndex)}
            aria-label={`Go to coach ${dotIndex + 1}`}
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

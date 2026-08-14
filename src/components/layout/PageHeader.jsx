import { useState } from 'react'
import { motion } from 'framer-motion'
import SearchField from '../ui/SearchField'
import ProfileModal from './ProfileModal'
import { useAuthStore } from '../../store/useAuthStore'
import { HERO_ITEM, SPRING, TAP } from '../../lib/motion'
import './PageHeader.css'

const DEFAULT_PROMPTS = ['Search Rudraksha', 'Search Meditation', 'Search Diet Plans', 'Search Coaching']

/**
 * Rows are tagged with HERO_ITEM. Inside the homepage hero — which orchestrates
 * HERO_SEQUENCE — they arrive in document order on the shared stagger cadence:
 * greeting -> brand -> search. On plain pages there is no variant parent, so
 * they simply render static.
 */
export default function PageHeader({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPrompts = DEFAULT_PROMPTS,
  searchTags = [],
  brand = false,
  brandLabel = 'Aathi Yoga',
}) {
  const currentUser = useAuthStore((state) => state.currentUser)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  function handleAvatarClick() {
    setProfileModalOpen(true)
  }

  return (
    <div className="page-header">
      <div className="page-header__top-row">
        <motion.div className="page-header__greeting" variants={HERO_ITEM}>
          <motion.button
            type="button"
            className="page-header__avatar"
            onClick={handleAvatarClick}
            whileHover={{ scale: 1.08 }}
            whileTap={TAP}
            transition={SPRING.press}
            title="Profile & Settings"
            aria-label="Profile & Settings"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </motion.button>
          <span>Welcome {currentUser?.name?.split(' ')[0] ?? ''}</span>
        </motion.div>

        {brand && (
          <motion.div className="page-header__brand" variants={HERO_ITEM}>
            <span className="page-header__brand-mark" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="12.5" r="4.4" fill="currentColor" />
                <path
                  d="M11.5 30q0-9 8.5-9.6Q28.5 21 28.5 30q0 4.6-8.5 4.6T11.5 30z"
                  fill="currentColor"
                />
                <path d="M8 31q-4-5.5-1.5-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M32 31q4-5.5 1.5-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="page-header__brand-label">{brandLabel}</span>
          </motion.div>
        )}
      </div>

      {onSearchChange && (
        <motion.div variants={HERO_ITEM}>
          <SearchField
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            prompts={searchPrompts}
            tags={searchTags}
          />
        </motion.div>
      )}

      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useSearchStore } from '../../store/useSearchStore'
import { DURATION, EASE, SPRING, STAGGER } from '../../lib/motion'
import './SearchField.css'

const ROTATE_MS = 2800

/**
 * Search field with the full focus treatment: it grows and deepens its shadow
 * on focus, a soft glow tracks the caret, the placeholder cycles through
 * rotating prompts while idle, and focusing reveals recent searches plus
 * popular tags.
 *
 * The rotating placeholder is a pointer-transparent overlay rather than the real
 * `placeholder` attribute, because ::placeholder can't be animated.
 */
export default function SearchField({
  value,
  onChange,
  onSubmit,
  prompts = ['Search'],
  tags = [],
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const [focused, setFocused] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const recent = useSearchStore((state) => state.recent)
  const remember = useSearchStore((state) => state.remember)

  const idle = !focused && !value

  useEffect(() => {
    if (!idle || reduceMotion || prompts.length < 2) return
    const rotation = setInterval(() => setPromptIndex((index) => index + 1), ROTATE_MS)
    return () => clearInterval(rotation)
  }, [idle, reduceMotion, prompts.length])

  function commit(term) {
    remember(term)
    onSubmit?.(term)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!value.trim()) return
    commit(value)
    setFocused(false)
  }

  function handleChipPick(term) {
    onChange(term)
    commit(term)
    setFocused(false)
  }

  const showPanel = focused && (recent.length > 0 || tags.length > 0)

  return (
    <div className={`search-field ${focused ? 'search-field--focused' : ''} ${className}`.trim()}>
      <motion.form
        className="search-field__box"
        onSubmit={handleSubmit}
        animate={focused ? { scale: 1.015 } : { scale: 1 }}
        transition={SPRING.press}
      >
        <svg className="search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        <div className="search-field__input-wrap">
          <input
            className="search-field__input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search"
          />

          {idle && (
            <div className="search-field__prompt" aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={promptIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: DURATION.hover, ease: EASE.standard }}
                >
                  {prompts[promptIndex % prompts.length]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        {value && (
          <motion.button
            type="button"
            className="search-field__clear"
            onClick={() => onChange('')}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING.press}
            aria-label="Clear search"
          >
            ×
          </motion.button>
        )}

        <span className="search-field__glow" aria-hidden="true" />
      </motion.form>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="search-field__panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: DURATION.hover, ease: EASE.standard }}
          >
            {recent.length > 0 && (
              <div className="search-field__group">
                <span className="search-field__group-label">Recent</span>
                <div className="search-field__chips">
                  {recent.map((term, index) => (
                    <SuggestionChip key={term} label={term} index={index} recent onPick={handleChipPick} />
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="search-field__group">
                <span className="search-field__group-label">Popular</span>
                <div className="search-field__chips">
                  {tags.map((tag, index) => (
                    <SuggestionChip
                      key={tag}
                      label={tag}
                      index={recent.length + index}
                      onPick={handleChipPick}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SuggestionChip({ label, index, recent = false, onPick }) {
  return (
    <motion.button
      type="button"
      className={`search-field__chip ${recent ? 'search-field__chip--recent' : ''}`.trim()}
      // Keeps focus on the input so the panel doesn't blur away mid-click.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onPick(label)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.tap, ease: EASE.standard, delay: index * STAGGER * 0.5 }}
      whileTap={{ scale: 0.95 }}
    >
      {recent && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </motion.button>
  )
}

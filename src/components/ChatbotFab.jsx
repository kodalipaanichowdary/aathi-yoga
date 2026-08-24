import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getChatbotAnswer, CHATBOT_FALLBACK } from '../data/chatbotRules'
import { useCartStore } from '../store/useCartStore'
import { DURATION, EASE, SPRING, TAP } from '../lib/motion'
import './ChatbotFab.css'

const GREETING = 'Hi! Ask me about courses, products, membership, diet plans or coaching.'

const SUGGESTIONS = [
  'What courses are there?',
  'How much is membership?',
  'Show me diet plans',
  'Can I book a coach?',
]

/** Pause before the bot starts answering, then per-word reveal cadence. */
const THINKING_MS = 480
const WORD_MS = 55

export default function ChatbotFab() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'bot', text: GREETING }])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(null)
  const [stream, setStream] = useState(null)
  const messagesRef = useRef(null)

  // Thinking pause -> begin streaming the answer.
  useEffect(() => {
    if (!typing) return
    const timer = setTimeout(() => {
      setStream({ words: typing.answer.split(' '), shown: 1 })
      setTyping(null)
    }, THINKING_MS)
    return () => clearTimeout(timer)
  }, [typing])

  // Word-by-word reveal; once complete the streamed text becomes a real message.
  useEffect(() => {
    if (!stream) return
    if (stream.shown >= stream.words.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'bot', text: stream.words.join(' ') }])
        setStream(null)
      }, 140)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(
      () => setStream((current) => (current ? { ...current, shown: current.shown + 1 } : current)),
      reduceMotion ? 0 : WORD_MS,
    )
    return () => clearTimeout(timer)
  }, [stream, reduceMotion])

  // Keep the newest message in view as content grows.
  useEffect(() => {
    const node = messagesRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, stream, typing, open])

  function ask(text) {
    const clean = text.trim()
    if (!clean || typing || stream) return
    setMessages((prev) => [...prev, { role: 'user', text: clean }])
    setTyping({ answer: getChatbotAnswer(clean) })
    setDraft('')
  }

  const items = useCartStore((state) => state.items)
  const hasCartItems = items.length > 0

  const lastAnswerIsFallback = messages.at(-1)?.text === CHATBOT_FALLBACK
  const busy = Boolean(typing || stream)
  const showSuggestions = messages.length <= 1 && !busy

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-fab"
            type="button"
            className={`chatbot-fab ${hasCartItems ? 'chatbot-fab--has-cart' : ''}`.trim()}
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.12 }}
            whileTap={TAP}
            transition={SPRING.press}
            aria-label="Open assistant"
          >
            {/* Breathing halo — transform + opacity only, and stopped entirely
                under prefers-reduced-motion by the global CSS guard. */}
            <span className="chatbot-fab__breath" aria-hidden="true" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12a8 7 0 1 1 3.2 5.6L4 19l1.1-3.4A7 6 0 0 1 4 12z"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`chatbot-drawer ${hasCartItems ? 'chatbot-drawer--has-cart' : ''}`.trim()}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={SPRING.sheet}
            role="dialog"
            aria-label="Aathi Assistant"
          >
            <div className="chatbot-drawer__header">
              <span className="chatbot-drawer__title">
                <span className="chatbot-drawer__dot" aria-hidden="true" />
                Aathi Assistant
              </span>
              <motion.button
                type="button"
                onClick={() => setOpen(false)}
                whileHover={{ rotate: 90 }}
                whileTap={TAP}
                transition={SPRING.press}
                aria-label="Close assistant"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </motion.button>
            </div>

            <div className="chatbot-drawer__messages" ref={messagesRef}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${index}-${message.role}`}
                  className={`chatbot-drawer__bubble chatbot-drawer__bubble--${message.role}`}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: DURATION.hover, ease: EASE.standard }}
                >
                  {message.text}
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  className="chatbot-drawer__bubble chatbot-drawer__bubble--bot chatbot-drawer__typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.tap, ease: EASE.standard }}
                  aria-label="Assistant is typing"
                >
                  <span />
                  <span />
                  <span />
                </motion.div>
              )}

              {stream && (
                <div className="chatbot-drawer__bubble chatbot-drawer__bubble--bot">
                  {stream.words.slice(0, stream.shown).join(' ')}
                  <span className="chatbot-drawer__caret" aria-hidden="true" />
                </div>
              )}

              {showSuggestions && (
                <div className="chatbot-drawer__suggestions">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      type="button"
                      onClick={() => ask(suggestion)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: DURATION.hover,
                        ease: EASE.standard,
                        delay: 0.08 + index * 0.06,
                      }}
                      whileTap={TAP}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              )}

              {lastAnswerIsFallback && !busy && (
                <button
                  type="button"
                  className="chatbot-drawer__support-link"
                  onClick={() => {
                    setOpen(false)
                    navigate('/support')
                  }}
                >
                  Talk to Support
                </button>
              )}
            </div>

            <form
              className="chatbot-drawer__input"
              onSubmit={(event) => {
                event.preventDefault()
                ask(draft)
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={busy ? 'Assistant is replying…' : 'Ask a question...'}
                disabled={busy}
              />
              <button type="submit" disabled={busy || !draft.trim()}>
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

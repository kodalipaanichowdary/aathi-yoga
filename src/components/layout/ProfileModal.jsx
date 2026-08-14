import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'
import { useToast } from '../ui/useToast'
import { DURATION, SPRING } from '../../lib/motion'
import './ProfileModal.css'

export default function ProfileModal({ open, onClose }) {
  const navigate = useNavigate()
  const showToast = useToast()
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!currentUser) return null

  function handleConfirmLogout() {
    const mobileToRemember = currentUser?.mobile
    logout()
    onClose()
    showToast('Logged out of your account.', 'default')
    navigate('/auth', { replace: true, state: { prefill: { mobile: mobileToRemember } } })
  }

  const initialLetter = currentUser?.name?.[0]?.toUpperCase() ?? 'U'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="profile-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.hover }}
            onClick={onClose}
          />

          {/* Dialog container */}
          <div className="profile-modal__container" onClick={onClose}>
            <motion.div
              className="profile-modal"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={SPRING.pop}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
            >
              <div className="profile-modal__avatar-wrap">
                <div className="profile-modal__avatar">{initialLetter}</div>
                <div className="profile-modal__badge" title="Verified Account">✓</div>
              </div>

              <h2 id="profile-modal-title" className="profile-modal__name">
                {currentUser.name}
              </h2>
              <span className="profile-modal__role">
                {currentUser.role === 'admin' ? 'Administrator' : 'Aathi Yoga Member'}
              </span>

              <div className="profile-modal__info-box">
                <div className="profile-modal__info-row">
                  <span className="profile-modal__info-label">Mobile</span>
                  <span className="profile-modal__info-val">+91 {currentUser.mobile}</span>
                </div>
                {currentUser.email && (
                  <div className="profile-modal__info-row">
                    <span className="profile-modal__info-label">Email</span>
                    <span className="profile-modal__info-val">{currentUser.email}</span>
                  </div>
                )}
              </div>

              <p className="profile-modal__question">Do you want to log out?</p>
              <p className="profile-modal__desc">
                Your registered account is safely saved in the database. You can log back in anytime with your mobile number.
              </p>

              <div className="profile-modal__actions">
                <button
                  type="button"
                  className="profile-modal__btn profile-modal__btn--cancel"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="profile-modal__btn profile-modal__btn--logout"
                  onClick={handleConfirmLogout}
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

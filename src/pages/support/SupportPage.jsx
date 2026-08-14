import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import TextField from '../../components/ui/TextField'
import { useToast } from '../../components/ui/useToast'
import { isValidEmail, isValidName } from '../../lib/validators'
import './SupportPage.css'

const SUPPORT_PHONE = '+91 98765 43210'
const SUPPORT_PHONE_TEL = 'tel:+919876543210'
const SUPPORT_EMAIL = 'support@aathiyoga.com'
const SUPPORT_HOURS = 'Mon-Sat, 9 AM - 7 PM IST'

const EMPTY_FORM = { name: '', email: '', message: '' }

export default function SupportPage() {
  const showToast = useToast()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}
    if (!isValidName(form.name)) {
      nextErrors.name = 'Enter your name.'
    }
    if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (form.message.trim().length < 5) {
      nextErrors.message = 'Tell us a little more about your query.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setForm(EMPTY_FORM)
    setErrors({})
    showToast("Message received, we'll get back to you soon.", 'success')
  }

  return (
    <div className="support-page">
      <div className="support-page__header">
        <h1>Support</h1>
        <p>We're here to help with orders, courses, coaching, and membership questions.</p>
      </div>

      <motion.section
        className="support-info-card"
        whileHover={{ y: -3, boxShadow: '0 18px 28px -16px rgba(0,0,0,0.2)' }}
        transition={{ duration: 0.18 }}
      >
        <dl className="support-info-card__list">
          <div className="support-info-card__row">
            <dt>Phone</dt>
            <dd>{SUPPORT_PHONE}</dd>
          </div>
          <div className="support-info-card__row">
            <dt>Email</dt>
            <dd>{SUPPORT_EMAIL}</dd>
          </div>
          <div className="support-info-card__row">
            <dt>Support hours</dt>
            <dd>{SUPPORT_HOURS}</dd>
          </div>
        </dl>

        <motion.a
          href={SUPPORT_PHONE_TEL}
          className="support-page__call-btn"
          whileTap={{ scale: 0.97 }}
        >
          Call Support
        </motion.a>
      </motion.section>

      <section className="support-form-card">
        <h2 className="support-form-card__title">Send us a message</h2>
        <form className="support-form" onSubmit={handleSubmit}>
          <TextField
            id="support-name"
            label="Name"
            placeholder="Your name"
            value={form.name}
            error={errors.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
          <TextField
            id="support-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(event) => updateField('email', event.target.value)}
          />

          <div className="field">
            <label className="field__label" htmlFor="support-message">
              Message
            </label>
            <textarea
              id="support-message"
              className={`field__input support-form__textarea ${errors.message ? 'field__input--error' : ''}`.trim()}
              placeholder="How can we help?"
              rows={4}
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
            />
            {errors.message && <p className="field__error">{errors.message}</p>}
          </div>

          <Button type="submit">Send Message</Button>
        </form>
      </section>
    </div>
  )
}

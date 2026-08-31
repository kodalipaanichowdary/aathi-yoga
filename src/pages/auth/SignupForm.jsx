import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import Button from '../../components/ui/Button'
import PhoneField from '../../components/ui/PhoneField'
import TextField from '../../components/ui/TextField'
import BackButton from '../../components/ui/BackButton'
import { useAuthStore } from '../../store/useAuthStore'
import { isValidEmail, isValidMobile, isValidName, isValidPassword } from '../../lib/validators'
import './AuthForms.css'

export default function SignupForm({ onSwitchToLogin, prefill }) {
  const navigate = useNavigate()
  const findUserByMobile = useAuthStore((state) => state.findUserByMobile)
  const findUserByEmail = useAuthStore((state) => state.findUserByEmail)

  const [name, setName] = useState(prefill?.name ?? '')
  const [mobile, setMobile] = useState(prefill?.mobile ?? '')
  const [email, setEmail] = useState(prefill?.email ?? '')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const isMobileValid = isValidMobile(mobile)
  const existingUserByMobile = isMobileValid ? findUserByMobile(mobile) : null

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}
    if (!isValidName(name)) nextErrors.name = 'Enter your full name.'
    if (!isValidMobile(mobile)) nextErrors.mobile = 'Enter a valid 10-digit mobile number.'
    if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'
    if (!isValidPassword(password)) nextErrors.password = 'Password must be at least 6 characters.'
    
    // Check uniqueness against internal JSON database and store
    if (!nextErrors.mobile && findUserByMobile(mobile)) {
      nextErrors.mobile = 'This mobile number is already registered. Try logging in instead.'
    }
    if (!nextErrors.email && findUserByEmail(email)) {
      nextErrors.email = 'This email address is already in use by another account.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    navigate('/verify-otp', { state: { mode: 'signup', mobile, name: name.trim(), email: email.trim(), password } })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <BackButton onClick={() => onSwitchToLogin?.({ mobile })} />
      <p className="auth-form__eyebrow">Welcome to</p>
      <Logo variant="wordmark" size="lg" />
      <h2 className="auth-form__title">Sign Up</h2>

      <div className="auth-form__fields">
        <TextField
          id="signup-name"
          label={
            <>
              Name<span aria-hidden="true"> *</span>
            </>
          }
          placeholder="Name"
          value={name}
          error={errors.name}
          onChange={(event) => {
            setName(event.target.value)
            setErrors((prev) => ({ ...prev, name: undefined }))
          }}
        />
        <PhoneField
          id="signup-mobile"
          label={
            <>
              Mobile number<span aria-hidden="true"> *</span>
            </>
          }
          value={mobile}
          error={errors.mobile}
          onChange={(value) => {
            setMobile(value)
            setErrors((prev) => ({ ...prev, mobile: undefined }))
          }}
        />

        {existingUserByMobile && !errors.mobile && (
          <div className="auth-form__status-banner auth-form__status-banner--notice">
            <p>
              Already registered as <strong>{existingUserByMobile.name}</strong>.
            </p>
            <button
              type="button"
              className="auth-form__banner-btn"
              onClick={() => onSwitchToLogin?.({ mobile })}
            >
              Log In instead &rarr;
            </button>
          </div>
        )}

        <TextField
          id="signup-email"
          type="email"
          label={
            <>
              Email<span aria-hidden="true"> *</span>
            </>
          }
          placeholder="Email Address"
          value={email}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value)
            setErrors((prev) => ({ ...prev, email: undefined }))
          }}
        />
        <TextField
          id="signup-password"
          type="password"
          label={
            <>
              Password<span aria-hidden="true"> *</span>
            </>
          }
          placeholder="Min 6 characters"
          value={password}
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            setErrors((prev) => ({ ...prev, password: undefined }))
          }}
        />
      </div>

      <Button type="submit" disabled={submitting}>
        Create an account
      </Button>

      <p className="auth-form__terms">
        By Signing up, you accept our{' '}
        <a href="#terms" onClick={(event) => event.preventDefault()}>
          Terms of Service and Privacy Policy
        </a>
      </p>

      <p className="auth-form__switch">
        Already have an account?{' '}
        <button type="button" onClick={() => onSwitchToLogin?.({ mobile })}>
          Log In
        </button>
      </p>
    </form>
  )
}

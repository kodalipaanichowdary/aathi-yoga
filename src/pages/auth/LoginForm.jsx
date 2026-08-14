import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import Button from '../../components/ui/Button'
import PhoneField from '../../components/ui/PhoneField'
import GoogleIcon from '../../components/GoogleIcon'
import { useToast } from '../../components/ui/useToast'
import { useAuthStore } from '../../store/useAuthStore'
import { isValidMobile } from '../../lib/validators'
import './AuthForms.css'

export default function LoginForm({ onSwitchToSignup, prefill }) {
  const navigate = useNavigate()
  const showToast = useToast()
  const findUserByMobile = useAuthStore((state) => state.findUserByMobile)
  const [mobile, setMobile] = useState(prefill?.mobile ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isComplete = isValidMobile(mobile)
  const matchedUser = isComplete ? findUserByMobile(mobile) : null
  const isUnregistered = isComplete && !matchedUser

  function handleSubmit(event) {
    event.preventDefault()
    if (!isValidMobile(mobile)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    const user = findUserByMobile(mobile)
    if (!user) {
      // Direct user to Sign Up with mobile prefilled
      showToast(`No account for +91 ${mobile}. Let's create your account.`, 'info')
      if (onSwitchToSignup) {
        onSwitchToSignup({ mobile })
      }
      return
    }

    setSubmitting(true)
    navigate('/verify-otp', { state: { mode: 'login', mobile, userName: user.name } })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <Logo variant="badge" size="sm" className="auth-form__logo" />
      <p className="auth-form__tagline">Yoga is a way of life</p>
      <h2 className="auth-form__title">Login</h2>

      <div className="auth-form__fields">
        <PhoneField
          value={mobile}
          onChange={(value) => {
            setMobile(value)
            setError('')
          }}
          error={error}
        />

        {matchedUser && !error && (
          <div className="auth-form__status-banner auth-form__status-banner--success">
            <span>✓</span>
            <p>
              Account identified: <strong>{matchedUser.name}</strong>
            </p>
          </div>
        )}

        {isUnregistered && !error && (
          <div className="auth-form__status-banner auth-form__status-banner--notice">
            <p>
              No account found for <strong>+91 {mobile}</strong>.
            </p>
            <button
              type="button"
              className="auth-form__banner-btn"
              onClick={() => onSwitchToSignup?.({ mobile })}
            >
              Sign Up with this number &rarr;
            </button>
          </div>
        )}
      </div>

      <div className="auth-form__actions">
        <Button type="submit" disabled={submitting}>
          {isUnregistered ? 'Continue to Sign Up' : 'Continue'}
        </Button>
        <div className="auth-form__divider">or</div>
        <Button
          variant="outline"
          className="auth-form__google"
          onClick={() => showToast('Google sign-in is coming soon.')}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </div>

      <p className="auth-form__terms">
        By clicking on Continue, you accept our{' '}
        <a href="#terms" onClick={(event) => event.preventDefault()}>
          Terms of Service and Privacy Policy
        </a>
      </p>

      <p className="auth-form__switch">
        New to Aathi Yoga?{' '}
        <button type="button" onClick={() => onSwitchToSignup?.({ mobile })}>
          Sign Up
        </button>
      </p>
    </form>
  )
}

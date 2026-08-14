import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'
import BackButton from '../components/ui/BackButton'
import OtpBoxes from '../components/ui/OtpBoxes'
import { useToast } from '../components/ui/useToast'
import { useAuthStore } from '../store/useAuthStore'
import { requestOtp, verifyOtp, RESEND_COOLDOWN_S } from '../lib/otpService'
import './OtpVerification.css'

export default function OtpVerification() {
  const location = useLocation()
  const navigate = useNavigate()
  const showToast = useToast()
  const registerUser = useAuthStore((state) => state.registerUser)
  const findUserByMobile = useAuthStore((state) => state.findUserByMobile)
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)

  const { mode, mobile, name, email, userName } = location.state ?? {}
  const displayName = userName || name || ''

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_S)
  const [demoCode, setDemoCode] = useState('')
  const hasSentInitialOtp = useRef(false)

  const sendOtp = useCallback(() => {
    const code = requestOtp(mobile)
    setDemoCode(code)
    setSecondsLeft(RESEND_COOLDOWN_S)
    showToast(`Demo OTP sent: ${code}`)
  }, [mobile, showToast])

  useEffect(() => {
    if (!mobile) {
      navigate('/auth', { replace: true })
      return
    }
    if (hasSentInitialOtp.current) return
    hasSentInitialOtp.current = true
    sendOtp()
  }, [mobile, navigate, sendOtp])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  if (!mobile) {
    return null
  }

  function handleBack() {
    navigate('/auth', { state: { mode, mobile, name, email } })
  }

  function handleVerify(event) {
    event.preventDefault()
    if (code.length < 6) {
      setError('Enter the 6-digit code.')
      return
    }

    setVerifying(true)
    const result = verifyOtp(mobile, code)

    if (!result.success) {
      setVerifying(false)
      setCode('')
      if (result.reason === 'expired') {
        setError('This code has expired. Tap resend to get a new one.')
      } else {
        setError('Incorrect OTP. Please try again.')
      }
      return
    }

    let user
    try {
      if (mode === 'signup') {
        const existing = findUserByMobile(mobile)
        user = existing ?? registerUser({ name, mobile, email })
      } else {
        user = findUserByMobile(mobile)
        if (!user) {
          user = registerUser({
            name: displayName || 'Yoga Member',
            mobile,
            email: email || `${mobile}@aathiyoga.com`,
          })
        }
      }
    } catch (err) {
      setVerifying(false)
      setError(err.message || 'Authentication error occurred.')
      return
    }

    setCurrentUser(user)
    showToast(
      mode === 'signup'
        ? `Welcome to Aathi Yoga, ${user.name}! 🙏`
        : `Welcome back, ${user.name}! 🙏`,
      'success'
    )
    navigate('/home', { replace: true })
  }

  return (
    <div className="otp-page">
      <BackButton onClick={handleBack} />
      <div className="otp-page__logo">
        <Logo variant="wordmark" size="md" />
      </div>

      <h1 className="otp-page__title">
        {mode === 'login' && displayName ? `Welcome back, ${displayName}` : 'Verify your Mobile Number'}
      </h1>
      <p className="otp-page__subtitle">
        An OTP (One Time Password) has been sent to <strong>+91 {mobile}</strong>
      </p>

      {demoCode && (
        <p className="otp-page__demo-banner">
          No SMS gateway is connected in this build — your demo code is{' '}
          <strong>{demoCode}</strong>
        </p>
      )}

      <form className="otp-page__form" onSubmit={handleVerify}>
        <OtpBoxes
          value={code}
          onChange={(value) => {
            setCode(value)
            setError('')
          }}
          error={error}
        />
        {error && <p className="otp-page__error">{error}</p>}

        <p className="otp-page__resend">
          {secondsLeft > 0 ? (
            <>Resend OTP in {secondsLeft} seconds</>
          ) : (
            <button type="button" onClick={sendOtp}>
              Resend OTP
            </button>
          )}
        </p>

        <Button type="submit" disabled={verifying}>
          Verify
        </Button>

        <button type="button" className="otp-page__change" onClick={handleBack}>
          Change Number
        </button>
      </form>
    </div>
  )
}

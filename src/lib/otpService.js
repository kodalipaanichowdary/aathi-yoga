const STORAGE_KEY = 'aathi-yoga-otp-pending'
const OTP_LENGTH = 6
const OTP_TTL_MS = 2 * 60 * 1000
export const RESEND_COOLDOWN_S = 30

function generateCode() {
  let code = ''
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10)
  }
  return code
}

function readPending() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// No SMS gateway exists in this frontend-only build, so the code is
// generated locally and handed back to the caller to surface on-screen.
export function requestOtp(mobile) {
  const code = generateCode()
  const pending = { mobile, code, expiresAt: Date.now() + OTP_TTL_MS }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending))
  return code
}

export function verifyOtp(mobile, code) {
  const pending = readPending()
  if (!pending || pending.mobile !== mobile) {
    return { success: false, reason: 'not-found' }
  }
  if (Date.now() > pending.expiresAt) {
    return { success: false, reason: 'expired' }
  }
  if (pending.code !== code) {
    return { success: false, reason: 'mismatch' }
  }
  sessionStorage.removeItem(STORAGE_KEY)
  return { success: true }
}

export function clearPendingOtp() {
  sessionStorage.removeItem(STORAGE_KEY)
}

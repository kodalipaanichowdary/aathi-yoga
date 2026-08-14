const MOBILE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidMobile(value) {
  return MOBILE_REGEX.test(value.trim())
}

export function isValidEmail(value) {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidName(value) {
  return value.trim().length >= 2
}

export function formatMobile(value) {
  return `+91 ${value}`
}

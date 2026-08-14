import seedUsers from './users.json'

/**
 * Normalizes a 10-digit mobile number by stripping whitespace and non-digits.
 * @param {string} mobile
 * @returns {string}
 */
export function normalizeMobile(mobile) {
  if (!mobile) return ''
  const cleaned = String(mobile).replace(/\D/g, '')
  // If user included +91 (12 digits), take the last 10 digits
  return cleaned.length > 10 ? cleaned.slice(-10) : cleaned
}

/**
 * Normalizes email address to lowercase and trimmed.
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
  return (email ?? '').trim().toLowerCase()
}

/**
 * Seed users loaded from the internal JSON database file (src/data/users.json).
 */
export const INITIAL_USERS = seedUsers.map((u) => ({
  ...u,
  mobile: normalizeMobile(u.mobile),
  email: normalizeEmail(u.email),
}))

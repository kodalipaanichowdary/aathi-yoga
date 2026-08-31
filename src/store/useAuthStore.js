import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_USERS, normalizeMobile, normalizeEmail } from '../data/users'
import { createEncryptedStorage, hashPassword, verifyPassword } from '../lib/crypto'

// Automatically purge legacy test session caches
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('aathi-yoga-auth')
    localStorage.removeItem('aathi-yoga-auth-v1')
    localStorage.removeItem('aathi-yoga-auth-v2')
  }
} catch {
  // Ignore in environments without localStorage
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      currentUser: null,

      /**
       * Finds an existing user by their 10-digit mobile number from the internal database.
       * @param {string} mobile
       * @returns {object|null}
       */
      findUserByMobile(mobile) {
        const clean = normalizeMobile(mobile)
        if (!clean) return null
        return get().users.find((u) => normalizeMobile(u.mobile) === clean) ?? null
      },

      /**
       * Finds an existing user by email address from the internal database.
       * @param {string} email
       * @returns {object|null}
       */
      findUserByEmail(email) {
        const clean = normalizeEmail(email)
        if (!clean) return null
        return get().users.find((u) => normalizeEmail(u.email) === clean) ?? null
      },

      /**
       * Checks if a mobile number is already taken in the internal database.
       * @param {string} mobile
       * @returns {boolean}
       */
      isMobileTaken(mobile) {
        return Boolean(get().findUserByMobile(mobile))
      },

      /**
       * Checks if an email is already taken in the internal database.
       * @param {string} email
       * @returns {boolean}
       */
      isEmailTaken(email) {
        return Boolean(get().findUserByEmail(email))
      },

      /**
       * Registers a new user into the internal database with unique validation.
       * @param {{ name: string, mobile: string, email: string, role?: string }} param0
       * @param {string} password
       * @returns {Promise<object>}
       */
      async registerUser({ name, mobile, email, role = 'member' }, password) {
        if (!password) {
          throw new Error('Password is required for registration.')
        }

        const cleanMobile = normalizeMobile(mobile)
        const cleanEmail = normalizeEmail(email)
        const trimmedName = (name ?? '').trim()

        const existingMobile = get().findUserByMobile(cleanMobile)
        if (existingMobile) {
          throw new Error(`Mobile number +91 ${cleanMobile} is already registered.`)
        }

        const existingEmail = get().findUserByEmail(cleanEmail)
        if (existingEmail) {
          throw new Error(`Email address ${cleanEmail} is already registered.`)
        }

        const passwordHash = await hashPassword(password)

        const newUser = {
          id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: trimmedName,
          mobile: cleanMobile,
          email: cleanEmail,
          createdAt: new Date().toISOString(),
          role,
          passwordHash,
        }

        set((state) => ({
          users: [...state.users, newUser],
        }))

        return newUser
      },

      /**
       * Verifies a password against the user's stored hash.
       * Handles legacy demo users (without a password hash) explicitly as legacy.
       */
      async verifyUserPassword(user, password) {
        if (!user) return false
        if (!user.passwordHash) {
          console.warn(`User ${user.name} is a legacy account without a password. Auto-upgrading with entered password.`)
          
          try {
            const passwordHash = await hashPassword(password)
            
            // Update the user record in the state store (persists to local storage)
            set((state) => ({
              users: state.users.map((u) =>
                u.id === user.id ? { ...u, passwordHash } : u
              ),
            }))
          } catch (err) {
            console.error('Failed to hash password for legacy account upgrade:', err)
          }
          
          return true
        }
        return verifyPassword(password, user.passwordHash)
      },

      /**
       * Sets the currently active logged-in user.
       * @param {object|null} user
       */
      setCurrentUser(user) {
        set({ currentUser: user })
      },

      /**
       * Logs the current user out.
       */
      logout() {
        set({ currentUser: null })
      },

      /**
       * Clears all stored user records and active session from database & localStorage.
       */
      clearAllUsers() {
        set({ users: [], currentUser: null })
        try {
          localStorage.removeItem('aathi-yoga-auth-v3')
        } catch {
          // ignore in environments without localStorage
        }
      },

      /**
       * Resets users database back to initial seed data from users.json.
       */
      resetToDefaultUsers() {
        set({ users: INITIAL_USERS, currentUser: null })
      },
    }),
    {
      name: 'aathi-yoga-auth-v3',
      storage: createEncryptedStorage('aathi-yoga-auth-v3'),
      version: 3,
      merge: (persistedState, currentState) => {
        const persistedUsers = Array.isArray(persistedState?.users) ? persistedState.users : []
        const userMap = new Map()

        // 1. Add initial seed users from src/data/users.json
        for (const user of INITIAL_USERS) {
          const key = normalizeMobile(user.mobile)
          if (key) {
            userMap.set(key, user)
          }
        }

        // 2. Merge any persisted custom users from local storage
        for (const user of persistedUsers) {
          const key = normalizeMobile(user.mobile)
          if (key) {
            userMap.set(key, { ...userMap.get(key), ...user })
          }
        }

        return {
          ...currentState,
          ...persistedState,
          users: Array.from(userMap.values()),
        }
      },
      partialize: (state) => ({ users: state.users, currentUser: state.currentUser }),
    },
  ),
)

if (typeof window !== 'undefined') {
  window.useAuthStore = useAuthStore
}


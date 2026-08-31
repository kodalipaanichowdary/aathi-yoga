import '@testing-library/jest-dom/vitest'
import { webcrypto } from 'node:crypto'

// Polyfill Web Crypto API for JSDOM in unit test environment (CI validation)
if (typeof window !== 'undefined') {
  if (!window.crypto || !window.crypto.subtle) {
    Object.defineProperty(window, 'crypto', {
      value: webcrypto,
      writable: true,
      configurable: true,
    })
  }
}

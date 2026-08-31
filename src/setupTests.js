import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import nodeCrypto from 'node:crypto'

// Stub the global Web Crypto API for JSDOM in all Vitest tests (prevents subtle crypto failures in CI)
vi.stubGlobal('crypto', nodeCrypto.webcrypto)

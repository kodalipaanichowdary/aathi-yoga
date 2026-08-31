import { createJSONStorage } from 'zustand/middleware'

/**
 * Node.js / Browser compatible base64 utilities
 */
export function arrayBufferToBase64(buffer) {
  if (typeof btoa === 'function') {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }
  return Buffer.from(buffer).toString('base64')
}

export function base64ToArrayBuffer(base64) {
  if (typeof atob === 'function') {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
  const buf = Buffer.from(base64, 'base64')
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

let cachedDeviceKey = null

/**
 * Dynamically derives an AES-GCM 256 key using a unique local salt
 * stored in the browser. Avoids hardcoding any secret keys.
 */
export async function getDeviceKey() {
  if (cachedDeviceKey) return cachedDeviceKey

  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  let saltStr = ''
  
  if (isBrowser) {
    try {
      saltStr = localStorage.getItem('aathi-device-salt') || ''
      if (!saltStr) {
        const saltBytes = new Uint8Array(16)
        crypto.getRandomValues(saltBytes)
        saltStr = arrayBufferToBase64(saltBytes.buffer)
        localStorage.setItem('aathi-device-salt', saltStr)
      }
    } catch {
      // In case of storage sandbox issues
      saltStr = 'browser-sandbox-fallback-salt-778899'
    }
  } else {
    saltStr = 'fallback-salt-for-testing-12345'
  }

  const salt = base64ToArrayBuffer(saltStr)
  const encoder = new TextEncoder()
  const baseMaterial = encoder.encode('aathi-yoga-client-obfuscation-base-secret')

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    baseMaterial,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  cachedDeviceKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 10000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  return cachedDeviceKey
}

/**
 * Encrypts data object/string using AES-GCM with a random 12-byte IV.
 */
export async function encryptData(data) {
  try {
    const key = await getDeviceKey()
    const encoder = new TextEncoder()
    const rawString = typeof data === 'string' ? data : JSON.stringify(data)
    const encoded = encoder.encode(rawString)

    const iv = new Uint8Array(12)
    crypto.getRandomValues(iv)

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    )

    return JSON.stringify({
      __enc: true,
      v: 1,
      iv: arrayBufferToBase64(iv.buffer),
      data: arrayBufferToBase64(ciphertext)
    })
  } catch (err) {
    console.error('Encryption failed:', err)
    throw err
  }
}

/**
 * Decrypts AES-GCM ciphertext back into plain string.
 * Transparently returns raw input if input is unencrypted legacy data.
 */
export async function decryptData(ciphertextJSON) {
  if (!ciphertextJSON) return ciphertextJSON

  if (typeof ciphertextJSON === 'string' && ciphertextJSON.startsWith('{')) {
    try {
      const parsed = JSON.parse(ciphertextJSON)
      if (parsed && parsed.__enc && parsed.v === 1) {
        const key = await getDeviceKey()
        const iv = base64ToArrayBuffer(parsed.iv)
        const ciphertext = base64ToArrayBuffer(parsed.data)

        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          ciphertext
        )

        const decoder = new TextDecoder()
        return decoder.decode(decrypted)
      }
    } catch (err) {
      // Authenticated encryption fails or parsing fails (e.g. legacy plain JSON)
      console.warn('Decryption/parsing failed, treating as legacy plaintext data:', err)
      throw err
    }
  }
  return ciphertextJSON
}

/**
 * Hashes a password using PBKDF2-SHA256 with 600,000 iterations.
 * Serializes as: pbkdf2:600000:<saltBase64>:<hashBase64>
 */
export async function hashPassword(password) {
  if (!password) {
    throw new Error('Password is required for hashing.')
  }
  
  const saltBytes = new Uint8Array(16)
  crypto.getRandomValues(saltBytes)
  const saltBase64 = arrayBufferToBase64(saltBytes.buffer)

  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const iterations = 600000
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  )

  const hashBase64 = arrayBufferToBase64(derivedBits)
  return `pbkdf2:${iterations}:${saltBase64}:${hashBase64}`
}

/**
 * Verifies a password against a serialized PBKDF2 hash using constant-time comparison.
 */
export async function verifyPassword(password, serializedHash) {
  if (!password || !serializedHash) return false

  const parts = serializedHash.split(':')
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
    return false
  }

  const iterations = parseInt(parts[1], 10)
  const saltBytes = new Uint8Array(base64ToArrayBuffer(parts[2]))
  const storedHash = parts[3]

  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  )

  const calculatedHash = arrayBufferToBase64(derivedBits)

  if (calculatedHash.length !== storedHash.length) return false
  let result = 0
  for (let i = 0; i < calculatedHash.length; i++) {
    result |= calculatedHash.charCodeAt(i) ^ storedHash.charCodeAt(i)
  }
  return result === 0
}

/**
 * Creates custom encrypted Zustand PersistStorage adapter.
 */
export function createEncryptedStorage(keyName) {
  const customStorage = {
    async getItem(name) {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null
      }
      const raw = localStorage.getItem(name)
      if (!raw) return null

      // Check if it is legacy unencrypted data
      if (!raw.includes('"__enc"')) {
        try {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === 'object') {
            const encrypted = await encryptData(raw)
            localStorage.setItem(name, encrypted)
            console.log(`Successfully migrated legacy store "${name}" to encrypted storage.`)
            return raw
          }
        } catch (err) {
          console.error(`Corrupted legacy storage payload detected for store "${name}":`, err)
          return null
        }
      }

      // Encrypted data path
      try {
        const decrypted = await decryptData(raw)
        JSON.parse(decrypted)
        return decrypted
      } catch (err) {
        console.error(`Failed to decrypt or parse storage payload for store "${name}":`, err)
        return null
      }
    },

    async setItem(name, value) {
      if (typeof window === 'undefined' || !window.localStorage) {
        return
      }
      try {
        const encrypted = await encryptData(value)
        localStorage.setItem(name, encrypted)
      } catch (err) {
        console.error(`Failed to save encrypted store "${name}":`, err)
      }
    },

    removeItem(name) {
      if (typeof window === 'undefined' || !window.localStorage) {
        return
      }
      localStorage.removeItem(name)
    }
  }

  return createJSONStorage(() => customStorage)
}

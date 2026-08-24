import { describe, it, expect } from 'vitest'
import { transition, BOOKING_STATUS } from './bookingStateMachine'

describe('transition', () => {
  it('rejects an illegal transition (CONFIRMED -> REQUESTED)', () => {
    const result = transition(BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.REQUESTED)
    expect(result.ok).toBe(false)
    expect(result.next).toBe(BOOKING_STATUS.CONFIRMED)
    expect(result.error).toMatch(/cannot transition/i)
  })

  it('allows the REQUESTED -> ACCEPTED -> CONFIRMED chain', () => {
    const step1 = transition(BOOKING_STATUS.REQUESTED, BOOKING_STATUS.ACCEPTED)
    expect(step1).toEqual({ ok: true, next: BOOKING_STATUS.ACCEPTED, error: null })

    const step2 = transition(step1.next, BOOKING_STATUS.CONFIRMED)
    expect(step2).toEqual({ ok: true, next: BOOKING_STATUS.CONFIRMED, error: null })
  })

  it('rejects an unknown event', () => {
    const result = transition(BOOKING_STATUS.REQUESTED, 'NOT_A_REAL_EVENT')
    expect(result.ok).toBe(false)
  })

  it('rejects an unknown current status', () => {
    const result = transition('NOT_A_REAL_STATUS', BOOKING_STATUS.ACCEPTED)
    expect(result.ok).toBe(false)
  })
})

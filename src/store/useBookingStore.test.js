import { describe, it, expect, beforeEach } from 'vitest'
import { useBookingStore } from './useBookingStore'
import { BOOKING_STATUS } from './bookingStateMachine'

const SAMPLE_INPUT = {
  userId: 'usr-1',
  coachId: 'usr-demo-coach-1',
  sessionType: '1:1',
  goal: 'flexibility',
  preferredSlot: { date: '2026-08-20', start: '09:00', end: '10:00' },
}

describe('useBookingStore', () => {
  beforeEach(() => {
    useBookingStore.setState({ bookings: [] })
  })

  it('seeds a REQUESTED booking with a single history entry on request', () => {
    const booking = useBookingStore.getState().requestBooking(SAMPLE_INPUT)

    expect(booking.status).toBe(BOOKING_STATUS.REQUESTED)
    expect(booking.history).toHaveLength(1)
    expect(booking.history[0]).toMatchObject({ event: BOOKING_STATUS.REQUESTED, by: 'usr-1' })
  })

  it('appends to history log correctly on each valid transition', () => {
    const booking = useBookingStore.getState().requestBooking(SAMPLE_INPUT)

    const accept = useBookingStore.getState().transitionBooking(booking.id, BOOKING_STATUS.ACCEPTED, 'usr-demo-coach-1')
    expect(accept.ok).toBe(true)

    const confirm = useBookingStore.getState().transitionBooking(booking.id, BOOKING_STATUS.CONFIRMED, 'usr-1')
    expect(confirm.ok).toBe(true)

    const stored = useBookingStore.getState().bookings.find((b) => b.id === booking.id)
    expect(stored.status).toBe(BOOKING_STATUS.CONFIRMED)
    expect(stored.history.map((h) => h.event)).toEqual([
      BOOKING_STATUS.REQUESTED,
      BOOKING_STATUS.ACCEPTED,
      BOOKING_STATUS.CONFIRMED,
    ])
  })

  it('rejects an illegal transition and leaves history/status untouched', () => {
    const booking = useBookingStore.getState().requestBooking(SAMPLE_INPUT)

    const illegal = useBookingStore.getState().transitionBooking(booking.id, BOOKING_STATUS.CONFIRMED, 'usr-1')
    expect(illegal.ok).toBe(false)

    const stored = useBookingStore.getState().bookings.find((b) => b.id === booking.id)
    expect(stored.status).toBe(BOOKING_STATUS.REQUESTED)
    expect(stored.history).toHaveLength(1)
  })
})

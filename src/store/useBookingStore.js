import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { transition, BOOKING_STATUS } from './bookingStateMachine'

/**
 * Booking shape:
 * { id, userId, coachId, status, sessionType, goal,
 *   preferredSlot:{date,start,end}, altSlot:{date,start,end}|null,
 *   createdAt, history:[{event,ts,by}] }
 */
export function createBooking({ userId, coachId, sessionType, goal, preferredSlot, altSlot = null }) {
  const now = new Date().toISOString()
  return {
    id: `bkg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    coachId,
    status: BOOKING_STATUS.REQUESTED,
    sessionType,
    goal,
    preferredSlot,
    altSlot,
    createdAt: now,
    history: [{ event: BOOKING_STATUS.REQUESTED, ts: now, by: userId }],
  }
}

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],

      requestBooking(input) {
        const booking = createBooking(input)
        set((state) => ({ bookings: [...state.bookings, booking] }))
        return booking
      },

      transitionBooking(bookingId, event, by) {
        const booking = get().bookings.find((b) => b.id === bookingId)
        if (!booking) {
          return { ok: false, next: null, error: `Unknown booking "${bookingId}"` }
        }

        const result = transition(booking.status, event)
        if (!result.ok) {
          return result
        }

        const ts = new Date().toISOString()
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? { ...b, status: result.next, history: [...b.history, { event, ts, by }] }
              : b,
          ),
        }))

        return result
      },
    }),
    {
      name: 'aathi-yoga-bookings',
      partialize: (state) => ({ bookings: state.bookings }),
    },
  ),
)

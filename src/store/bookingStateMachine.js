export const BOOKING_STATUS = Object.freeze({
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  CHANGE_REQ: 'CHANGE_REQ',
  CONFIRMED: 'CONFIRMED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
})

// Event = the status being transitioned to. Table-driven: a transition is
// legal only if it's listed here, so illegal transitions are a lookup miss
// rather than an if/else branch to maintain.
const TRANSITIONS = Object.freeze({
  [BOOKING_STATUS.REQUESTED]: [
    BOOKING_STATUS.ACCEPTED,
    BOOKING_STATUS.CHANGE_REQ,
    BOOKING_STATUS.DECLINED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.EXPIRED,
  ],
  [BOOKING_STATUS.ACCEPTED]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.CHANGE_REQ]: [
    BOOKING_STATUS.ACCEPTED,
    BOOKING_STATUS.DECLINED,
    BOOKING_STATUS.CANCELLED,
  ],
  [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.COMPLETED],
  [BOOKING_STATUS.DECLINED]: [],
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.COMPLETED]: [],
  [BOOKING_STATUS.EXPIRED]: [],
})

/**
 * Pure state transition. No store/side-effect access — callers own persistence.
 * @param {string} current current BOOKING_STATUS value
 * @param {string} event desired next BOOKING_STATUS value
 * @returns {{ok: boolean, next: string, error: string|null}}
 */
export function transition(current, event) {
  const allowed = TRANSITIONS[current]
  if (!allowed) {
    return { ok: false, next: current, error: `Unknown current status "${current}"` }
  }
  if (!Object.values(BOOKING_STATUS).includes(event)) {
    return { ok: false, next: current, error: `Unknown event "${event}"` }
  }
  if (!allowed.includes(event)) {
    return { ok: false, next: current, error: `Cannot transition from ${current} to ${event}` }
  }
  return { ok: true, next: event, error: null }
}

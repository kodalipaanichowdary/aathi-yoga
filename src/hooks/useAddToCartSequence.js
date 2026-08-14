import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Timings for the add-to-cart morph. The whole sequence lands at 420ms, inside
 * the 500ms budget: press -> spinner -> checkmark -> quantity selector.
 *
 * The item is committed to the cart when the checkmark appears (not at the very
 * end), so the cart badge, the toast and the mini-cart slide up *while* the
 * checkmark is still on screen rather than after it.
 */
export const ADD_SEQUENCE = { spinnerMs: 170, checkMs: 250 }
export const ADD_SEQUENCE_TOTAL = ADD_SEQUENCE.spinnerMs + ADD_SEQUENCE.checkMs

/**
 * Drives the three-phase add-to-cart morph. `phase` is 'idle' | 'loading' |
 * 'done'; while it is not 'idle' the caller should keep showing the morphing
 * button so the checkmark is not cut short by the cart state changing.
 */
export function useAddToCartSequence(onCommit) {
  const [phase, setPhase] = useState('idle')
  const timers = useRef([])
  const runningRef = useRef(false)

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const start = useCallback(() => {
    // Guarded on a ref rather than on `phase` so a double-tap inside the same
    // frame can't start two overlapping sequences.
    if (runningRef.current) return
    runningRef.current = true
    setPhase('loading')

    timers.current.push(
      setTimeout(() => {
        onCommit()
        setPhase('done')
      }, ADD_SEQUENCE.spinnerMs),
    )
    timers.current.push(
      setTimeout(() => {
        runningRef.current = false
        setPhase('idle')
      }, ADD_SEQUENCE_TOTAL),
    )
  }, [onCommit])

  return { phase, start, busy: phase !== 'idle' }
}

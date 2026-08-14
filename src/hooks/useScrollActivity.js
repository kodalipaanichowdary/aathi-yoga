import { useEffect, useState } from 'react'

/**
 * True while the page is actively scrolling, false once it has been still for
 * `idleDelay` ms. Used by the floating cart bar to shrink out of the way during
 * a scroll and expand back when the user stops.
 *
 * The listener is passive and only flips a boolean, so it never blocks scroll.
 */
export function useScrollActivity(idleDelay = 200) {
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    let idleTimer

    function handleScroll() {
      setScrolling(true)
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setScrolling(false), idleDelay)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(idleTimer)
    }
  }, [idleDelay])

  return scrolling
}

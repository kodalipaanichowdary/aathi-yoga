/**
 * AATHI YOGA shared motion system.
 *
 * Every animated component in the app pulls its timing from here so the whole
 * product moves on one rhythm. Nothing should hardcode a duration or an easing
 * curve locally — if a new interaction needs a speed that isn't listed, add it
 * to DURATION/SPRING rather than inventing a magic number at the call site.
 *
 * Rhythm (from the design spec):
 *   small interaction (button press, icon)  120-180ms  -> DURATION.tap
 *   card hover                              200-250ms  -> DURATION.hover
 *   bottom sheet open/close                 350-450ms  -> DURATION.sheet / SPRING.sheet
 *   page / section transition               500-700ms  -> DURATION.section
 *   hero reveal                             800ms      -> DURATION.hero
 *   stagger between siblings                 60-80ms   -> STAGGER
 *
 * Only `transform`, `opacity` (and, in two deliberate one-shot cases, `filter`)
 * are animated so the compositor can do the work off the main thread.
 */

export const DURATION = {
  tap: 0.15,
  hover: 0.22,
  sheet: 0.4,
  section: 0.6,
  hero: 0.8,
}

/** Gap between staggered siblings, in seconds (70ms — middle of the 60-80ms band). */
export const STAGGER = 0.07

export const EASE = {
  /** Default out-curve: quick to start, long soft landing. */
  standard: [0.22, 0.61, 0.36, 1],
  /** Expo-out. For hero-scale reveals that should feel effortless. */
  emphasized: [0.16, 1, 0.3, 1],
  /** Symmetric, for crossfades and colour transitions. */
  inOut: [0.45, 0, 0.55, 1],
}

export const SPRING = {
  /** Press/release feedback — stiff and snappy, settles inside ~150ms. */
  press: { type: 'spring', stiffness: 620, damping: 32 },
  /** Sliding indicators (mode pills, nav highlight, category underline). */
  indicator: { type: 'spring', stiffness: 420, damping: 34 },
  /** Bottom sheets / drawers — settles in the 350-450ms band. */
  sheet: { type: 'spring', stiffness: 300, damping: 30 },
  /** Bottom-nav tab lift. */
  nav: { type: 'spring', stiffness: 520, damping: 24 },
  /** Floating bars and pills entering/leaving. */
  bar: { type: 'spring', stiffness: 380, damping: 30 },
}

/**
 * Shared IntersectionObserver config for scroll reveals. `once: true` means an
 * element animates a single time and then stops being observed, so scrolling a
 * long page never re-runs work.
 */
export const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -48px 0px' }

/** Viewport config for elements that gate a *looping* effect on visibility. */
export const VIEWPORT_LIVE = { once: false, amount: 0.2 }

export const TAP = { scale: 0.97 }
export const TAP_FIRM = { scale: 0.94 }

export const HOVER_LIFT = {
  y: -12,
  transition: { duration: DURATION.hover, ease: EASE.standard },
}

export const HOVER_LIFT_SM = {
  y: -4,
  transition: { duration: DURATION.hover, ease: EASE.standard },
}

const sectionTransition = { duration: DURATION.section, ease: EASE.standard }

/**
 * Scroll-reveal variants, keyed by name. Home assigns a *different* one per
 * section so no two blocks arrive the same way:
 *   hero -> fade, categories -> slide, products -> stagger,
 *   membership -> scale, coaching -> slideLeft, diet -> fadeUp, footer -> blur
 */
export const REVEAL = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.hero, ease: EASE.emphasized } },
  },
  slide: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: sectionTransition },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: sectionTransition },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: sectionTransition },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: DURATION.section, ease: EASE.emphasized },
    },
  },
  /**
   * The one place we animate `filter`. It runs once, on a single container, and
   * is skipped entirely under prefers-reduced-motion — an accepted trade for
   * the softer "develops into focus" landing the footer band asks for.
   */
  blur: {
    hidden: { opacity: 0, filter: 'blur(12px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transition: sectionTransition },
  },
  /** Container-only: children opt in with STAGGER_ITEM. */
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.04 } },
  },
}

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: sectionTransition },
}

/**
 * Hero entry choreography. The homepage hero drives its children through this
 * in document order: logo -> greeting -> search -> categories -> CTA cards.
 */
export const HERO_SEQUENCE = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.1 } },
}

export const HERO_ITEM = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.hero, ease: EASE.emphasized },
  },
}

/** Directional slide for one-at-a-time carousels (coaches, product gallery). */
export function slideVariants(distance = 60) {
  return {
    enter: (direction) => ({ opacity: 0, x: direction > 0 ? distance : -distance }),
    center: { opacity: 1, x: 0 },
    exit: (direction) => ({ opacity: 0, x: direction > 0 ? -distance : distance }),
  }
}

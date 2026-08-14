const PATHS = {
  all: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  mat: 'M4 6h16v3H4zM4 10.5h16v3H4zM4 15h16v3H4z',
  bag: 'M7 8V6a5 5 0 0 1 10 0v2h2l1 13H4L5 8h2zm2 0h6V6a3 3 0 0 0-6 0v2z',
  // Bangle band with six beaded studs around the ring.
  bracelet:
    'M12 4a8 8 0 1 0 0.01 0zM12 4l.01 0M18.9 8l.01 0M18.9 16l.01 0M12 20l.01 0M5.1 16l.01 0M5.1 8l.01 0',
  // Beaded loop with a hanging tassel, distinguishing a mala from a closed bracelet.
  mala:
    'M12 4a6 6 0 1 0 0.01 0zM12 4l.01 0M16.2 5.8l.01 0M18 10l.01 0M16.2 14.2l.01 0M12 16l.01 0M7.8 14.2l.01 0M6 10l.01 0M7.8 5.8l.01 0M12 16v5M10.5 21.5h3',
  // Finger-ring band topped with a cut gemstone.
  ring: 'M7 15a5 5 0 1 0 10 0 5 5 0 0 0-10 0zM12 4l3.5 4.5-3.5 3-3.5-3z',
  // Five distinct round beads in a loop — chunkier than the bracelet's studded band.
  rudraksha:
    'M13.6 5a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0zM20.3 9.8a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0zM17.7 17.7a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0zM9.5 17.7a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0zM6.9 9.8a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z',
  // Small deity silhouette on a plinth: head, draped body, base.
  idol: 'M12 3a2 2 0 1 0 0.01 0zM9 8c0-1 1.3-2 3-2s3 1 3 2l1 8H8l1-8zM6 19h12v2H6z',
  // Bail ring, short chain drop, kite-shaped locket.
  pendant: 'M12 3.5a1.5 1.5 0 1 0 0.01 0zM12 5v3M12 8l4 4.5-4 6-4-6z',
  // Mala loop and tassel with a small leaf sprig marking it as tulsi.
  tulasi:
    'M12 5a5.5 5.5 0 1 0 0.01 0zM12 5l.01 0M15.9 6.6l.01 0M17.5 10.5l.01 0M15.9 14.4l.01 0M12 16l.01 0M8.1 14.4l.01 0M6.5 10.5l.01 0M8.1 6.6l.01 0M12 16v5M10.5 21.5h3M10.5 2c0-1 .8-1.8 1.5-2 .7.2 1.5 1 1.5 2s-.8 1.8-1.5 2c-.7-.2-1.5-1-1.5-2z',
}

export default function CategoryIcon({ name, size = 22, className = '' }) {
  const d = PATHS[name] ?? PATHS.bag
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

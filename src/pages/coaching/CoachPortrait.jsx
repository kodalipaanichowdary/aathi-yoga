import './CoachPortrait.css'

const TONES = [
  ['#ead9b8', '#c9924f'],
  ['#cfe3d8', '#3f7a5a'],
  ['#e3d4ea', '#8a5fa6'],
  ['#d8e2ee', '#4c6f9c'],
]

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

/**
 * Circular coach portrait. Renders a real photo when `image` is supplied;
 * otherwise falls back to a consistent illustrated bust on its own colour
 * tone, with the availability dot sitting on the ring either way.
 */
export default function CoachPortrait({ name, image, index = 0, size = 92, online = false, showStatus = true }) {
  const [light, deep] = TONES[index % TONES.length]

  return (
    <div className="coach-portrait-wrap" style={{ width: size, height: size }}>
      {image ? (
        <div className="coach-portrait">
          <img src={image} alt={name} className="coach-portrait__photo" />
        </div>
      ) : (
        <div
          className="coach-portrait"
          style={{ background: `linear-gradient(150deg, ${light} 0%, ${deep}55 100%)` }}
        >
          <svg viewBox="0 0 120 120" className="coach-portrait__figure" aria-hidden="true">
            <circle cx="60" cy="46" r="20" fill={deep} opacity="0.9" />
            <path d="M24 118c0-26 16-42 36-42s36 16 36 42" fill={deep} opacity="0.9" />
          </svg>
          <span className="coach-portrait__initials">{initials(name)}</span>
        </div>
      )}

      {showStatus && (
        <span
          className={`coach-portrait__status ${online ? 'coach-portrait__status--online' : ''}`.trim()}
          title={online ? 'Available now' : 'Offline — booking still open'}
          aria-label={online ? 'Available now' : 'Offline'}
        />
      )}
    </div>
  )
}

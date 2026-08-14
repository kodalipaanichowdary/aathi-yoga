import './Logo.css'

const RING_PATH_ID = 'aathi-yoga-ring-path'

export default function Logo({ variant = 'wordmark', size = 'md', className = '' }) {
  if (variant === 'badge') {
    return <BadgeLogo size={size} className={className} />
  }

  return (
    <div className={`logo-wordmark logo-wordmark--${size} ${className}`.trim()}>
      <span>AATHI</span>
      <span>YOGA</span>
    </div>
  )
}

function BadgeLogo({ size, className }) {
  const cx = 100
  const cy = 100
  const r = 78
  const ringText = 'AATHI YOGA • '.repeat(6)

  return (
    <svg
      className={`logo-badge logo-badge--${size} ${className}`.trim()}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Aathi Yoga"
    >
      <path
        id={RING_PATH_ID}
        d={`M ${cx - r},${cy} a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 ${-r * 2},0`}
        fill="none"
      />
      <circle cx={cx} cy={cy} r={r - 20} className="logo-badge__disc" />
      <text className="logo-badge__ring-text">
        <textPath href={`#${RING_PATH_ID}`} startOffset="2%">
          {ringText}
        </textPath>
      </text>
      <g className="logo-badge__figure" transform={`translate(${cx} ${cy + 10})`}>
        <circle cx="0" cy="-32" r="11" />
        <path d="M-20 18 Q-20 -10 0 -12 Q20 -10 20 18 Q20 32 0 32 Q-20 32 -20 18 Z" />
        <path className="logo-badge__stroke" d="M-28 22 Q-38 8 -32 -4" fill="none" />
        <path className="logo-badge__stroke" d="M28 22 Q38 8 32 -4" fill="none" />
        <path className="logo-badge__stroke" d="M-20 24 Q-6 38 0 24 Q6 38 20 24" fill="none" />
      </g>
    </svg>
  )
}

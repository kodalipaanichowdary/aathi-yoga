import './PoseIllustration.css'

/**
 * Rich, colored flat vector illustrations of yoga poses matching the app's aesthetic.
 * Includes step angle guides when stepIndex is provided.
 */

function WarriorIllustration({ stepIndex = 0, showAngles = true }) {
  return (
    <g className="pose-figure-colored">
      {/* Background shadow/mat anchor */}
      <ellipse cx="100" cy="165" rx="75" ry="6" fill="rgba(0,0,0,0.06)" />

      {/* Angle guide overlays */}
      {showAngles && stepIndex === 0 && (
        <g className="pose-angle-guide" opacity="0.85">
          <line x1="30" y1="72" x2="170" y2="72" stroke="#557338" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="100" cy="72" r="3" fill="#557338" />
          <text x="100" y="62" textAnchor="middle" fill="#557338" fontSize="9" fontWeight="700">180° Arms Extended</text>
        </g>
      )}

      {showAngles && stepIndex === 1 && (
        <g className="pose-angle-guide" opacity="0.85">
          <path d="M 130 115 L 130 148 L 155 148" fill="none" stroke="#557338" strokeWidth="2" strokeDasharray="3 2" />
          <rect x="130" y="138" width="8" height="8" fill="none" stroke="#557338" strokeWidth="1.5" />
          <text x="145" y="134" fill="#557338" fontSize="9" fontWeight="700">90° Knee Bend</text>
        </g>
      )}

      {/* Back leg (left in wide stance) */}
      <path
        d="M 92 108 C 80 120 62 138 48 152 C 45 155 40 156 36 156 C 32 156 30 158 32 161 C 34 163 42 162 48 160 C 58 154 78 132 96 114 Z"
        fill="#3b334a"
      />
      {/* Back Foot (barefoot) */}
      <path d="M 32 158 C 30 159 28 162 30 164 C 33 166 42 164 48 160 Z" fill="#f5c7a5" />

      {/* Front Leg (right in 90deg bend) */}
      <path
        d="M 98 106 C 110 110 125 112 135 116 C 140 118 142 124 141 134 C 140 144 139 152 140 156 C 135 156 128 152 128 142 C 128 132 125 125 112 120 C 102 116 95 112 94 108 Z"
        fill="#342c42"
      />
      {/* Front Foot */}
      <path d="M 138 154 C 140 158 144 162 152 162 C 158 162 162 160 162 158 C 160 156 152 154 142 154 Z" fill="#f5c7a5" />

      {/* Torso & White Tank Top */}
      <path
        d="M 92 68 L 108 68 C 111 78 112 92 108 108 L 92 108 C 88 92 89 78 92 68 Z"
        fill="#f8f9fa"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      {/* Tank top graphic accent */}
      <path d="M 96 85 Q 100 88 104 85" fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" />

      {/* Left Arm (stretched back) */}
      <path
        d="M 92 70 C 78 70 60 70 45 72 C 38 73 34 71 30 73 C 28 74 29 76 33 76 C 40 76 58 75 90 76 Z"
        fill="#f5c7a5"
      />

      {/* Right Arm (stretched forward) */}
      <path
        d="M 108 70 C 122 70 140 70 155 72 C 162 73 166 71 170 73 C 172 74 171 76 167 76 C 160 76 142 75 110 76 Z"
        fill="#f5c7a5"
      />

      {/* Neck */}
      <rect x="97" y="58" width="6" height="12" fill="#f5c7a5" rx="3" />

      {/* Head Profile & Features */}
      <path
        d="M 98 44 C 98 38 103 34 109 36 C 114 38 116 43 115 48 C 114 53 109 56 103 56 C 98 56 98 50 98 44 Z"
        fill="#f5c7a5"
      />
      {/* Face profile facing right */}
      <path d="M 112 44 Q 116 46 113 49" fill="none" stroke="#e0a37e" strokeWidth="1.2" />

      {/* Hair & Top Bun */}
      <path
        d="M 96 46 C 94 38 98 32 106 32 C 109 32 112 34 114 37 C 110 38 106 42 104 48 C 101 48 98 48 96 46 Z"
        fill="#402e24"
      />
      {/* Hair Bun */}
      <ellipse cx="94" cy="34" rx="6" ry="6" fill="#402e24" />
      <path d="M 93 30 Q 95 26 99 29" fill="none" stroke="#2c1e17" strokeWidth="1.5" />
    </g>
  )
}

function MountainIllustration({ stepIndex = 0, showAngles = true }) {
  return (
    <g className="pose-figure-colored">
      <ellipse cx="100" cy="165" rx="40" ry="5" fill="rgba(0,0,0,0.06)" />

      {/* Vertical Alignment Line */}
      {showAngles && (
        <g className="pose-angle-guide" opacity="0.8">
          <line x1="100" y1="20" x2="100" y2="165" stroke="#557338" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="100" y="16" textAnchor="middle" fill="#557338" fontSize="9" fontWeight="700">180° Vertical Line</text>
        </g>
      )}

      {/* Legs (Standing tall together) */}
      <path
        d="M 94 98 L 94 158 C 94 162 90 162 88 162 C 86 162 86 160 88 158 L 91 98 Z"
        fill="#3b334a"
      />
      <path
        d="M 106 98 L 106 158 C 106 162 110 162 112 162 C 114 162 114 160 112 158 L 109 98 Z"
        fill="#342c42"
      />
      {/* Feet */}
      <ellipse cx="88" cy="161" rx="5" ry="3" fill="#f5c7a5" />
      <ellipse cx="112" cy="161" rx="5" ry="3" fill="#f5c7a5" />

      {/* Torso */}
      <path
        d="M 92 60 L 108 60 C 111 72 110 86 107 98 L 93 98 C 90 86 89 72 92 60 Z"
        fill="#f8f9fa"
        stroke="#e5e7eb"
        strokeWidth="1"
      />

      {/* Arms (Resting gracefully at sides or raised depending on step) */}
      {stepIndex === 1 ? (
        <>
          <path d="M 92 62 C 86 48 80 32 76 20 C 78 18 82 20 86 34 L 94 62 Z" fill="#f5c7a5" />
          <path d="M 108 62 C 114 48 120 32 124 20 C 122 18 118 20 114 34 L 106 62 Z" fill="#f5c7a5" />
        </>
      ) : (
        <>
          <path d="M 92 62 C 88 74 86 88 84 104 C 85 107 88 106 89 102 C 91 88 93 75 94 62 Z" fill="#f5c7a5" />
          <path d="M 108 62 C 112 74 114 88 116 104 C 115 107 112 106 111 102 C 109 88 107 75 106 62 Z" fill="#f5c7a5" />
        </>
      )}

      {/* Neck & Head */}
      <rect x="97" y="50" width="6" height="12" fill="#f5c7a5" rx="3" />
      <circle cx="100" cy="40" r="11" fill="#f5c7a5" />
      <path d="M 90 40 C 90 30 96 26 104 26 C 110 26 112 32 110 40 C 106 38 102 38 98 42 Z" fill="#402e24" />
      <ellipse cx="100" cy="24" rx="5" ry="5" fill="#402e24" />
    </g>
  )
}

function ChildIllustration({ showAngles = true }) {
  return (
    <g className="pose-figure-colored">
      <ellipse cx="90" cy="162" rx="75" ry="6" fill="rgba(0,0,0,0.06)" />

      {showAngles && (
        <g className="pose-angle-guide" opacity="0.8">
          <path d="M 40 148 C 70 115 105 110 135 140" fill="none" stroke="#557338" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="85" y="112" textAnchor="middle" fill="#557338" fontSize="9" fontWeight="700">Curved Spine Release</text>
        </g>
      )}

      {/* Kneeling Lower Body */}
      <path
        d="M 115 145 C 130 135 145 138 148 152 C 148 158 135 160 118 160 C 108 160 102 155 105 148 Z"
        fill="#3b334a"
      />
      <ellipse cx="146" cy="154" rx="6" ry="4" fill="#f5c7a5" />

      {/* Folded Torso */}
      <path
        d="M 68 144 C 74 130 92 124 116 132 C 122 135 125 144 120 152 C 105 154 85 152 68 144 Z"
        fill="#f8f9fa"
        stroke="#e5e7eb"
        strokeWidth="1"
      />

      {/* Outstretched Arms */}
      <path
        d="M 65 146 C 52 148 38 152 24 154 C 20 154 20 158 24 158 C 38 158 55 156 68 152 Z"
        fill="#f5c7a5"
      />

      {/* Head Resting Down */}
      <circle cx="58" cy="146" r="10" fill="#f5c7a5" />
      <path d="M 52 140 C 56 134 64 136 68 142 C 64 146 58 146 52 140 Z" fill="#402e24" />
      <ellipse cx="68" cy="136" rx="4" ry="4" fill="#402e24" />
    </g>
  )
}

function TreeIllustration({ stepIndex = 0, showAngles = true }) {
  return (
    <g className="pose-figure-colored">
      <ellipse cx="100" cy="165" rx="45" ry="5" fill="rgba(0,0,0,0.06)" />

      {showAngles && (
        <g className="pose-angle-guide" opacity="0.85">
          <path d="M 100 115 L 126 128 L 105 138" fill="none" stroke="#557338" strokeWidth="2" strokeDasharray="3 2" />
          <text x="135" y="128" fill="#557338" fontSize="9" fontWeight="700">45° Knee Open</text>
        </g>
      )}

      {/* Standing Left Leg */}
      <path d="M 96 98 L 96 158 C 96 162 92 162 90 162 C 88 162 88 160 90 158 L 93 98 Z" fill="#342c42" />
      <ellipse cx="90" cy="161" rx="5" ry="3" fill="#f5c7a5" />

      {/* Bent Right Leg tucked at thigh */}
      <path
        d="M 104 98 C 115 110 126 122 128 128 C 126 132 118 135 106 135 C 102 135 102 130 106 128 C 116 124 114 116 104 104 Z"
        fill="#3b334a"
      />
      <ellipse cx="105" cy="132" rx="4" ry="3" fill="#f5c7a5" />

      {/* Torso */}
      <path
        d="M 92 60 L 108 60 C 111 72 110 86 107 98 L 93 98 C 90 86 89 72 92 60 Z"
        fill="#f8f9fa"
        stroke="#e5e7eb"
        strokeWidth="1"
      />

      {/* Arms: Anjali Mudra / Prayer at Chest OR Raised */}
      {stepIndex === 1 ? (
        <>
          <path d="M 92 62 C 88 44 94 25 99 16 C 101 16 103 25 107 44 L 105 62 Z" fill="#f5c7a5" />
          <path d="M 98 16 L 102 16" stroke="#f5c7a5" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <g>
          <path d="M 92 62 C 88 72 94 80 98 78 C 96 74 94 68 94 62 Z" fill="#f5c7a5" />
          <path d="M 108 62 C 112 72 106 80 102 78 C 104 74 106 68 106 62 Z" fill="#f5c7a5" />
          <ellipse cx="100" cy="76" rx="4" ry="5" fill="#f5c7a5" />
        </g>
      )}

      {/* Head & Hair */}
      <rect x="97" y="50" width="6" height="12" fill="#f5c7a5" rx="3" />
      <circle cx="100" cy="40" r="11" fill="#f5c7a5" />
      <path d="M 90 40 C 90 30 96 26 104 26 C 110 26 112 32 110 40 C 106 38 102 38 98 42 Z" fill="#402e24" />
      <ellipse cx="100" cy="24" rx="5" ry="5" fill="#402e24" />
    </g>
  )
}

function MeditationIllustration({ showAngles = true }) {
  return (
    <g className="pose-figure-colored">
      <ellipse cx="100" cy="162" rx="60" ry="6" fill="rgba(0,0,0,0.06)" />

      {showAngles && (
        <g className="pose-angle-guide" opacity="0.8">
          <line x1="100" y1="35" x2="100" y2="155" stroke="#557338" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="100" y="30" textAnchor="middle" fill="#557338" fontSize="9" fontWeight="700">Aligned Chakras</text>
        </g>
      )}

      {/* Crossed Legs Base */}
      <path
        d="M 60 148 C 55 152 58 158 70 158 C 88 158 112 158 130 158 C 142 158 145 152 140 148 C 130 140 115 136 100 136 C 85 136 70 140 60 148 Z"
        fill="#3b334a"
      />
      <ellipse cx="65" cy="154" rx="5" ry="3" fill="#f5c7a5" />
      <ellipse cx="135" cy="154" rx="5" ry="3" fill="#f5c7a5" />

      {/* Upright Torso */}
      <path
        d="M 90 85 L 110 85 C 114 100 113 120 110 138 L 90 138 C 87 120 86 100 90 85 Z"
        fill="#f8f9fa"
        stroke="#e5e7eb"
        strokeWidth="1"
      />

      {/* Relaxed Arms resting with Chin Mudra on knees */}
      <path d="M 90 88 C 76 96 68 115 64 140 C 66 142 70 142 72 138 C 76 120 82 102 92 88 Z" fill="#f5c7a5" />
      <path d="M 110 88 C 124 96 132 115 136 140 C 134 142 130 142 128 138 C 124 120 118 102 108 88 Z" fill="#f5c7a5" />

      {/* Mudra Hands on knees */}
      <circle cx="66" cy="141" r="3.5" fill="#f5c7a5" />
      <circle cx="134" cy="141" r="3.5" fill="#f5c7a5" />

      {/* Neck & Head with calm expression */}
      <rect x="97" y="72" width="6" height="15" fill="#f5c7a5" rx="3" />
      <circle cx="100" cy="60" r="12" fill="#f5c7a5" />
      {/* Gentle closed eyes */}
      <path d="M 96 61 Q 98 63 100 61" fill="none" stroke="#b47854" strokeWidth="1" />
      <path d="M 101 61 Q 103 63 105 61" fill="none" stroke="#b47854" strokeWidth="1" />

      {/* Hair & Bun */}
      <path d="M 88 60 C 88 48 95 44 105 44 C 112 44 114 50 112 60 C 108 57 102 56 96 62 Z" fill="#402e24" />
      <ellipse cx="100" cy="42" rx="6" ry="5" fill="#402e24" />
    </g>
  )
}

const ILLUSTRATIONS = {
  mountain: MountainIllustration,
  child: ChildIllustration,
  warrior: WarriorIllustration,
  tree: TreeIllustration,
  meditation: MeditationIllustration,
}

export default function PoseIllustration({ name, size = 180, stepIndex = 0, showAngles = true, className = '' }) {
  const Illustration = ILLUSTRATIONS[name] ?? WarriorIllustration
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`pose-illustration ${className}`.trim()}
      role="img"
      aria-label={name}
    >
      <Illustration stepIndex={stepIndex} showAngles={showAngles} />
    </svg>
  )
}


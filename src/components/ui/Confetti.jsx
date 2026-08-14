import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './Confetti.css'

const COLORS = ['#2f6b52', '#b9782f', '#f2b01e', '#c04444', '#4c6f9c']
const CORNERS = [
  { left: '0%', top: '0%' },
  { left: '100%', top: '0%' },
  { left: '0%', top: '100%' },
  { left: '100%', top: '100%' },
]

function buildParticles(count) {
  return Array.from({ length: count }, (_, index) => {
    const corner = CORNERS[index % CORNERS.length]
    const angle = Math.random() * Math.PI * 2
    const distance = 70 + Math.random() * 110
    return {
      id: index,
      corner,
      color: COLORS[index % COLORS.length],
      size: 6 + Math.random() * 6,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      rotate: Math.random() * 360,
      delay: Math.random() * 0.2,
      duration: 1 + Math.random() * 0.5,
    }
  })
}

export default function Confetti({ count = 28 }) {
  const reduceMotion = useReducedMotion()
  const [particles] = useState(() => buildParticles(count))

  // A one-shot burst of moving objects is exactly what reduced-motion is for.
  if (reduceMotion) return null

  return (
    <div className="confetti" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="confetti__piece"
          style={{
            left: particle.corner.left,
            top: particle.corner.top,
            width: particle.size,
            height: particle.size,
            background: particle.color,
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0.6 }}
          animate={{ opacity: 0, x: particle.dx, y: particle.dy, rotate: particle.rotate, scale: 1 }}
          transition={{ duration: particle.duration, delay: particle.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

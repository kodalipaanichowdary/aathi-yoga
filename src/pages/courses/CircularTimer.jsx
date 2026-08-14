import { formatTime } from '../../lib/formatTime'
import './CircularTimer.css'

const VIEW_SIZE = 220
const STROKE_WIDTH = 14
const CENTER = VIEW_SIZE / 2
const RADIUS = (VIEW_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Progress ring for the pose countdown. Pass `children` to place content (the
 * course player puts the pose illustration there) inside the ring instead of the
 * default time readout.
 */
export default function CircularTimer({ remainingSec, durationSec, children }) {
  const fraction = durationSec > 0 ? Math.min(Math.max(remainingSec / durationSec, 0), 1) : 0
  const offset = CIRCUMFERENCE * (1 - fraction)

  return (
    <div className="circular-timer">
      <svg
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        role="img"
        aria-label={`${formatTime(remainingSec)} remaining of ${formatTime(durationSec)}`}
      >
        <circle
          className="circular-timer__track"
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <circle
          className="circular-timer__progress"
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      </svg>
      <div className="circular-timer__label">
        {children ?? (
          <>
            <span className="circular-timer__time">{formatTime(remainingSec)}</span>
            <span className="circular-timer__total">of {formatTime(durationSec)}</span>
          </>
        )}
      </div>
    </div>
  )
}

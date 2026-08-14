import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PoseIllustration from '../../components/icons/PoseIllustration'
import Button from '../../components/ui/Button'
import Confetti from '../../components/ui/Confetti'
import RollingNumber from '../../components/ui/RollingNumber'
import Reveal from '../../components/ui/Reveal'
import { useToast } from '../../components/ui/useToast'
import { getCourseById, getNextCourse } from '../../data/courses'
import { REVEAL, SPRING, STAGGER_ITEM } from '../../lib/motion'
import './SessionComplete.css'

export default function SessionComplete() {
  const { courseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const showToast = useToast()

  const course = getCourseById(courseId)
  const duration = location.state?.duration ?? course?.duration ?? 0
  const calories = location.state?.calories ?? course?.calories ?? 0
  const nextCourse = courseId ? getNextCourse(courseId) : null

  async function handleShare() {
    const text = course
      ? `I just finished "${course.name}" on Aathi Yoga — ${duration} min, ${calories} kcal.`
      : `I just finished a practice on Aathi Yoga — ${duration} min, ${calories} kcal.`

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Aathi Yoga', text })
        return
      }
      await navigator.clipboard.writeText(text)
      showToast('Achievement copied — paste it anywhere you like.', 'success')
    } catch (error) {
      if (error?.name === 'AbortError') return
      showToast('Sharing is not available on this device', 'info')
    }
  }

  return (
    <div className="session-complete">
      <Confetti />

      <motion.div
        className="session-complete__card"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING.sheet}
      >
        <motion.div
          className="session-complete__icon"
          initial={{ scale: 0.6, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...SPRING.sheet, delay: 0.1 }}
        >
          <PoseIllustration name="meditation" size={104} />
        </motion.div>

        <h1>Session Complete!</h1>
        <p className="session-complete__subtitle">
          {course ? `You finished "${course.name}". Great practice today.` : 'Great work on your practice today.'}
        </p>

        <motion.div
          className="session-complete__stats"
          variants={REVEAL.stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="session-complete__stat" variants={STAGGER_ITEM}>
            <span className="session-complete__stat-value">
              <RollingNumber value={duration} /> min
            </span>
            <span className="session-complete__stat-label">Time Completed</span>
          </motion.div>
          <motion.div className="session-complete__stat" variants={STAGGER_ITEM}>
            <span className="session-complete__stat-value">
              <RollingNumber value={calories} /> kcal
            </span>
            <span className="session-complete__stat-label">Calories Burned</span>
          </motion.div>
          {course && (
            <motion.div className="session-complete__stat" variants={STAGGER_ITEM}>
              <span className="session-complete__stat-value">
                <RollingNumber value={course.poses.length} />
              </span>
              <span className="session-complete__stat-label">Poses Completed</span>
            </motion.div>
          )}
        </motion.div>

        <Reveal variant="fadeUp" className="session-complete__actions">
          {nextCourse && (
            <div className="session-complete__continue">
              <p className="session-complete__continue-prompt">Would you like to continue practicing?</p>
              <Button onClick={() => navigate(`/courses/${nextCourse.id}/play`)}>
                Yes &mdash; Start &ldquo;{nextCourse.name}&rdquo;
              </Button>
            </div>
          )}

          <Button variant="outline" className="session-complete__share" onClick={handleShare}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3v11M12 3l-3.6 3.6M12 3l3.6 3.6M5 14v5.5h14V14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Share Achievement
          </Button>

          <Button variant="ghost" onClick={() => navigate('/courses')}>
            Return to Courses
          </Button>
        </Reveal>
      </motion.div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PoseIllustration from '../../components/icons/PoseIllustration'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/useToast'
import { getCourseById } from '../../data/courses'
import { useCourseStore } from '../../store/useCourseStore'
import { DURATION, EASE, SPRING, TAP } from '../../lib/motion'
import { formatSessionTimer } from '../../lib/formatTime'
import CircularTimer from './CircularTimer'
import './CoursePlayer.css'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function stepToPose(course, index, ctx) {
  const safeIndex = clamp(index, 0, course.poses.length - 1)
  ctx.setPoseIndex(safeIndex)
  ctx.setStepIndex(0)
  ctx.setRemainingSec(course.poses[safeIndex].durationSec)
  ctx.setProgress(course.id, safeIndex)
}

function finishCourse(course, ctx) {
  ctx.completeSession(course.id, course.duration, course.calories)
  ctx.navigate(`/courses/${course.id}/complete`, {
    state: { courseId: course.id, duration: course.duration, calories: course.calories },
    replace: true,
  })
}

export default function CoursePlayer() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const course = getCourseById(courseId)

  const getProgress = useCourseStore((state) => state.getProgress)
  const setProgress = useCourseStore((state) => state.setProgress)
  const completeSession = useCourseStore((state) => state.completeSession)

  const initialPoseIndex = course ? clamp(getProgress(course.id), 0, course.poses.length - 1) : 0

  const [poseIndex, setPoseIndex] = useState(initialPoseIndex)
  const [stepIndex, setStepIndex] = useState(0)
  const [remainingSec, setRemainingSec] = useState(
    course ? course.poses[initialPoseIndex].durationSec : 0,
  )
  const [running, setRunning] = useState(true)
  const [viewMode, setViewMode] = useState('illustration') // 'illustration' | 'photo'

  const pose = course ? course.poses[poseIndex] : null
  const isLastStep = pose ? stepIndex === pose.steps.length - 1 : false
  const isLastPose = course ? poseIndex === course.poses.length - 1 : false

  function handleEndSession() {
    if (!course) return
    // Save current pose index progress
    setProgress(course.id, poseIndex)

    const completedPosesCount = poseIndex + 1
    const elapsedSec =
      course.poses.slice(0, poseIndex).reduce((sum, p) => sum + p.durationSec, 0) +
      (course.poses[poseIndex].durationSec - remainingSec)
    const elapsedMinutes = Math.max(1, Math.round(elapsedSec / 60))
    const estimatedCalories = Math.max(5, Math.round((course.calories / course.duration) * elapsedMinutes))

    completeSession(course.id, elapsedMinutes, estimatedCalories)
    showToast(`Progress saved! ${completedPosesCount}/${course.poses.length} poses completed.`, 'success')

    navigate(`/courses/${course.id}/complete`, {
      state: { courseId: course.id, duration: elapsedMinutes, calories: estimatedCalories, partial: true },
      replace: true,
    })
  }

  // Countdown timer tick effect
  useEffect(() => {
    if (!course || !running || remainingSec <= 0) return
    const timer = setInterval(() => {
      setRemainingSec((seconds) => Math.max(seconds - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [course, running, remainingSec])

  // Advance pose when countdown finishes
  useEffect(() => {
    if (!course || !running || remainingSec > 0) return
    const timeout = setTimeout(() => {
      if (poseIndex + 1 >= course.poses.length) {
        finishCourse(course, { completeSession, navigate })
      } else {
        stepToPose(course, poseIndex + 1, { setPoseIndex, setStepIndex, setRemainingSec, setProgress })
      }
    }, 0)
    return () => clearTimeout(timeout)
  }, [course, running, remainingSec, poseIndex, completeSession, navigate, setProgress])

  if (!course) {
    return <Navigate to="/courses" replace />
  }

  function goToPose(index) {
    stepToPose(course, index, { setPoseIndex, setStepIndex, setRemainingSec, setProgress })
  }

  function handleNextStep() {
    if (!isLastStep) {
      setStepIndex((index) => index + 1)
    } else if (poseIndex + 1 < course.poses.length) {
      goToPose(poseIndex + 1)
    } else {
      finishCourse(course, { completeSession, navigate })
    }
  }

  function handleTogglePause() {
    setRunning((wasRunning) => !wasRunning)
  }

  // Format Sanskrit pose name or short name for header
  const poseHeaderTitle = pose.name.split('(')[0].trim()

  return (
    <div className="course-player-screen">
      {/* Top Header */}
      <header className="course-player-top">
        <motion.button
          type="button"
          className="course-player-top__back"
          onClick={handleEndSession}
          whileTap={TAP}
          transition={SPRING.press}
          aria-label="Save and exit"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <h1 className="course-player-top__title">{poseHeaderTitle}</h1>

        <div className="course-player-top__actions">
          <button
            type="button"
            className="course-player-top__view-toggle"
            onClick={() => setViewMode((m) => (m === 'illustration' ? 'photo' : 'illustration'))}
            title="Toggle Illustration / Photo view"
            aria-label="Toggle illustration and photo"
          >
            {viewMode === 'illustration' ? 'Photo' : 'Art'}
          </button>
          <button
            type="button"
            className="course-player-top__end-btn"
            onClick={handleEndSession}
          >
            End
          </button>
        </div>
      </header>

      {/* Prominent Countdown Timer */}
      <div className="course-player-timer-readout">
        <span>{formatSessionTimer(remainingSec)}</span>
      </div>

      {/* Center Circular Stage with Progress Ring & Illustration / Photo */}
      <div className="course-player-stage-wrap">
        <CircularTimer remainingSec={remainingSec} durationSec={pose.durationSec}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${poseIndex}-${viewMode}-${stepIndex}`}
              className="course-player-figure-container"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: DURATION.hover, ease: EASE.standard }}
            >
              {viewMode === 'photo' && pose.image ? (
                <div className="course-player-photo-wrap">
                  <img src={pose.image} alt={pose.name} className="course-player-photo" />
                </div>
              ) : (
                <PoseIllustration
                  name={pose.illustration}
                  size={190}
                  stepIndex={stepIndex}
                  showAngles={true}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CircularTimer>

        {/* Hold Position & Duration Cues */}
        <div className="course-player-hold-label">
          <h3>Hold This Position</h3>
          <span className="course-player-hold-duration">
            | {Math.ceil(pose.durationSec / 60)} mins |
          </span>
        </div>
      </div>

      {/* Transport Controls: Previous, Pause/Play, Next */}
      <div className="course-player-controls-row">
        <motion.button
          type="button"
          className="course-player-ctrl-btn"
          onClick={() => goToPose(poseIndex - 1)}
          disabled={poseIndex === 0}
          whileTap={TAP}
          transition={SPRING.press}
          aria-label="Previous pose"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          className="course-player-ctrl-btn course-player-ctrl-btn--play"
          onClick={handleTogglePause}
          whileTap={{ scale: 0.92 }}
          transition={SPRING.press}
          aria-label={running ? 'Pause timer' : 'Resume timer'}
        >
          {running ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5l12 7-12 7z" />
            </svg>
          )}
        </motion.button>

        <motion.button
          type="button"
          className="course-player-ctrl-btn"
          onClick={() => goToPose(poseIndex + 1)}
          disabled={isLastPose}
          whileTap={TAP}
          transition={SPRING.press}
          aria-label="Next pose"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      {/* Bottom Dark Olive Green Instruction Card */}
      <div className="course-player-instruction-sheet">
        <div className="course-player-instruction-sheet__header">
          <h2 className="course-player-instruction-sheet__title">
            {course.name} (Yoga For Health)
          </h2>
          <span className="course-player-instruction-sheet__badge">
            {course.duration} min
          </span>
        </div>

        {/* Step-by-Step interactive guide matching the screenshot */}
        <div className="course-player-instruction-steps">
          {pose.steps.map((st, i) => {
            const isActive = i === stepIndex
            return (
              <button
                key={i}
                type="button"
                className={`course-player-step-item ${isActive ? 'course-player-step-item--active' : ''}`.trim()}
                onClick={() => setStepIndex(i)}
              >
                <div className="course-player-step-item__top">
                  <span className="course-player-step-item__label">
                    {st.title || `Step ${i + 1}`} :
                  </span>
                  <span className="course-player-step-item__action">
                    {st.action || st.position}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    className="course-player-step-item__detail"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="course-player-step-item__cue">{st.position}</p>
                    {st.breathing && (
                      <div className="course-player-step-item__meta">
                        <span><strong>Breath:</strong> {st.breathing}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </button>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="course-player-instruction-footer">
          <Button
            variant="outline"
            className="course-player-btn-restart"
            onClick={() => setRemainingSec(pose.durationSec)}
          >
            Restart
          </Button>
          <Button
            variant="outline"
            className="course-player-btn-end"
            onClick={handleEndSession}
          >
            End & Save
          </Button>
          <Button
            className="course-player-btn-next"
            onClick={handleNextStep}
          >
            {isLastStep ? (isLastPose ? 'Finish' : 'Next Pose →') : 'Next Step →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

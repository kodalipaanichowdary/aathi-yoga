import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PoseIllustration from '../../components/icons/PoseIllustration'
import Button from '../../components/ui/Button'
import { DIFFICULTIES, getCoursesByDifficulty } from '../../data/courses'
import { useCourseStore } from '../../store/useCourseStore'
import { DURATION, EASE, REVEAL, SPRING, TAP } from '../../lib/motion'
import './CourseCatalog.css'

const cardHover = { duration: DURATION.hover, ease: EASE.standard }

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.section, ease: EASE.standard } },
  hover: { y: -8, transition: cardHover },
}

const THUMB_VARIANTS = {
  visible: { scale: 1, transition: cardHover },
  hover: { scale: 1.06, transition: cardHover },
}

export default function CourseCatalog() {
  const navigate = useNavigate()
  const getProgress = useCourseStore((state) => state.getProgress)
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]?.slug ?? 'beginner')

  const courses = getCoursesByDifficulty(difficulty)

  return (
    <div className="course-catalog">
      <header className="course-catalog__header">
        <h1>Yoga Courses</h1>
        <p>Guided flows with step-by-step pose instructions, at your own pace.</p>
      </header>

      <div className="course-catalog__tabs" role="tablist" aria-label="Difficulty level">
        {DIFFICULTIES.map((level) => {
          const active = difficulty === level.slug
          return (
            <motion.button
              key={level.slug}
              type="button"
              role="tab"
              aria-selected={active}
              className={`course-catalog__tab ${active ? 'course-catalog__tab--active' : ''}`.trim()}
              onClick={() => setDifficulty(level.slug)}
              whileTap={TAP}
            >
              {active && (
                <motion.span
                  layoutId="course-tab-active"
                  className="course-catalog__tab-bg"
                  transition={SPRING.indicator}
                />
              )}
              <span className="course-catalog__tab-label">{level.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Switching level slides the old set out and staggers the new one in. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={difficulty}
          className="course-catalog__grid"
          variants={REVEAL.stagger}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, x: -18, transition: { duration: DURATION.tap, ease: EASE.standard } }}
        >
          {courses.map((course) => {
            const progress = getProgress(course.id)
            const inProgress = progress > 0 && progress < course.poses.length
            const difficultyLabel = DIFFICULTIES.find((level) => level.slug === course.difficulty)?.label

            return (
              <motion.article
                key={course.id}
                className="course-card"
                variants={CARD_VARIANTS}
                whileHover="hover"
              >
                <motion.div className="course-card__thumb" variants={THUMB_VARIANTS}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.name} className="course-card__img" loading="lazy" />
                  ) : (
                    <PoseIllustration name={course.poses[0].illustration} size={92} />
                  )}
                </motion.div>

                <div className="course-card__body">
                  <div className="course-card__top">
                    <h3>{course.name}</h3>
                    <span className={`course-card__badge course-card__badge--${course.difficulty}`}>
                      {difficultyLabel}
                    </span>
                  </div>

                  <p className="course-card__desc">{course.shortDesc}</p>

                  <div className="course-card__meta">
                    <span>{course.duration} min</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{course.calories} kcal</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{course.poses.length} poses</span>
                  </div>

                  {inProgress && (
                    <div className="course-card__progress">
                      <div className="course-card__progress-track">
                        <motion.span
                          className="course-card__progress-fill"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: progress / course.poses.length }}
                          transition={{ duration: DURATION.section, ease: EASE.standard }}
                        />
                      </div>
                      <span>
                        Pose {progress + 1} of {course.poses.length}
                      </span>
                    </div>
                  )}

                  <Button onClick={() => navigate(`/courses/${course.id}/play`)}>
                    {inProgress ? 'Resume' : 'Start'}
                  </Button>
                </div>
              </motion.article>
            )
          })}

          {courses.length === 0 && (
            <p className="course-catalog__empty">No courses available at this level yet.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

import { motion } from 'framer-motion'
import Reveal from '../../components/ui/Reveal'
import MacroBar from '../../components/ui/MacroBar'
import RollingNumber from '../../components/ui/RollingNumber'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { DIET_PLANS } from '../../data/dietPlans'
import { DURATION, EASE, REVEAL, STAGGER_ITEM } from '../../lib/motion'
import './DietPlansPage.css'

const RING_RADIUS = 26
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
/** Ring is full at 3000 kcal, so plans read against a shared scale. */
const RING_SCALE_KCAL = 3000

export default function DietPlansPage() {
  return (
    <div className="diet-page">
      <div className="diet-page__header">
        <h1>Diet Plans</h1>
        <p>Reference nutrition plans to pair with your practice. Talk to a coach for a plan tailored to you.</p>
      </div>

      <div className="diet-page__grid">
        {DIET_PLANS.map((plan) => (
          <Reveal
            key={plan.id}
            as="article"
            variant="fadeUp"
            className="diet-card"
            whileHover={{ y: -4, transition: { duration: DURATION.hover, ease: EASE.standard } }}
          >
            <div className="diet-card__head">
              <div className="diet-card__title">
                <h2 className="diet-card__name">{plan.name}</h2>
                <span className="diet-card__range">{plan.calories}</span>
              </div>
              <CalorieRing kcal={plan.kcal} />
            </div>

            <MacroBar macros={plan.macros} className="diet-card__macros" />

            <div className="diet-card__section">
              <span className="diet-card__label">Daily meals</span>
              <MealList meals={plan.mealPlan} />
            </div>

            <div className="diet-card__section">
              <span className="diet-card__label">Nutrition</span>
              <p>{plan.nutrition}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function MealList({ meals }) {
  const [ref, inView] = useInViewOnce({ once: true, amount: 0.3 })

  return (
    <motion.ul
      ref={ref}
      className="diet-card__meals"
      variants={REVEAL.stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {meals.map((meal) => (
        <motion.li key={meal.slot} variants={STAGGER_ITEM}>
          <span className="diet-card__meal-slot">{meal.slot}</span>
          <span className="diet-card__meal-name">{meal.name}</span>
          <span className="diet-card__meal-kcal">{meal.kcal} kcal</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}

/** Compact calorie dial. The sweep is a one-shot dashoffset ease, not a jump. */
function CalorieRing({ kcal }) {
  const [ref, inView] = useInViewOnce({ once: true, amount: 0.5 })
  const fraction = Math.min(kcal / RING_SCALE_KCAL, 1)

  return (
    <div className="diet-ring" ref={ref}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="diet-ring__track" cx="32" cy="32" r={RING_RADIUS} strokeWidth="7" fill="none" />
        <motion.circle
          className="diet-ring__value"
          cx="32"
          cy="32"
          r={RING_RADIUS}
          strokeWidth="7"
          fill="none"
          strokeDasharray={RING_CIRCUMFERENCE}
          transform="rotate(-90 32 32)"
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          animate={{ strokeDashoffset: inView ? RING_CIRCUMFERENCE * (1 - fraction) : RING_CIRCUMFERENCE }}
          transition={{ duration: DURATION.section, ease: EASE.standard }}
        />
      </svg>
      <span className="diet-ring__label">
        <RollingNumber value={kcal} className="diet-ring__value-text" />
        <em>kcal</em>
      </span>
    </div>
  )
}

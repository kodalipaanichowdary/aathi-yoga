import Button from '../../components/ui/Button'
import RollingNumber from '../../components/ui/RollingNumber'
import Reveal from '../../components/ui/Reveal'
import { useToast } from '../../components/ui/useToast'
import { MEMBERSHIP_PLANS } from '../../data/membership'
import { DURATION, EASE } from '../../lib/motion'
import './MembershipPage.css'

const hoverTransition = { duration: DURATION.hover, ease: EASE.standard }

export default function MembershipPage() {
  const showToast = useToast()

  function handleChoose(plan) {
    showToast(`${plan.label} plan selected — no payment gateway is connected in this demo.`, 'success')
  }

  return (
    <div className="membership-page">
      {/* Tinted wash the glass cards have something to refract. */}
      <div className="membership-page__wash" aria-hidden="true" />

      <div className="membership-page__header">
        <h1>Membership Plans</h1>
        <p>Choose the plan that fits your practice. Cancel or switch anytime.</p>
      </div>

      <div className="membership-page__grid">
        {MEMBERSHIP_PLANS.map((plan) => (
          <Reveal
            key={plan.id}
            variant="scale"
            className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''}`.trim()}
            as="article"
            whileHover={{ y: -6, transition: hoverTransition }}
          >
            {plan.highlight && <span className="plan-card__glow" aria-hidden="true" />}
            {plan.badge && <span className="plan-card__badge">{plan.badge}</span>}

            <h2 className="plan-card__label">{plan.label}</h2>

            <p className="plan-card__price">
              <RollingNumber value={plan.price} prefix="₹" className="plan-card__price-value" />
              <span className="plan-card__period">/ {plan.period}</span>
            </p>

            <FeatureList features={plan.features} />

            <div className="plan-card__cta-wrap">
              {plan.highlight && <span className="plan-card__pulse" aria-hidden="true" />}
              <Button
                variant={plan.highlight ? 'primary' : 'outline'}
                className="plan-card__cta"
                onClick={() => handleChoose(plan)}
              >
                Choose Plan
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function FeatureList({ features }) {
  return (
    <ul className="plan-card__features">
      {features.map((feature) => (
        <li key={feature}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

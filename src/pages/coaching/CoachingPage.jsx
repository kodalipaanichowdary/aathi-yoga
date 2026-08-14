import { COACHES } from '../../data/coaches'
import CoachCarousel from './CoachCarousel'
import './CoachingPage.css'

export default function CoachingPage() {
  return (
    <div className="coaching-page">
      <div className="coaching-page__header">
        <h1>Personal Coaching</h1>
        <p>Work one-on-one with an expert coach to build a practice that fits your goals.</p>
      </div>

      <CoachCarousel coaches={COACHES} />
    </div>
  )
}

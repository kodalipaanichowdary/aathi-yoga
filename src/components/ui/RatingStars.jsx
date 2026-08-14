import './RatingStars.css'

export default function RatingStars({ rating, count }) {
  return (
    <span className="rating-stars">
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#f2b01e"
          d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6z"
        />
      </svg>
      <span className="rating-stars__value">{rating}</span>
      {count != null && <span className="rating-stars__count">({count})</span>}
    </span>
  )
}

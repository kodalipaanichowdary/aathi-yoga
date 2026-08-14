export default function BackButton({ onClick, className = '' }) {
  return (
    <button type="button" className={`auth-form__back ${className}`.trim()} onClick={onClick} aria-label="Go back">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

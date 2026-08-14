import './Field.css'

export default function TextField({ label, error, id, type = 'text', ...rest }) {
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} type={type} className={`field__input ${error ? 'field__input--error' : ''}`.trim()} {...rest} />
      {error && <p className="field__error">{error}</p>}
    </div>
  )
}

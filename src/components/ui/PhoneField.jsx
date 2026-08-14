import './Field.css'

export default function PhoneField({ label, value, onChange, error, id = 'mobile', ...rest }) {
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`field__phone ${error ? 'field__phone--error' : ''}`.trim()}>
        <span className="field__phone-code">+91</span>
        <span className="field__phone-divider" />
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="Mobile Number"
          maxLength={10}
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 10))}
          {...rest}
        />
      </div>
      {error && <p className="field__error">{error}</p>}
    </div>
  )
}

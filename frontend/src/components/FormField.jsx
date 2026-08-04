export default function FormField({
  label,
  icon,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  ...rest
}) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-field__label">{label}</label>
      <div className="form-field__control">
        {icon && <span className="form-field__icon" aria-hidden="true">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-field__input ${icon ? 'form-field__input--with-icon' : ''} ${error ? 'form-field__input--error' : ''}`}
          {...rest}
        />
      </div>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}

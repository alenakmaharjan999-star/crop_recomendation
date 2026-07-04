export default function FormField({
  label,
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
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
        {...rest}
      />
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
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
    <div className="mb-[18px] flex flex-col">
      <label htmlFor={name} className="mb-1.5 text-[0.82rem] font-medium text-slate-700">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'rounded-[10px] border bg-white px-3 py-[11px] text-[0.92rem] text-slate-900 transition duration-150 ease-out placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none',
          error ? 'border-red-400' : 'border-slate-200',
        ].join(' ')}
        {...rest}
      />
      {error && <span className="mt-1 text-[0.78rem] text-red-500">{error}</span>}
    </div>
  );
}
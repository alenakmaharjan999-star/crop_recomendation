export default function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  options,
  ...rest
}) {
  const listId = options ? `${name}-options` : undefined;

  return (
    <div className="mb-5">

      {/* Label */}

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {/* Input */}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        list={listId}
        autoComplete={rest.autoComplete}
        className={`
          w-full
          rounded-lg
          border
          px-4
          py-3
          text-[15px]
          text-slate-800
          placeholder:text-slate-400
          transition-all
          duration-200
          outline-none

          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-emerald-600"
          }

          ${
            disabled
              ? "cursor-not-allowed bg-slate-100 text-slate-500"
              : "bg-white"
          }

          focus:ring-2
          ${
            error
              ? "focus:ring-red-100"
              : "focus:ring-emerald-100"
          }
        `}
        {...rest}
      />

      {options && (
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}

      {/* Error Message */}

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}
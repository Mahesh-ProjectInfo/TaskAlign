export default function SelectField({
  label,
  name,
  options = [],
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  hint,
  placeholder = "Select Option",
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
          {label} {required && <span className="text-status-danger-text ml-0.5">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full h-10 rounded-lg border bg-surface-card px-3 py-2 text-sm text-ink-primary shadow-2xs transition-all focus:border-accent-main focus:ring-2 focus:ring-accent-ring focus:outline-none disabled:bg-surface-muted disabled:text-ink-disabled disabled:cursor-not-allowed ${
          error ? "border-status-danger-border focus:border-status-danger-text focus:ring-status-danger-bg" : "border-border-default hover:border-border-strong"
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === "object" ? opt.value : opt;
          const lbl = typeof opt === "object" ? opt.label : opt;
          return (
            <option key={String(val)} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-status-danger-text">{error}</p>}
      {!error && (helperText || hint) && (
        <p className="mt-1.5 text-xs text-ink-secondary">{helperText || hint}</p>
      )}
    </div>

  );
}


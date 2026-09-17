export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  icon: Icon,
  rightSlot,
  className = "",
  inputClassName = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
          {label} {required && <span className="text-status-danger-text ml-0.5">*</span>}
        </label>
      )}
      <div
        className={`group flex h-11 items-center gap-2.5 rounded-xl border bg-surface-card px-3.5 py-2 text-sm shadow-xs transition-all ${
          error
            ? "border-status-danger-border focus-within:border-status-danger-text focus-within:ring-2 focus-within:ring-status-danger-bg"
            : "border-border-default focus-within:border-accent-main focus-within:ring-2 focus-within:ring-accent-ring hover:border-border-strong"
        } ${disabled ? "bg-surface-muted/80 cursor-not-allowed opacity-75" : ""} ${className}`}
      >
        {Icon && <Icon size={18} className="text-ink-muted shrink-0 group-focus-within:text-primary-500 transition-colors" />}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed ${inputClassName}`}
          {...props}
        />
        {rightSlot}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-status-danger-text">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-ink-secondary">{helperText}</p>}
    </div>
  );

}



export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col">
      <label
        className={`inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-ink-primary select-none ${
          disabled ? "cursor-not-allowed opacity-60" : "hover:text-ink-primary"
        } ${className}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="h-4 w-4 rounded border-border-strong text-primary-500 focus:ring-2 focus:ring-accent-ring focus:ring-offset-1 disabled:cursor-not-allowed transition-colors cursor-pointer accent-primary-500"
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
      {error && <p className="mt-1 text-xs font-medium text-status-danger-text">{error}</p>}
    </div>
  );

}


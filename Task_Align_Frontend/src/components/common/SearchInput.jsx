import { Search, X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  label,
  className = "",
  containerClassName = "",
  ...props
}) {
  const handleClear = () => {
    if (onClear) onClear();
    else if (onChange) onChange({ target: { value: "" } });
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
          {label}
        </label>
      )}
      <div
        className={`group flex h-9 sm:h-10 items-center gap-2 rounded-lg border border-border-default bg-surface-card px-3 py-1.5 shadow-2xs transition-all focus-within:border-accent-main focus-within:ring-2 focus-within:ring-accent-ring hover:border-border-strong ${className}`}
      >
        <Search size={16} className="text-ink-muted shrink-0 group-focus-within:text-accent-main transition-colors" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-ink-muted hover:text-ink-primary focus:outline-none p-0.5 rounded transition-colors shrink-0"
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );

}


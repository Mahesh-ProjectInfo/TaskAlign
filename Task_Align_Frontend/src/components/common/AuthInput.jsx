import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthInput({
  label,
  icon: Icon,
  type = "text",
  error,
  required = false,
  rightSlot,
  ...props
}) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-ink-secondary">
          {label} {required && <span className="text-status-danger-text ml-0.5">*</span>}
        </label>
      )}
      <div
        className={`group flex items-center gap-2.5 rounded-xl border bg-surface-card px-3.5 py-2.5 transition-all focus-within:border-accent-main focus-within:ring-2 focus-within:ring-accent-ring hover:border-border-strong ${error
            ? "border-status-danger-border focus-within:border-status-danger-text focus-within:ring-2 focus-within:ring-status-danger-bg"
            : "border-border-default"
          }`}
      >
        {Icon && <Icon size={18} className="text-ink-muted shrink-0 group-focus-within:text-accent-main transition-colors" />}
        <input
          type={inputType}
          className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-ink-muted transition-colors hover:text-ink-primary p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : (
          rightSlot
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-status-danger-text">{error}</p>}
    </div>

  );
}

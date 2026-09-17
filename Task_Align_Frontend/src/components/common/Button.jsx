import { Loader2 } from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none active:scale-[0.98]";

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-full",
    md: "h-11 px-5 text-sm rounded-full",
    lg: "h-12 px-6 text-base rounded-full",
    hero: "h-12 px-7 text-sm font-semibold rounded-full shadow-md hover:shadow-lg",
    full: "w-full h-11 px-5 text-sm rounded-full",
  };

  const variants = {
    primary:
      "bg-accent-main text-white hover:bg-accent-hover active:bg-sky-800 shadow-sm focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-1 font-semibold",
    heroPill:
      "bg-accent-main text-white hover:bg-accent-hover shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-accent-ring",
    secondary:
      "bg-secondary-soft text-ink-primary border border-border-default hover:bg-border-subtle active:bg-border-default focus-visible:ring-2 focus-visible:ring-accent-ring",
    warm:
      "bg-status-warning-bg text-status-warning-text border border-status-warning-border hover:bg-amber-100 active:bg-amber-200 focus-visible:ring-2 focus-visible:ring-accent-ring",
    outline:
      "bg-transparent text-ink-primary border border-border-strong hover:bg-surface-muted active:bg-secondary-soft/50 focus-visible:ring-2 focus-visible:ring-accent-ring",
    ghost:
      "text-ink-secondary hover:bg-secondary-soft/40 hover:text-ink-primary active:bg-secondary-soft/70 focus-visible:ring-2 focus-visible:ring-accent-ring",
    danger:
      "bg-status-danger-bg text-status-danger-text border border-status-danger-border hover:bg-red-100 active:bg-red-200 focus-visible:ring-2 focus-visible:ring-accent-ring",
    dangerSolid:
      "bg-status-danger-text text-white hover:bg-red-800 active:bg-red-900 shadow-sm focus-visible:ring-2 focus-visible:ring-accent-ring",
    dangerOutline:
      "bg-transparent text-status-danger-text border border-status-danger-border hover:bg-status-danger-bg active:bg-red-100 focus-visible:ring-2 focus-visible:ring-accent-ring",
    red:
      "bg-status-danger-text text-white hover:bg-red-800 active:bg-red-900 shadow-sm focus-visible:ring-2 focus-visible:ring-accent-ring",
    success:
      "bg-status-success-bg text-status-success-text border border-status-success-border hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-accent-ring",
    successOutline:
      "bg-transparent text-status-success-text border border-status-success-border hover:bg-status-success-bg active:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-accent-ring",
    green:
      "bg-status-success-text text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-sm focus-visible:ring-2 focus-visible:ring-accent-ring",
    neutral:
      "bg-surface-muted text-ink-secondary border border-border-subtle hover:bg-border-subtle active:bg-border-default focus-visible:ring-2 focus-visible:ring-accent-ring",
    blue:
      "bg-accent-main text-white hover:bg-accent-hover active:bg-sky-800 shadow-sm focus-visible:ring-2 focus-visible:ring-accent-ring",
    blueOutline:
      "bg-transparent text-accent-main border border-accent-main hover:bg-accent-subtle active:bg-sky-100 focus-visible:ring-2 focus-visible:ring-accent-ring",
    white:
      "bg-white text-[#0284C7] hover:bg-sky-50 border border-white/80 font-bold shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white/50",
    darkTeal:
      "bg-sidebar-bg text-white hover:bg-sidebar-surface active:bg-sidebar-border shadow-sm focus-visible:ring-2 focus-visible:ring-accent-ring",
  };




  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={16} className="shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}

import { Loader2 } from "lucide-react";

export default function AuthButton({
  children,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring active:scale-[0.99]";
  const variants = {
    primary:
      "bg-accent-main text-white shadow-sm hover:bg-accent-hover active:bg-sky-800 font-semibold",
    outline:
      "border border-border-default bg-surface-card text-ink-primary hover:bg-secondary-soft/50 hover:border-border-strong",
    ghost: "text-accent-main hover:bg-accent-subtle hover:text-accent-hover font-medium",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin shrink-0" />}
      {children}
    </button>
  );
}


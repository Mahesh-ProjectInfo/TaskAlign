export default function Button({ variant = "primary", className = "", children, ...rest }) {
  const variants = {
    primary: "ta-btn ta-btn-primary",
    ghost: "ta-btn ta-btn-ghost",
    outline: "ta-btn border border-border bg-surface text-ink hover:bg-muted",
  };
  return (
    <button className={`${variants[variant] || variants.primary} ${className}`} {...rest}>
      {children}
    </button>
  );
}

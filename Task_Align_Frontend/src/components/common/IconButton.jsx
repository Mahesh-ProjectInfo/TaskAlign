export default function IconButton({
  icon: Icon,
  onClick,
  title,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const sizes = {
    sm: "h-7 w-7 rounded-md",
    md: "h-8 w-8 rounded-lg",
    lg: "h-9 w-9 rounded-lg",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const variants = {
    ghost: "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 active:bg-slate-200/60",
    blue: "text-blue-600 hover:bg-blue-50 active:bg-blue-100/70",
    slate: "text-slate-600 hover:bg-slate-100 active:bg-slate-200/60",
    red: "text-red-600 hover:bg-red-50 active:bg-red-100/70",
    emerald: "text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100/70",
    amber: "text-amber-600 hover:bg-amber-50 active:bg-amber-100/70",
  };

  const variantClass = variants[variant] || variants.ghost;
  const sizeClass = sizes[size] || sizes.md;
  const iconSize = iconSizes[size] || 16;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
    </button>
  );
}


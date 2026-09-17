export default function PageHeader({
  title,
  description,
  subtitle,
  icon: Icon,
  actions,
  className = "",
}) {
  const desc = description || subtitle;

  return (
    <div className={`mb-6 space-y-3 ${className}`}>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-start gap-3 min-w-0">
          {Icon && (
            <div className="p-2.5 rounded-2xl bg-secondary-soft text-ink-primary border border-border-default hidden sm:grid place-items-center shrink-0 shadow-xs">
              <Icon size={20} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-ink-primary truncate">{title}</h1>
            {desc && <p className="mt-1 text-sm text-ink-secondary">{desc}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0 sm:self-center">{actions}</div>}
      </header>
    </div>
  );

}

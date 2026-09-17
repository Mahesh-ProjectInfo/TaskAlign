import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found.",
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center text-ink-muted ${className}`}
    >
      <div className="p-3 rounded-xl bg-secondary-soft/60 border border-border-subtle text-ink-muted mb-3 shadow-2xs">
        <Icon size={24} />
      </div>
      <p className="text-sm font-bold text-ink-primary">{title}</p>
      {description && <p className="mt-1 text-xs text-ink-secondary max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );

}


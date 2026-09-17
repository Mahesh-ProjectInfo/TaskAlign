export default function StatusBadge({ status, tone, children, className = "" }) {
  const normalizedKey = String(status || "").toUpperCase().replace(/[\s_-]+/g, "");

  const statusStyles = {
    COMPLETED: "bg-status-success-bg text-status-success-text border-status-success-border",
    ACTIVE: "bg-status-info-bg text-status-info-text border-status-info-border",
    INPROGRESS: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    DRAFT: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    PENDING: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    FAILED: "bg-status-danger-bg text-status-danger-text border-status-danger-border",
  };

  const toneStyles = {
    green: "bg-status-success-bg text-status-success-text border-status-success-border",
    emerald: "bg-status-success-bg text-status-success-text border-status-success-border",
    teal: "bg-status-info-bg text-status-info-text border-status-info-border",
    blue: "bg-status-info-bg text-status-info-text border-status-info-border",
    amber: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    warm: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    red: "bg-status-danger-bg text-status-danger-text border-status-danger-border",
    coral: "bg-status-danger-bg text-status-danger-text border-status-danger-border",
    indigo: "bg-primary-100 text-ink-primary border-primary-200",
    slate: "bg-status-neutral-bg text-status-neutral-text border-status-neutral-border",
  };

  const style =
    (tone && toneStyles[tone]) ||
    (normalizedKey && statusStyles[normalizedKey]) ||
    "bg-status-neutral-bg text-status-neutral-text border-status-neutral-border";

  const raw = children || status || "";
  const displayText =
    typeof raw === "string" && raw.toUpperCase() === raw
      ? raw.charAt(0) + raw.slice(1).toLowerCase().replace(/_/g, " ")
      : raw;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      {displayText}
    </span>
  );
}





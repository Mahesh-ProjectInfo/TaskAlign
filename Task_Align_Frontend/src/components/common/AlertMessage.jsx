import { Sparkles, AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function AlertMessage({
  type = "success",
  title,
  message,
  icon: CustomIcon,
  children,
  className = "",
}) {
  const styles = {
    success: {
      container: "bg-status-success-bg border border-status-success-border text-ink-primary",
      badge: "bg-status-success-text text-white shadow-xs",
      icon: Sparkles,
    },
    error: {
      container: "bg-status-danger-bg border border-status-danger-border text-ink-primary",
      badge: "bg-status-danger-text text-white shadow-xs",
      icon: AlertCircle,
    },
    warning: {
      container: "bg-status-warning-bg border border-status-warning-border text-ink-primary",
      badge: "bg-status-warning-text text-white shadow-xs",
      icon: AlertTriangle,
    },
    info: {
      container: "bg-status-info-bg border border-status-info-border text-ink-primary",
      badge: "bg-status-info-text text-white shadow-xs",
      icon: Info,
    },
  };

  const style = styles[type] || styles.success;
  const Icon = CustomIcon || style.icon;

  return (
    <div className={`rounded-2xl p-4 flex items-start gap-3.5 shadow-xs ${style.container} ${className}`}>
      <div className={`p-2 rounded-xl shrink-0 ${style.badge}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-bold text-sm leading-tight text-ink-primary">{title}</p>}
        {(message || children) && <div className="text-sm opacity-90 mt-0.5 text-ink-secondary">{children || message}</div>}
      </div>
    </div>
  );
}




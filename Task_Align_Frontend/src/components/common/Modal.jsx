import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  open,
  title,
  onClose,
  maxWidth = "max-w-md",
  children,
  footer,
  className = "",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-primary/40 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative w-full ${maxWidth} bg-surface-card rounded-3xl shadow-2xl border border-border-subtle overflow-hidden transition-all duration-200 ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-border-subtle bg-surface-card">
            <h3 className="text-lg font-bold text-ink-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-ink-muted hover:text-ink-primary hover:bg-secondary-soft/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 bg-surface-muted/60 border-t border-border-subtle flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );

}



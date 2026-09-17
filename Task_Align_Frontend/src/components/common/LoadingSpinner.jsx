import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = 24, text, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-ink-muted ${className}`}>
      <Loader2 size={size} className="animate-spin text-primary-500 mb-2" />
      {text && <p className="text-sm font-medium text-ink-secondary">{text}</p>}
    </div>
  );
}



import { X } from "lucide-react";

export default function SkillTag({ label, tone = "blue", onRemove, className = "" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-200/80",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    slate: "bg-slate-100 text-slate-700 border-slate-200/80",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  };

  const styleClass = tones[tone] || tones.blue;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium border ${styleClass} ${className}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-75 focus:outline-none p-0.5 rounded transition-opacity"
          title={`Remove ${label}`}
          aria-label={`Remove ${label}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}


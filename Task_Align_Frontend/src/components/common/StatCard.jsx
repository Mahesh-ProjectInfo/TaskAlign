export default function StatCard({
  icon: Icon,
  title,
  value,
  count,
  description,
  accent = "teal",
  badge = false,
  layout = "horizontal", // 'horizontal' or 'vertical'
  className = "",
}) {
  const displayVal = value !== undefined ? value : count;

  const themes = {
    blue: {
      card: "bg-blue-50/60 border-blue-200/60 hover:border-blue-300 hover:shadow-blue-500/5",
      icon: "bg-blue-100/80 text-blue-700 border border-blue-200/80",
    },
    green: {
      card: "bg-emerald-50/60 border-emerald-200/60 hover:border-emerald-300 hover:shadow-emerald-500/5",
      icon: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/80",
    },
    emerald: {
      card: "bg-emerald-50/60 border-emerald-200/60 hover:border-emerald-300 hover:shadow-emerald-500/5",
      icon: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/80",
    },
    amber: {
      card: "bg-amber-50/60 border-amber-200/60 hover:border-amber-300 hover:shadow-amber-500/5",
      icon: "bg-amber-100/80 text-amber-700 border border-amber-200/80",
    },
    warm: {
      card: "bg-amber-50/60 border-amber-200/60 hover:border-amber-300 hover:shadow-amber-500/5",
      icon: "bg-amber-100/80 text-amber-700 border border-amber-200/80",
    },
    teal: {
      card: "bg-teal-50/60 border-teal-200/60 hover:border-teal-300 hover:shadow-teal-500/5",
      icon: "bg-teal-100/80 text-teal-700 border border-teal-200/80",
    },
    indigo: {
      card: "bg-indigo-50/60 border-indigo-200/60 hover:border-indigo-300 hover:shadow-indigo-500/5",
      icon: "bg-indigo-100/80 text-indigo-700 border border-indigo-200/80",
    },
    violet: {
      card: "bg-violet-50/60 border-violet-200/60 hover:border-violet-300 hover:shadow-violet-500/5",
      icon: "bg-violet-100/80 text-violet-700 border border-violet-200/80",
    },
    purple: {
      card: "bg-purple-50/60 border-purple-200/60 hover:border-purple-300 hover:shadow-purple-500/5",
      icon: "bg-purple-100/80 text-purple-700 border border-purple-200/80",
    },
    sky: {
      card: "bg-sky-50/60 border-sky-200/60 hover:border-sky-300 hover:shadow-sky-500/5",
      icon: "bg-sky-100/80 text-sky-700 border border-sky-200/80",
    },
    cyan: {
      card: "bg-cyan-50/60 border-cyan-200/60 hover:border-cyan-300 hover:shadow-cyan-500/5",
      icon: "bg-cyan-100/80 text-cyan-700 border border-cyan-200/80",
    },
    slate: {
      card: "bg-slate-100/60 border-slate-200 hover:border-slate-300 hover:shadow-slate-500/5",
      icon: "bg-slate-200/80 text-slate-700 border border-slate-300/80",
    },
    coral: {
      card: "bg-rose-50/60 border-rose-200/60 hover:border-rose-300 hover:shadow-rose-500/5",
      icon: "bg-rose-100/80 text-rose-700 border border-rose-200/80",
    },
    primary: {
      card: "bg-blue-50/60 border-blue-200/60 hover:border-blue-300 hover:shadow-blue-500/5",
      icon: "bg-blue-100/80 text-blue-700 border border-blue-200/80",
    },
  };

  const badgeTones = {
    green: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    emerald: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    amber: "bg-amber-100 text-amber-800 border border-amber-300",
    teal: "bg-teal-100 text-teal-800 border border-teal-300",
    blue: "bg-blue-100 text-blue-800 border border-blue-300",
    red: "bg-rose-100 text-rose-800 border border-rose-300",
  };

  const theme = themes[accent] || themes.teal;

  if (layout === "vertical" || badge) {
    return (
      <div className={`rounded-2xl border shadow-xs p-5 transition-all hover:shadow-md ${theme.card} ${className}`}>
        <div className="flex items-center gap-2.5 text-slate-600 mb-2">
          {Icon && (
            <div className={`p-2 rounded-xl shrink-0 ${theme.icon}`}>
              <Icon size={16} />
            </div>
          )}
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 truncate">{title}</p>
        </div>
        {badge ? (
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
              badgeTones[accent] || badgeTones.green
            }`}
          >
            {displayVal}
          </span>
        ) : (
          <p className="text-xl font-bold tracking-tight text-slate-900 truncate">{displayVal}</p>
        )}
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border shadow-xs p-5 flex items-start gap-4 transition-all hover:shadow-md ${theme.card} ${className}`}
    >
      {Icon && (
        <div className={`p-3.5 rounded-2xl shrink-0 ${theme.icon}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 truncate">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1 truncate">{displayVal}</p>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}



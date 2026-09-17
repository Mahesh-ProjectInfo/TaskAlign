import { Info, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HelpGuideSectionCard({
  id,
  title,
  icon: Icon,
  badgeText,
  whatIsIt,
  whyUseful,
  steps,
  importantNotes,
  children,
}) {
  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-2xl border border-border-subtle bg-surface-card p-5 sm:p-6 shadow-xs space-y-5 transition-all hover:border-border-strong hover:shadow-md"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary-soft text-primary-500 border border-border-default shadow-xs">
            {Icon && <Icon size={22} />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink-primary tracking-tight">{title}</h2>
            {badgeText && (
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-secondary-soft text-primary-500 border border-border-default text-[11px] font-bold">
                {badgeText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conceptual Overview: What & Why */}
      {(whatIsIt || whyUseful) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whatIsIt && (
            <div className="rounded-xl bg-surface-app border border-border-subtle p-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Info size={14} className="text-primary-500" />
                What is it?
              </span>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
                {whatIsIt}
              </p>
            </div>
          )}

          {whyUseful && (
            <div className="rounded-xl bg-secondary-soft/40 border border-border-default p-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-500 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-status-success-text" />
                Why is it useful?
              </span>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
                {whyUseful}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Visual Step-by-Step Flow */}
      {steps && steps.length > 0 && (
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
            How do I use it? (Step-by-Step)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-border-subtle bg-surface-card p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-500 text-[11px] font-bold text-white">
                    {idx + 1}
                  </span>
                  {idx < steps.length - 1 && (
                    <ArrowRight
                      size={14}
                      className="hidden lg:block text-ink-muted absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-surface-card rounded-full"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink-primary">{step.title}</h4>
                  <p className="text-[11px] text-ink-secondary leading-snug mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Notes Alert */}
      {importantNotes && (
        <div className="rounded-xl border border-status-warning-border bg-status-warning-bg/40 p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 text-status-warning-text mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-ink-primary">
            <span className="font-bold text-status-warning-text block uppercase tracking-wider text-[11px]">
              Important Note
            </span>
            <p className="leading-relaxed">{importantNotes}</p>
          </div>
        </div>
      )}

      {/* Custom Section Content / Children */}
      {children}
    </div>

  );
}

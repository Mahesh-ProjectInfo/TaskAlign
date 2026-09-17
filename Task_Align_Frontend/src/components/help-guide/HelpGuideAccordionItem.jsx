import { ChevronDown, AlertTriangle, ArrowRight } from "lucide-react";

export default function HelpGuideAccordionItem({
  id,
  title,
  summary,
  icon: Icon,
  badgeText,
  isOpen,
  onToggle,
  steps,
  importantNotes,
  children,
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden scroll-mt-24 ${
        isOpen
          ? "border-[#99CDD8]/80 shadow-md ring-1 ring-[#99CDD8]/20"
          : "border-[#E2E8E4] shadow-xs hover:border-[#99CDD8]/60 hover:shadow-sm"
      }`}
    >
      {/* Accordion Header Bar */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-slate-50/70 focus:outline-none focus:bg-slate-50/90"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-2">
          {/* Soft Pastel Green Icon Container */}
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#DAEBE3] text-[#163C3B] font-semibold shadow-xs">
            {Icon && <Icon size={20} className="stroke-[2.2]" />}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[#163C3B] tracking-tight truncate">
                {title}
              </h3>
              {badgeText && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#DAEBE3]/60 text-[#163C3B] text-[11px] font-bold">
                  {badgeText}
                </span>
              )}
            </div>
            {summary && (
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-snug truncate">
                {summary}
              </p>
            )}
          </div>
        </div>

        {/* Chevron Dropdown Indicator */}
        <div
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 bg-[#DAEBE3]/50 text-[#163C3B]" : "hover:bg-slate-200"
          }`}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      {/* Accordion Expanded Body */}
      {isOpen && (
        <div className="border-t border-[#E2E8E4] p-5 sm:p-6 space-y-5 bg-white">
          {/* Visual Step-by-Step Flow */}
          {steps && steps.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                How do I use it? (Step-by-Step)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl border border-[#E2E8E4] bg-white p-3.5 space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#163C3B] text-[11px] font-bold text-white">
                        {idx + 1}
                      </span>
                      {idx < steps.length - 1 && (
                        <ArrowRight
                          size={14}
                          className="hidden lg:block text-slate-300 absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#1E2421]">{step.title}</h5>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Notes Alert */}
          {importantNotes && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm text-slate-800">
                <span className="font-bold text-amber-900 block uppercase tracking-wider text-[11px]">
                  Important Note
                </span>
                <p className="leading-relaxed text-slate-700">{importantNotes}</p>
              </div>
            </div>
          )}

          {/* Custom Section Content / Children */}
          {children}
        </div>
      )}
    </div>
  );
}

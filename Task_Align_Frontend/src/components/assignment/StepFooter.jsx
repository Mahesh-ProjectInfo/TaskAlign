import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export default function StepFooter({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  nextLabel = "Next",
  nextDisabled = false,
  generate = false,
}) {
  return (
    <div className="sticky bottom-0 -mx-1 mt-6">
      <div className="bg-white/90 backdrop-blur rounded-xl ring-1 ring-slate-100 shadow-sm px-5 py-3 flex items-center justify-between">
        <div>
          {showPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={16} /> Previous
            </button>
          )}
        </div>
        <div>
          {showNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
                nextDisabled
                  ? "bg-blue-300 cursor-not-allowed"
                  : generate
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                    : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {generate ? <Sparkles size={16} /> : null}
              {nextLabel}
              {!generate && <ArrowRight size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

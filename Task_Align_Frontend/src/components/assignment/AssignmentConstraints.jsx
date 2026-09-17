import { TrendingDown, TrendingUp } from "lucide-react";
import StepCard from "./StepCard.jsx";
import InputField from "@/components/common/InputField.jsx";
import { OPTIMIZATION_TYPES } from "./constants.js";
import {
  isValidTotalBudget,
  isValidTimeline,
  isValidWorkingDays,
} from "@/utils/validators.js";

export default function AssignmentConstraints({ draft, onChange, errors = {}, setErrors }) {
  const handleBudgetChange = (e) => {
    const raw = e.target.value;
    let clean = raw.replace(/[^0-9.]/g, "");

    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }

    const splitArr = clean.split(".");
    let integerPart = splitArr[0] || "";
    let decimalPart = splitArr[1];

    if (integerPart.startsWith("0") && integerPart.length > 1) {
      integerPart = integerPart.replace(/^0+/, "");
      if (!integerPart) integerPart = "0";
    }

    if (integerPart.length > 8) {
      integerPart = integerPart.slice(0, 8);
    }
    if (decimalPart !== undefined && decimalPart.length > 2) {
      decimalPart = decimalPart.slice(0, 2);
    }

    clean = decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;

    onChange({ budget: clean });

    if (setErrors) {
      const err = isValidTotalBudget(clean);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.budget = err;
        } else {
          delete next.budget;
        }
        return next;
      });
    }
  };

  const handleTimelineChange = (e) => {
    const raw = e.target.value;
    let clean = raw.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = clean.replace(/^0+/, "");
    }
    if (clean !== "") {
      const num = Number(clean);
      if (num > 100) return;
    }

    onChange({ timeline: clean });

    if (setErrors) {
      const err = isValidTimeline(clean);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.timeline = err;
        } else {
          delete next.timeline;
        }
        return next;
      });
    }
  };

  const handleWorkingDaysChange = (e) => {
    const raw = e.target.value;
    let clean = raw.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = clean.replace(/^0+/, "");
    }
    if (clean !== "") {
      const num = Number(clean);
      if (num > 31) return;
    }

    onChange({ workingDays: clean });

    if (setErrors) {
      const err = isValidWorkingDays(clean);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.workingDays = err;
        } else {
          delete next.workingDays;
        }
        return next;
      });
    }
  };

  return (
    <StepCard
      step={4}
      title="Assignment Constraints & Strategy"
      description="Set financial budget, timeline limits, and choose the optimization objective."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Total Budget (₹)"
            required
            type="text"
            inputMode="decimal"
            value={draft.budget}
            onChange={handleBudgetChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ",", " "].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 500000"
            error={errors.budget}
          />
          <InputField
            label="Timeline (Days)"
            required
            type="text"
            inputMode="numeric"
            maxLength={3}
            value={draft.timeline}
            onChange={handleTimelineChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ".", ",", " "].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 30"
            error={errors.timeline}
          />
          <InputField
            label="Working Days per Month"
            required
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={draft.workingDays}
            onChange={handleWorkingDaysChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ".", ",", " "].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 22"
            error={errors.workingDays}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Optimization Strategy <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChange({ optimizationType: OPTIMIZATION_TYPES.COST })}
              className={`text-left p-5 rounded-xl border transition-all ${
                draft.optimizationType === OPTIMIZATION_TYPES.COST
                  ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    draft.optimizationType === OPTIMIZATION_TYPES.COST
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <TrendingDown size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">{OPTIMIZATION_TYPES.COST}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minimizes total financial cost by assigning the lowest-cost eligible resource to
                each task using the Hungarian algorithm.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChange({ optimizationType: OPTIMIZATION_TYPES.PROFIT })}
              className={`text-left p-5 rounded-xl border transition-all ${
                draft.optimizationType === OPTIMIZATION_TYPES.PROFIT
                  ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    draft.optimizationType === OPTIMIZATION_TYPES.PROFIT
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <TrendingUp size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">{OPTIMIZATION_TYPES.PROFIT}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maximizes savings/profit by solving cost minimization on a profit transformation
                matrix, yielding maximum efficiency.
              </p>
            </button>
          </div>
          {errors.optimizationType && (
            <p className="mt-1.5 text-xs text-red-500">{errors.optimizationType}</p>
          )}
        </div>
      </div>
    </StepCard>
  );
}

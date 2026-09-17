import { Check } from "lucide-react";

export default function Stepper({ steps, current }) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-5 overflow-x-auto">
      <ol className="flex items-center min-w-max gap-2">
        {steps.map((label, i) => {
          const idx = i + 1;
          const isDone = idx < current;
          const isActive = idx === current;
          return (
            <li key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ring-1 transition-colors ${
                    isDone
                      ? "bg-emerald-500 text-white ring-emerald-500"
                      : isActive
                        ? "bg-blue-600 text-white ring-blue-600"
                        : "bg-slate-50 text-slate-500 ring-slate-200"
                  }`}
                >
                  {isDone ? <Check size={16} /> : idx}
                </div>
                <div className="hidden md:block">
                  <p
                    className={`text-xs font-medium ${
                      isActive ? "text-blue-700" : isDone ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    Step {idx}
                  </p>
                  <p
                    className={`text-sm ${isActive ? "text-slate-900 font-semibold" : "text-slate-600"}`}
                  >
                    {label}
                  </p>
                </div>
              </div>
              {idx < steps.length && (
                <div
                  className={`w-8 md:w-12 h-0.5 rounded ${
                    isDone ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

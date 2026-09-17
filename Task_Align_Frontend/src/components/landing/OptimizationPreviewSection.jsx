import { useState } from "react";
import { Check, Sparkles, SlidersHorizontal } from "lucide-react";

export default function OptimizationPreviewSection() {
  const [mode, setMode] = useState("cost"); // 'cost' or 'profit'

  // Interactive Mock Matrix Data for Presentation Purposes
  const resources = [
    { name: "Res-01: Alex Morgan", role: "Senior Full Stack" },
    { name: "Res-02: Priya Sharma", role: "Backend Architect" },
    { name: "Res-03: Chen Wei", role: "UI/UX Specialist" },
    { name: "Res-04: David Miller", role: "QA Automation" },
  ];

  const tasks = [
    { name: "Task A: Auth Engine", skill: "Spring Boot / Security" },
    { name: "Task B: Matrix Solver", skill: "Algorithm / Java" },
    { name: "Task C: Frontend Design", skill: "React / Design Systems" },
    { name: "Task D: Integration Test", skill: "Automation / JUnit" },
  ];

  // Cost mode values (₹)
  const costMatrix = [
    [3800, 4100, 2900, 3500], // Res-01 -> Task C (2900)
    [3100, 4200, 5200, 4500], // Res-02 -> Task A (3100)
    [4500, 2700, 3400, 3800], // Res-03 -> Task B (2700)
    [3600, 3900, 3400, 2200], // Res-04 -> Task D (2200)
  ];

  // Profit mode values (Pts)
  const profitMatrix = [
    [78, 72, 91, 80], // Res-01 -> Task C (91)
    [96, 64, 58, 70], // Res-02 -> Task A (96)
    [68, 92, 76, 72], // Res-03 -> Task B (92)
    [70, 75, 79, 94], // Res-04 -> Task D (94)
  ];

  // Non-diagonal optimal pairing coordinates (row, col)
  const costOptimalPairs = [
    { row: 0, col: 2 }, // Res-01 -> Task C (Frontend Design)
    { row: 1, col: 0 }, // Res-02 -> Task A (Auth Engine)
    { row: 2, col: 1 }, // Res-03 -> Task B (Matrix Solver)
    { row: 3, col: 3 }, // Res-04 -> Task D (Integration Test)
  ];

  const profitOptimalPairs = [
    { row: 0, col: 2 }, // Res-01 -> Task C (91 pts)
    { row: 1, col: 0 }, // Res-02 -> Task A (96 pts)
    { row: 2, col: 1 }, // Res-03 -> Task B (92 pts)
    { row: 3, col: 3 }, // Res-04 -> Task D (94 pts)
  ];

  const currentMatrix = mode === "cost" ? costMatrix : profitMatrix;
  const currentOptimalPairs = mode === "cost" ? costOptimalPairs : profitOptimalPairs;

  const isOptimal = (r, c) => currentOptimalPairs.some((p) => p.row === r && p.col === c);

  return (
    <section
      id="optimization"
      className="py-20 bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-50 border-b border-[#E2E8E4] relative overflow-hidden"
    >
      {/* Background Subtle Ambient Glows */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-sky-200/20 via-blue-200/25 to-slate-200/20 blur-3xl pointer-events-none rounded-full -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-gradient-to-bl from-blue-200/20 via-sky-200/20 to-slate-200/20 blur-3xl pointer-events-none rounded-full -z-10"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7] px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 inline-block mb-3 shadow-2xs">
            Interactive Presentation Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#19211C]">
            Hungarian Matrix Optimization Visualizer
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Visual representation of how the Hungarian Algorithm eliminates conflicts to produce 1-to-1 optimal assignments.
          </p>
        </div>

        {/* Visualizer Outer Box */}
        <div className="rounded-3xl border border-[#E2E8E4] bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E2E8E4]">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20 shrink-0">
                <SlidersHorizontal size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#19211C]">Matrix Optimization Strategy</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Toggle between Cost Minimization and Profit Maximization
                </p>
              </div>
            </div>

            {/* Mode Switcher Pill */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => setMode("cost")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  mode === "cost"
                    ? "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20"
                    : "text-slate-600 hover:text-slate-900 font-semibold"
                }`}
              >
                Cost Minimization (₹)
              </button>
              <button
                type="button"
                onClick={() => setMode("profit")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  mode === "profit"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-600 hover:text-slate-900 font-semibold"
                }`}
              >
                Profit Maximization (Pts)
              </button>
            </div>
          </div>

          {/* Responsive Matrix Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[650px]">
              <thead>
                <tr>
                  <th className="p-3.5 bg-slate-50/90 border border-[#E2E8E4] rounded-tl-2xl text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Resource \ Task
                  </th>
                  {tasks.map((t) => (
                    <th
                      key={t.name}
                      className="p-3.5 bg-slate-50/90 border border-[#E2E8E4] text-xs font-bold text-[#19211C] text-center"
                    >
                      <div className="font-bold">{t.name}</div>
                      <div className="text-[10px] font-semibold text-slate-500 normal-case mt-0.5">
                        {t.skill}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resources.map((res, rIdx) => (
                  <tr key={res.name}>
                    <td className="p-3.5 bg-slate-50/80 border border-slate-200 font-semibold text-xs text-[#19211C]">
                      <div className="font-bold text-[#19211C]">{res.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{res.role}</div>
                    </td>
                    {tasks.map((_, cIdx) => {
                      const val = currentMatrix[rIdx][cIdx];
                      const matched = isOptimal(rIdx, cIdx);

                      return (
                        <td
                          key={cIdx}
                          className={`p-3.5 border text-center transition-all duration-300 relative ${
                            matched
                              ? mode === "cost"
                                ? "bg-gradient-to-br from-sky-50 via-blue-50/90 to-indigo-50 border-2 border-sky-500 shadow-lg shadow-sky-500/15 rounded-2xl ring-4 ring-sky-500/10 scale-[1.03] z-10"
                                : "bg-gradient-to-br from-emerald-50 via-teal-50/90 to-emerald-100/60 border-2 border-emerald-500 shadow-lg shadow-emerald-500/15 rounded-2xl ring-4 ring-emerald-500/10 scale-[1.03] z-10"
                              : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50/80"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                            <span
                              className={`font-bold transition-colors ${
                                matched
                                  ? mode === "cost"
                                    ? "text-sky-950 text-base font-extrabold tracking-tight"
                                    : "text-emerald-950 text-base font-extrabold tracking-tight"
                                  : "text-slate-700 text-sm font-semibold"
                              }`}
                            >
                              {mode === "cost" ? `₹${val.toLocaleString("en-IN")}` : `${val} pts`}
                            </span>
                            {matched && (
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs border ${
                                  mode === "cost"
                                    ? "bg-sky-600 text-white border-sky-400/30"
                                    : "bg-emerald-600 text-white border-emerald-400/30"
                                }`}
                              >
                                <Check size={11} strokeWidth={3} />
                                Optimal Pairing
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrix Execution Results Summary Bar */}
          <div className="mt-6 pt-5 border-t border-[#E2E8E4] flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-2xs">
              <Sparkles size={16} className="text-emerald-600 shrink-0" />
              <span>Hungarian Reduction Complete • Zero Unassigned Tasks</span>
            </div>
            <div className="flex items-center gap-5 text-slate-700">
              <span>
                Optimal Sum:{" "}
                <strong className="text-[#0284C7] font-extrabold text-sm">
                  {mode === "cost" ? "₹10,900" : "373 pts"}
                </strong>
              </span>
              <span>
                Execution Speed:{" "}
                <strong className="text-[#0284C7] font-extrabold text-sm">1.4 ms</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

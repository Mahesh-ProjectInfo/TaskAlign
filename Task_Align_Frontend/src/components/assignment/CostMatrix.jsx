import { TrendingDown, TrendingUp } from "lucide-react";
import { INELIGIBLE_VALUE } from "@/utils/optimization.js";

export default function CostMatrix({
  optimizationType = "COST_MINIMIZATION",
  previewMatrix,
  matrix = [],
  resources = [],
  tasks = [],
  selectedAssignments = new Set(),
  title,
  subtitle,
  isResultScreen = false,
  className = "",
}) {
  const isProfit =
    String(optimizationType).toUpperCase().includes("PROFIT") ||
    String(optimizationType).toUpperCase() === "PROFIT_MAXIMIZATION";

  const matrixTitle = title || (isProfit ? "Profit Matrix" : "Cost Matrix");
  const defaultSubtitle = `Assignment ${isProfit ? "profit" : "cost (Monthly Salary ÷ Working Days × Estimated Days)"}; ${
    isProfit ? (isResultScreen ? "- for ineligible." : "0 for ineligible.") : "999999 for ineligible."
  }`;

  // Extract task headers & row data from backend previewMatrix DTO if available
  const taskNames =
    previewMatrix?.taskNames ||
    tasks.map((t) => t.name || t.title || t.taskName || `Task ${t.id || t.taskId}`);

  const matrixRows =
    previewMatrix?.rows ||
    resources.map((res, rIdx) => ({
      resourceName: res.name || res.resourceName || `Resource ${res.id || res.resourceId}`,
      cells: tasks.map((t, tIdx) => {
        const val = matrix[rIdx]?.[tIdx];
        const selected = selectedAssignments.has(`${res.id || res.resourceId}-${t.id || t.taskId}`);
        return { value: val, selected };
      }),
    }));

  const isEmpty = matrixRows.length === 0 || taskNames.length === 0;

  return (
    <div className={`bg-surface-card rounded-2xl shadow-xs border border-border-subtle p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-secondary-soft text-primary-500 border border-border-default">
          {isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </div>
        <h2 className="text-base font-bold text-ink-primary">{matrixTitle}</h2>
      </div>
      <p className="text-xs text-ink-secondary mb-4">{subtitle || previewMatrix?.description || defaultSubtitle}</p>

      {isEmpty ? (
        <div className="py-8 text-center text-sm text-ink-muted">
          Select resources and tasks to generate the matrix.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-default">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-secondary-soft/80 text-[11px] font-bold uppercase tracking-wider text-ink-primary border-b border-border-default">
              <tr>
                <th className="px-4 py-3.5 min-w-[160px] bg-secondary-soft/50 border-r border-border-default">Resource / Task</th>
                {taskNames.map((tName, idx) => (
                  <th key={idx} className="px-4 py-3.5 whitespace-nowrap border-r border-border-subtle/50">
                    {tName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 bg-surface-card">
              {matrixRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-surface-app/70 transition-colors">
                  <td className="px-4 py-3 font-bold text-ink-primary whitespace-nowrap text-xs sm:text-sm bg-secondary-soft/20 border-r border-border-default">
                    {row.resourceName}
                  </td>
                  {row.cells?.map((cell, cIdx) => {
                    const rawVal = cell.value !== undefined && cell.value !== null ? Number(cell.value) : null;
                    const isRawIneligible =
                      rawVal === null ||
                      rawVal === INELIGIBLE_VALUE ||
                      (isProfit ? rawVal === 0 : rawVal >= 999990);

                    const selected = cell.selected;

                    let displayVal;
                    if (isRawIneligible) {
                      displayVal = isProfit ? (isResultScreen ? "-" : "0") : "999999";
                    } else {
                      displayVal = `₹${rawVal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
                    }

                    return (
                      <td
                        key={cIdx}
                        className={`px-4 py-3 whitespace-nowrap font-medium text-xs sm:text-sm border-r border-border-subtle/40 ${
                          selected
                            ? "bg-accent-subtle text-accent-main font-bold border-l-2 border-l-accent-main"
                            : isRawIneligible
                              ? "text-status-danger-text bg-status-danger-bg/60 font-semibold"
                              : "text-ink-primary"
                        }`}
                      >
                        {displayVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



import { Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export default function OptimizationSummary({
  previewData,
  matrixInput,
  draft = {},
  eligibilityData = [],
  className = "",
}) {
  const totalResources =
    previewData?.totalResources ??
    matrixInput?.skillMatching?.totalAllocatedResources ??
    draft.resources?.length ??
    0;

  const totalTasks =
    previewData?.totalTasks ??
    matrixInput?.skillMatching?.totalTasks ??
    draft.tasks?.length ??
    0;

  const data = Array.isArray(eligibilityData) ? eligibilityData : [];
  const resourcesWithEligible = new Set(data.filter((d) => d.eligible).map((d) => d.resourceId));

  const eligibleResources =
    previewData?.eligibleResources ??
    (resourcesWithEligible.size > 0 ? resourcesWithEligible.size : totalResources);

  const ineligibleResources =
    previewData?.ineligibleResources ??
    Math.max(0, totalResources - eligibleResources);

  const budget = previewData?.budget ?? draft.budget;
  const timeline = previewData?.timelineDays ?? draft.timeline;

  const rawOptType =
    draft.optimizationType ||
    previewData?.optimizationType ||
    matrixInput?.optimizationType ||
    "COST_MINIMIZATION";
  const isProfit = String(rawOptType).toUpperCase().includes("PROFIT");
  const optimizationTypeLabel = isProfit ? "Profit Maximization" : "Cost Minimization";

  const rawStatus =
    previewData?.status ||
    (matrixInput?.isReadyForMatrixGeneration ? "READY_FOR_OPTIMIZATION" : "DRAFT");
  const isReady =
    rawStatus === "READY_FOR_OPTIMIZATION" || Boolean(matrixInput?.isReadyForMatrixGeneration);
  const statusLabel = isReady ? "Ready for Optimization" : "Incomplete Requirements";

  return (
    <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Sparkles size={18} />
        </div>
        <h2 className="text-base font-semibold text-slate-900">Optimization Summary</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
        <div>
          <p className="text-xs text-slate-500">Total Resources</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{totalResources}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Eligible Resources</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{eligibleResources}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Ineligible Resources</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{ineligibleResources}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Tasks</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{totalTasks}</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Budget</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {budget ? `₹${Number(budget).toLocaleString("en-IN")}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Timeline</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {timeline ? `${timeline} Days` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Optimization Type</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{optimizationTypeLabel}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Status</p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              isReady
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            }`}
          >
            {isReady ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}


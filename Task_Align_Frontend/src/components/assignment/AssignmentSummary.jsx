export default function AssignmentSummary({ draft, className = "" }) {
  const {
    name,
    type,
    optimizationType,
    description,
    budget,
    timeline,
    workingDays,
    resources = [],
    tasks = [],
  } = draft || {};

  return (
    <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6 ${className}`}>
      <h2 className="text-base font-semibold text-slate-900">Assignment Summary</h2>
      <p className="text-xs text-slate-500 mb-4">
        Confirm details before running the optimization.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
        <SummaryItem label="Assignment Name" value={name || "—"} />
        <SummaryItem label="Assignment Type" value={type || "—"} />
        <SummaryItem label="Optimization Type" value={optimizationType || "—"} />
        <SummaryItem label="Description" value={description || "—"} />
        <SummaryItem
          label="Budget"
          value={budget ? `₹${Number(budget).toLocaleString("en-IN")}` : "—"}
        />
        <SummaryItem label="Timeline" value={timeline ? `${timeline} Days` : "—"} />
        <SummaryItem label="Working Days / Month" value={workingDays || "—"} />
        <SummaryItem
          label="Total Resources / Tasks"
          value={`${resources.length} / ${tasks.length}`}
        />
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 break-words">{value}</p>
    </div>
  );
}

import DataTable from "@/components/common/DataTable.jsx";

export default function OptimizedAssignmentTable({
  optimizationType = "COST_MINIMIZATION",
  rows = [],
  savedMoneyFor,
  className = "",
}) {
  const isCost =
    !String(optimizationType).toUpperCase().includes("PROFIT") &&
    String(optimizationType).toUpperCase() !== "PROFIT_MAXIMIZATION";

  const columns = [
    {
      key: "resourceName",
      label: "Resource",
      className: "whitespace-nowrap",
      render: (r) => {
        const name = r.resourceName || r.resource || "Resource";
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary-soft text-primary-500 flex items-center justify-center text-xs font-bold shrink-0 border border-border-default">
              {name.charAt(0)}
            </div>
            <span className="font-bold text-ink-primary">{name}</span>
          </div>
        );
      },
    },
    {
      key: "taskName",
      label: "Assigned Task",
      className: "text-ink-primary font-medium",
      render: (r) => r.taskName || r.task || "—",
    },
    {
      key: "role",
      label: "Role",
      className: "text-ink-secondary whitespace-nowrap",
      render: (r) => r.role || "—",
    },
    {
      key: "estimatedDays",
      label: "Estimated Days",
      className: "text-ink-secondary whitespace-nowrap font-medium",
      render: (r) => `${r.estimatedDays ?? r.days ?? 1} Days`,
    },
    ...(isCost
      ? [
          {
            key: "assignedCost",
            label: "Assignment Cost",
            className: "whitespace-nowrap",
            render: (r) => {
              const val = r.assignedCost ?? r.cost ?? 0;
              return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-accent-subtle text-accent-main text-xs font-bold border border-accent-main/30">
                  ₹{Number(val).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              );
            },
          },
        ]
      : [
          {
            key: "assignedCost",
            label: "Cost",
            className: "whitespace-nowrap",
            render: (r) => {
              const val = r.assignedCost ?? r.cost ?? 0;
              return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-accent-subtle text-accent-main text-xs font-bold border border-accent-main/30">
                  ₹{Number(val).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              );
            },
          },
          {
            key: "savedMoney",
            label: "Saved Money",
            className: "whitespace-nowrap",
            render: (r) => {
              const saved = savedMoneyFor ? savedMoneyFor(r) : r.savedMoney || 0;
              return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-status-success-bg text-status-success-text text-xs font-bold border border-status-success-border">
                  ₹{Number(saved).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              );
            },
          },
        ]),
  ];

  return (
    <div className={`bg-surface-card rounded-2xl shadow-xs border border-border-subtle p-5 ${className}`}>
      <div className="mb-4">
        <h2 className="text-base font-bold text-ink-primary">Optimized Assignment</h2>
        <p className="text-xs text-ink-secondary">
          Resource-to-task allocation produced by the Hungarian Algorithm.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        keyField={(r, idx) => `${r.resourceId || idx}-${r.taskId || idx}`}
        emptyTitle="No eligible allocations were produced."
        maxHeight="max-h-[500px]"
      />
    </div>
  );

}


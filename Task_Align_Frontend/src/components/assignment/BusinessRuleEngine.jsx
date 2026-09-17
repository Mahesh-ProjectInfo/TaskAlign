import { Layers, CheckCircle2, XCircle } from "lucide-react";
import DataTable from "@/components/common/DataTable.jsx";
import StatusBadge from "@/components/common/StatusBadge.jsx";

export default function BusinessRuleEngine({ eligibilityData = [], className = "" }) {
  const data = Array.isArray(eligibilityData) ? eligibilityData : [];

  const columns = [
    {
      key: "resourceName",
      label: "Resource",
      className: "font-medium text-ink-primary whitespace-nowrap py-2.5 text-xs sm:text-sm",
      headerClassName: "py-3",
    },
    {
      key: "taskName",
      label: "Task",
      className: "text-ink-secondary whitespace-nowrap py-2.5 text-xs sm:text-sm",
      headerClassName: "py-3",
    },
    {
      key: "status",
      label: "Status",
      className: "whitespace-nowrap py-2.5",
      headerClassName: "py-3",
      render: (row) =>
        row.eligible ? (
          <StatusBadge tone="green" className="gap-1 px-2.5 py-0.5 text-xs font-semibold">
            <CheckCircle2 size={12} className="shrink-0 text-status-success-text" /> Eligible
          </StatusBadge>
        ) : (
          <StatusBadge tone="red" className="gap-1 px-2.5 py-0.5 text-xs font-semibold">
            <XCircle size={12} className="shrink-0 text-status-danger-text" /> Not Eligible
          </StatusBadge>
        ),
    },
    {
      key: "reason",
      label: "Reason",
      className: "text-ink-secondary text-xs leading-relaxed py-2.5 min-w-[200px] break-words",
      headerClassName: "py-3",
    },
  ];

  return (
    <div className={`bg-surface-card rounded-2xl shadow-xs border border-border-subtle p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-secondary-soft text-primary-500 border border-border-default">
          <Layers size={18} />
        </div>
        <h2 className="text-base font-bold text-ink-primary">Business Rule Engine</h2>
      </div>
      <p className="text-xs text-ink-secondary mb-4">
        Compares required task skills with allocated resource skill sets and assignment constraints.
      </p>

      <DataTable
        columns={columns}
        data={data}
        keyField={(r) => `${r.resourceId}-${r.taskId}`}
        emptyTitle="No eligible resources found."
        emptyDescription="No resources match the required task skills and constraint criteria for this assignment."
        maxHeight="max-h-[300px]"
      />
    </div>
  );

}


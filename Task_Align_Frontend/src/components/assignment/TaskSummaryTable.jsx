import { ClipboardList } from "lucide-react";
import DataTable from "@/components/common/DataTable.jsx";
import SkillTag from "@/components/common/SkillTag.jsx";

export default function TaskSummaryTable({ tasks = [], className = "" }) {
  const columns = [
    {
      key: "name",
      label: "Task Name",
      className: "font-medium text-slate-900",
    },
    {
      key: "days",
      label: "Estimated Days",
      className: "text-slate-700 whitespace-nowrap",
      render: (t) => `${t.days} Days`,
    },
    {
      key: "requiredSkills",
      label: "Required Skills",
      render: (t) => (
        <div className="flex flex-wrap gap-1.5">
          {(t.requiredSkills || []).map((s) => (
            <SkillTag key={s} label={s} tone="indigo" />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
          <ClipboardList size={18} />
        </div>
        <h2 className="text-base font-semibold text-slate-900">Task Summary</h2>
      </div>
      <DataTable
        columns={columns}
        data={tasks}
        emptyTitle="No tasks created."
        maxHeight="max-h-[360px]"
      />
    </div>
  );
}

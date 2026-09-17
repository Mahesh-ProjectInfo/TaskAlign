import { Users } from "lucide-react";
import DataTable from "@/components/common/DataTable.jsx";
import SkillTag from "@/components/common/SkillTag.jsx";

export default function SelectedResourceTable({ resources = [], className = "" }) {
  const columns = [
    {
      key: "name",
      label: "Resource",
      className: "font-medium text-slate-900 whitespace-nowrap",
    },
    {
      key: "role",
      label: "Role",
      className: "text-slate-700 whitespace-nowrap",
    },
    {
      key: "salary",
      label: "Monthly Salary",
      className: "text-slate-900 font-medium whitespace-nowrap",
      render: (r) => `₹${Number(r.salary).toLocaleString("en-IN")}`,
    },
    {
      key: "rating",
      label: "Rating",
      className: "whitespace-nowrap text-slate-700",
      render: (r) => Number(r.rating).toFixed(2),
    },
    {
      key: "skills",
      label: "Skills",
      render: (r) => (
        <div className="flex flex-wrap gap-1.5">
          {(r.skills || []).map((s) => (
            <SkillTag key={s} label={s} tone="blue" />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Users size={18} />
        </div>
        <h2 className="text-base font-semibold text-slate-900">Selected Resources</h2>
      </div>
      <DataTable
        columns={columns}
        data={resources}
        emptyTitle="No resources selected."
        maxHeight="max-h-[360px]"
      />
    </div>
  );
}

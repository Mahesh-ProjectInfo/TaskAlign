import { CheckCircle2, XCircle } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge.jsx";

export default function ValidationSummary({ budgetOk = true, timelineOk = true, className = "" }) {
  return (
    <section className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-5 ${className}`}>
      <h2 className="text-base font-semibold text-slate-900 mb-3">Validation Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ValidationRow
          ok={budgetOk}
          label="Budget Validation"
          okLabel="Within Budget"
          failLabel="Budget Exceeded"
        />
        <ValidationRow
          ok={timelineOk}
          label="Timeline Validation"
          okLabel="Within Timeline"
          failLabel="Timeline Exceeded"
        />
        <ValidationRow ok label="Skill Validation" okLabel="Eligible allocations only" />
        <div className="flex items-center justify-between rounded-xl ring-1 ring-slate-100 px-4 py-3 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-sm font-medium text-slate-800">Assignment Status</p>
          </div>
          <StatusBadge tone="green">Completed</StatusBadge>
        </div>
      </div>
    </section>
  );
}

function ValidationRow({ ok, label, okLabel, failLabel }) {
  return (
    <div className="flex items-center justify-between rounded-xl ring-1 ring-slate-100 px-4 py-3 bg-slate-50/40">
      <div className="flex items-center gap-2">
        <div
          className={`p-1.5 rounded-lg ${
            ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
        </div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
      </div>
      <StatusBadge tone={ok ? "green" : "red"}>{ok ? okLabel : failLabel}</StatusBadge>
    </div>
  );
}

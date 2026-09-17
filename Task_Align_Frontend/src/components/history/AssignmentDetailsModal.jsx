import { useEffect } from "react";
import { X, FileText, Sliders, Activity, Users, ListChecks, Sparkles } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge.jsx";

function Section({ icon: Icon, title, children }) {
  return (
    <section className="rounded-xl ring-1 ring-slate-100 bg-white">
      <header className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
          <Icon size={16} />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm text-slate-900">{value ?? "—"}</p>
    </div>
  );
}

function MiniTable({ head, children }) {
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {head.map((h) => (
                <th key={h} className="text-left font-medium px-4 py-2.5 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default function AssignmentDetailsModal({ open, assignment, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !assignment) return null;
  const a = assignment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-50 rounded-2xl shadow-xl ring-1 ring-slate-200 flex flex-col animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{a.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Assignment details (read only)</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={a.status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <Section icon={FileText} title="Assignment Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Assignment Name" value={a.name} />
              <Field label="Assignment Type" value={a.type} />
              <div className="md:col-span-2">
                <Field label="Description" value={a.description} />
              </div>
              <Field label="Optimization Type" value={a.optimization} />
            </div>
          </Section>

          <Section icon={Sliders} title="Assignment Constraints">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Budget" value={a.budget} />
              <Field label="Timeline" value={a.timeline} />
              <Field label="Working Days Per Month" value={a.workingDays} />
            </div>
          </Section>

          <Section icon={Activity} title="Execution Summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Assignment Status" value={a.execution.status} />
              <Field label="Total Cost" value={a.execution.totalCost} />
              <Field label="Total Performance Score" value={a.execution.performanceScore} />
              <Field label="Budget Status" value={a.execution.budgetStatus} />
              <Field label="Timeline Status" value={a.execution.timelineStatus} />
              <Field label="Execution Time" value={a.execution.executionTime} />
            </div>
          </Section>

          <Section icon={Users} title="Resources">
            <MiniTable head={["Resource Name", "Salary", "Performance Rating"]}>
              {a.resources.map((r) => (
                <tr key={r.name} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 text-slate-900 font-medium whitespace-nowrap">
                    {r.name}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{r.salary}</td>
                  <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{r.rating}</td>
                </tr>
              ))}
            </MiniTable>
          </Section>

          <Section icon={ListChecks} title="Tasks">
            <MiniTable head={["Task Name", "Estimated Days"]}>
              {a.tasks.map((t) => (
                <tr key={t.name} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 text-slate-900 font-medium whitespace-nowrap">
                    {t.name}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{t.days} Days</td>
                </tr>
              ))}
            </MiniTable>
          </Section>

          <Section icon={Sparkles} title="Assignment Results">
            {a.results && a.results.length > 0 ? (
              <MiniTable
                head={["Resource", "Assigned Task", "Cost", "Performance Score", "Estimated Days"]}
              >
                {a.results.map((r) => (
                  <tr key={r.resource} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 text-slate-900 font-medium whitespace-nowrap">
                      {r.resource}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{r.task}</td>
                    <td className="px-4 py-2.5 text-slate-900 font-medium whitespace-nowrap">
                      {r.cost}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold ring-1 ring-indigo-100">
                        {r.score}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{r.days} Days</td>
                  </tr>
                ))}
              </MiniTable>
            ) : (
              <p className="text-sm text-slate-500">
                No results generated for this assignment yet.
              </p>
            )}
          </Section>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-white rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

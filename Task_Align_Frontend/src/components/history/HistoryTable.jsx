import { Eye, Trash2, Inbox } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge.jsx";

export default function HistoryTable({ rows, onView, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
      <div className="max-h-[560px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-5 py-3 whitespace-nowrap">Assignment Name</th>
              <th className="text-left font-medium px-5 py-3 whitespace-nowrap">Assignment Type</th>
              <th className="text-left font-medium px-5 py-3 whitespace-nowrap">Status</th>
              <th className="text-left font-medium px-5 py-3 whitespace-nowrap">
                Optimization Type
              </th>
              <th className="text-left font-medium px-5 py-3 whitespace-nowrap">Budget</th>
              <th className="text-left font-medium px-5 py-3 whitespace-nowrap">Timeline</th>
              <th className="text-left font-medium px-5 py-3 whitespace-nowrap">Created Date</th>
              <th className="text-right font-medium px-5 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox size={28} className="text-slate-400" />
                    <p className="text-sm font-medium">No assignments found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                  {r.name}
                </td>
                <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{r.type}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{r.optimization}</td>
                <td className="px-5 py-3.5 text-slate-800 font-medium whitespace-nowrap">
                  {r.budget}
                </td>
                <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{r.timeline}</td>
                <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{r.date}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(r)}
                      title="View"
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 ring-1 ring-transparent hover:ring-blue-100 transition"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(r)}
                      title="Delete"
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 ring-1 ring-transparent hover:ring-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

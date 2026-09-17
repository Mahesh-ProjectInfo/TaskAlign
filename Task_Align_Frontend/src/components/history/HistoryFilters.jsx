import { Search, RotateCcw } from "lucide-react";
import { ASSIGNMENT_TYPE_OPTIONS, STATUS_OPTIONS } from "./data.js";

export default function HistoryFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  onReset,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Assignment Name..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-slate-500 mb-1">Assignment Type</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
          >
            {ASSIGNMENT_TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex items-end">
          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw size={15} /> Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

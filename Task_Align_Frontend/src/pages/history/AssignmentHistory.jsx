import { History, Search, ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader.jsx";
import RecentAssignmentsTable from "@/components/dashboard/RecentAssignmentsTable.jsx";

export default function AssignmentHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentType, setAssignmentType] = useState("All");
  const [status, setStatus] = useState("All");
  const [optimization, setOptimization] = useState("All");

  return (
    <div className="space-y-6 sm:space-y-8 pb-4">
      {/* Page Header */}
      <PageHeader
        icon={History}
        title="Assignment History"
        description="View all previously created assignments."
      />

      {/* =====================================================
          FILTER BOX
          Same style as Resource Management
      ===================================================== */}
      <section className="rounded-[24px] border border-green-500 bg-white px-5 py-6 shadow-sm sm:px-7">

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1.2fr_1fr_1fr]">

          {/* =================================================
              SEARCH ASSIGNMENT
          ================================================= */}
          <div>
            <label className="mb-2 block text-[15px] font-semibold tracking-wide text-neutral-900">
              SEARCH ASSIGNMENT
            </label>

            <div className="relative">

              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B9993]"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="h-[61px] w-full rounded-[24px] border border-[#CBD6D1] bg-white pl-14 pr-5 text-[17px] text-[#263238] outline-none transition placeholder:text-[#96A29D] focus:border-[#1594D0] focus:ring-1 focus:ring-[#1594D0]"
              />

            </div>
          </div>

          {/* =================================================
              ASSIGNMENT TYPE
          ================================================= */}
          <div>
            <label className="mb-2 block text-[15px] font-semibold tracking-wide text-[#101211]">
              ASSIGNMENT TYPE
            </label>

            <div className="relative">

              <select
                value={assignmentType}
                onChange={(e) => setAssignmentType(e.target.value)}
                className="h-[61px] w-full appearance-none rounded-[24px] border border-[#CBD6D1] bg-white px-6 pr-12 text-[17px] text-[#263238] outline-none transition focus:border-[#1594D0] focus:ring-1 focus:ring-[#1594D0]"
              >
                <option value="All">All</option>
                <option value="Software Project Assignment ">Software Project Assignment</option>
                <option value="Manufacturing Job Assignment">Manufacturing Job Assignment</option>
                <option value="Construction Project Assignment">Construction Project Assignment</option>
                <option value="Sales Region Assignment">Sales Region Assignment</option>
              </select>

              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#263238]"
              />

            </div>
          </div>

          {/* =================================================
              STATUS
          ================================================= */}
          <div>
            <label className="mb-2 block text-[15px] font-semibold tracking-wide text-[#0d0f0e]">
              STATUS
            </label>

            <div className="relative">

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-[61px] w-full appearance-none rounded-[24px] border border-[#CBD6D1] bg-white px-6 pr-12 text-[17px] text-[#263238] outline-none transition focus:border-[#1594D0] focus:ring-1 focus:ring-[#1594D0]"
              >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>

              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#263238]"
              />

            </div>
          </div>

          {/* =================================================
              OPTIMIZATION
          ================================================= */}
          <div>
            <label className="mb-2 block text-[15px] font-semibold tracking-wide text-[#090a0a]">
              OPTIMIZATION
            </label>

            <div className="relative">

              <select
                value={optimization}
                onChange={(e) => setOptimization(e.target.value)}
                className="h-[61px] w-full appearance-none rounded-[24px] border border-[#CBD6D1] bg-white px-6 pr-12 text-[17px] text-[#263238] outline-none transition focus:border-[#1594D0] focus:ring-1 focus:ring-[#1594D0]"
              >
                <option value="All">All</option>
                <option value="Cost Optimization">Cost Optimization</option>
                <option value="Profit Optimization">Profit Optimization</option>
              </select>

              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#263238]"
              />

            </div>
          </div>

        </div>
      </section>


      {/* Complete History Table Section */}
      <section className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-ink-primary">
              All Assignments
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Complete record of previously created assignments
            </p>
          </div>
          <div className="p-2 rounded-xl bg-secondary-soft text-primary-500 border border-border-default shrink-0">
            <History size={18} />
          </div>
        </div>

        <div className="overflow-hidden">
         <RecentAssignmentsTable
  emptyTitle="No assignments found."
  searchTerm={searchTerm}
  assignmentType={assignmentType}
  status={status}
  optimization={optimization}
/>
        </div>
      </section>
    </div>
  );

}

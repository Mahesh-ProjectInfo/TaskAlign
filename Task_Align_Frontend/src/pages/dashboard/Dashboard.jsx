import { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  FileEdit,
  Users,
  ListChecks,
  MapPin,
  PieChart as PieChartIcon,
  Briefcase,
  Sparkles,
  LayoutDashboard,
  FileText,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader.jsx";
import StatCard from "@/components/common/StatCard.jsx";
import RecentAssignmentsTable from "@/components/dashboard/RecentAssignmentsTable.jsx";
import { dashboardService } from "@/services/dashboardService.js";
import AssignmentStatusChart from "@/components/dashboard/AssignmentStatusChart.jsx";
import AssignmentTypeChart, { resolveAssignmentTypeName } from "@/components/dashboard/AssignmentTypeChart.jsx";

const TYPE_COLOR_MAP = {
  "Software Project Assignment": {
    bar: "bg-[#8B5CF6] hover:bg-[#7C3AED]",
    label: "bg-purple-50 text-purple-700 font-medium",
  },
  "Manufacturing Job Assignment": {
    bar: "bg-[#3B82F6] hover:bg-[#2563EB]",
    label: "bg-blue-50 text-blue-700 font-medium",
  },
  "Construction Project Assignment": {
    bar: "bg-[#F59E0B] hover:bg-[#D97706]",
    label: "bg-amber-50 text-amber-700 font-medium",
  },
  "Sales Region Assignment": {
    bar: "bg-[#10B981] hover:bg-[#059669]",
    label: "bg-emerald-50 text-emerald-700 font-medium",
  },
};

const INDEX_COLOR_FALLBACKS = [
  { bar: "bg-[#8B5CF6] hover:bg-[#7C3AED]", label: "bg-purple-50 text-purple-700 font-medium" },
  { bar: "bg-[#3B82F6] hover:bg-[#2563EB]", label: "bg-blue-50 text-blue-700 font-medium" },
  { bar: "bg-[#F59E0B] hover:bg-[#D97706]", label: "bg-amber-50 text-amber-700 font-medium" },
  { bar: "bg-[#10B981] hover:bg-[#059669]", label: "bg-emerald-50 text-emerald-700 font-medium" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState(null);
  const [charts, setCharts] = useState(null);

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const summary = await dashboardService.getSummary();

      setCards(summary?.cards || summary || {});
      setCharts(summary?.charts || summary || {});
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleDeleteSuccess = (deletedRow) => {
    if (deletedRow) {
      const rawStatus = String(deletedRow.assignmentStatus || deletedRow.status || "DRAFT").toUpperCase();
      const isCompleted = rawStatus === "COMPLETED";

      setCards((prev) => {
        if (!prev) return prev;
        const newTotal = Math.max(0, (prev.totalAssignments || 0) - 1);
        const newCompleted = isCompleted
          ? Math.max(0, (prev.completedAssignments || 0) - 1)
          : (prev.completedAssignments || 0);
        const newDraft = !isCompleted
          ? Math.max(0, (prev.draftAssignments || 0) - 1)
          : (prev.draftAssignments || 0);
        return {
          ...prev,
          totalAssignments: newTotal,
          completedAssignments: newCompleted,
          draftAssignments: newDraft,
        };
      });

      const rawType = deletedRow.assignmentTypeName || deletedRow.assignmentType || deletedRow.type;
      const resolvedType = resolveAssignmentTypeName(rawType);

      if (resolvedType) {
        setCharts((prev) => {
          if (!prev || !prev.assignmentTypeChart) return prev;
          const updatedTypeChart = prev.assignmentTypeChart.map((item) => {
            if (item.assignmentType === resolvedType) {
              return { ...item, count: Math.max(0, (item.count || 0) - 1) };
            }
            return item;
          });
          return {
            ...prev,
            assignmentTypeChart: updatedTypeChart,
          };
        });
      }
    }

    fetchDashboardData(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      icon: ClipboardList,
      title: "Total Assignments",
      count: cards?.totalAssignments ?? 0,
      description: "All assignments created",
      accent: "blue",
    },
    {
      icon: CheckCircle2,
      title: "Completed Assignments",
      count: cards?.completedAssignments ?? 0,
      description: "Successfully optimized",
      accent: "green",
    },
    {
      icon: FileEdit,
      title: "Draft Assignments",
      count: cards?.draftAssignments ?? 0,
      description: "Waiting for execution",
      accent: "amber",
    },
    {
      icon: Users,
      title: "Resources",
      count: cards?.totalResources ?? 0,
      description: "Available across projects",
      accent: "teal",
    },
    {
      icon: ListChecks,
      title: "Tasks",
      count: cards?.totalTasks ?? 0,
      description: "Created for all assignments",
      accent: "indigo",
    },
    {
      icon: Briefcase,
      title: "Total Roles",
      count: cards?.totalRoles ?? 0,
      description: "Active job roles",
      accent: "violet",
    },
    {
      icon: Sparkles,
      title: "Total Skills",
      count: cards?.totalSkills ?? 0,
      description: "Maintained in Skill Master",
      accent: "sky",
    },
    {
      icon: FileText,
      title: "Total Reports",
      count: cards?.totalReports ?? 0,
      description: "Generated system reports",
      accent: "slate",
    },
  ];

  // --- BAR CHART DATA & LOGIC ---
  const defaultAssignmentTypeChart = [
    { assignmentType: "Software Project Assignment", count: 0 },
    { assignmentType: "Manufacturing Job Assignment", count: 0 },
    { assignmentType: "Construction Project Assignment", count: 0 },
    { assignmentType: "Sales Region Assignment", count: 0 },
  ];

  const barChartData = charts?.assignmentTypeChart?.length > 0
    ? charts.assignmentTypeChart
    : defaultAssignmentTypeChart;

  const totalBarCount = barChartData.reduce((sum, d) => sum + (d.count || d.value || 0), 0);
  const maxBarValue = Math.max(...barChartData.map(d => d.count || d.value || 0), 0);


  // --- PIE (DONUT) CHART DATA & LOGIC (2 Statuses Only) ---
  const completedVal = cards?.completedAssignments || 0;
  const draftVal = cards?.draftAssignments || 0;

  // Fallback data if everything is 0 just so the chart doesn't look broken while empty
  const isDataEmpty = completedVal === 0 && draftVal === 0;

  const rawDonutData = isDataEmpty
    ? [{ label: "No Data", value: 1, color: "#E5E7EB", bg: "bg-gray-200", textColor: "#6B7280" }]
    : [
      { label: "Completed", value: completedVal, color: "#DF4D41", bg: "bg-[#DF4D41]", textColor: "#fff" },
      { label: "Draft", value: draftVal, color: "#FDE6C8", bg: "bg-[#FDE6C8]", textColor: "#000" },
    ].filter(d => d.value > 0); // Only render segments that actually have a value

  const totalDonutValue = rawDonutData.reduce((acc, curr) => acc + curr.value, 0);

  // SVG Math setup
  const r = 74;
  const cx = 100;
  const cy = 100;
  const strokeWidth = 34;
  const circumference = 2 * Math.PI * r;
  // If there's only 1 segment, we don't need a gap. If there are 2, use the 10px gap.
  const gap = rawDonutData.length > 1 ? 10 : 0;
  const startShift = (strokeWidth / 2) + (gap / 2);
  const totalDeduction = strokeWidth + gap;
  let accumulatedPercentage = 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Manage assignments, monitor project statistics, and track resource allocation across projects."
      />

      {loading && (
        <div className="flex items-center justify-center gap-2 py-3 bg-secondary-soft text-primary-500 rounded-xl text-sm font-medium border border-border-default shadow-xs">
          <Loader2 className="animate-spin" size={18} />
          Fetching live backend metrics...
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5 items-stretch">

        {/* LEFT: Bar Chart */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-gray-100 p-6 sm:p-8 xl:col-span-3 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Users className="text-[#8B5CF6]" size={20} />
              <h2 className="text-base sm:text-lg font-medium text-gray-900 tracking-tight">
                Distribution of Assignment Types
              </h2>
            </div>
            <span className="text-gray-500 text-sm">In 2026</span>
          </div>

          <div className="mb-8">
            <p className="text-[#8E8E93] text-[15px] mb-1">Total assignments tracked</p>
            <h3 className="text-[32px] leading-tight font-bold text-gray-900 tracking-tight">
              {cards?.totalAssignments || "0"} Assignments
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 items-end justify-items-center w-full mt-auto min-h-[220px] pt-4">
            {barChartData.map((item, index) => {
              const val = item.count || item.value || 0;
              const pct = totalBarCount > 0 ? Math.round((val / totalBarCount) * 100) : 0;
              const rawLabel = item.assignmentType || item.type || item.label || item.assignmentTypeName || item.name;
              const formattedLabel = resolveAssignmentTypeName(rawLabel) || `Assignment Type ${index + 1}`;
              const colorConfig = TYPE_COLOR_MAP[formattedLabel] || INDEX_COLOR_FALLBACKS[index % INDEX_COLOR_FALLBACKS.length];

              return (
                <div key={index} className="group flex flex-col items-center justify-end w-full h-full cursor-pointer min-w-0">
                  {/* Floating percentage label */}
                  <span className="text-xs sm:text-sm font-bold text-slate-900 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                    {pct}%
                  </span>

                  {/* Bar Height Directly Matching Percentage */}
                  <div
                    className={`w-8 sm:w-11 max-w-full rounded-2xl transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-md ${
                      val > 0
                        ? "bg-gradient-to-t from-[#8B5CF6] to-[#A78BFA] shadow-xs"
                        : "bg-[#8B5CF6]/25 group-hover:bg-[#8B5CF6]/40"
                      }`}
                    style={{ height: val > 0 ? `${Math.max(pct, 12)}%` : '10px' }}
                  />

                  {/* Unified X-Axis Label Badge */}
                  <div className="mt-4 h-12 w-full flex items-center justify-center text-center px-0.5">
                    <span
                      title={formattedLabel}
                      className="text-[11px] sm:text-xs px-2 py-1.5 rounded-xl bg-slate-900 text-white font-medium transition-all duration-300 leading-tight w-full max-w-full text-center line-clamp-2 shadow-2xs group-hover:bg-[#8B5CF6] group-hover:text-white"
                    >
                      {formattedLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>


        </div>


        {/* RIGHT: Dynamic Pie (Donut) Chart for Completed vs Draft */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-gray-100 p-6 sm:p-8 xl:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <MapPin className="text-[#DF4D41]" size={20} fill="#DF4D41" strokeWidth={1} />
              <h2 className="text-[15px] sm:text-base font-medium text-gray-900 tracking-tight">
                Current Assignment Status
              </h2>
            </div>
            <span className="text-[#8E8E93] text-[15px]">Units</span>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row justify-between items-center sm:items-start xl:items-center 2xl:items-start gap-8 flex-1 w-full">

            {/* Legend */}
            <div className="flex flex-col w-full sm:w-auto self-start">
              <span className="text-[#8E8E93] text-[15px] mb-1">Total assignments</span>
              <h3 className="text-[36px] sm:text-[40px] leading-none font-bold text-gray-900 tracking-tight mb-8">
                {isDataEmpty ? "0" : cards?.totalAssignments}
              </h3>

              <div className="space-y-3.5">
                {rawDonutData.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 text-[14px] text-[#8E8E93] font-medium whitespace-nowrap">
                    <div className={`w-3.5 h-3.5 rounded-[4px] shadow-sm ${d.bg}`} />
                    {d.label}
                  </div>
                ))}
              </div>
            </div>

            {/* SVG Donut */}
            <div className="relative w-56 h-56 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                {rawDonutData.map((d, i) => {
                  const percentage = d.value / totalDonutValue;

                  // If there is only 1 item (e.g. 100% completed), don't deduct the gap to form a perfect full circle
                  const deduct = rawDonutData.length > 1 ? totalDeduction : 0;
                  const dashLength = Math.max(0, (percentage * circumference) - deduct);
                  const strokeDashoffset = -(accumulatedPercentage * circumference + (rawDonutData.length > 1 ? startShift : 0));

                  const midAngle = (accumulatedPercentage + (percentage / 2)) * 2 * Math.PI;
                  const labelX = cx + r * Math.cos(midAngle);
                  const labelY = cy + r * Math.sin(midAngle);

                  accumulatedPercentage += percentage;

                  return (
                    <g key={i}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="transparent"
                        stroke={d.color}
                        strokeWidth={strokeWidth}
                        strokeLinecap={rawDonutData.length > 1 ? "round" : "butt"}
                        strokeDasharray={`${dashLength} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700 ease-out"
                      />

                      {/* Only render labels inside the donut if it's not the empty placeholder */}
                      {!isDataEmpty && (
                        <g>
                          {i === 0 && rawDonutData.length > 1 ? (
                            <rect
                              x={labelX - 16} y={labelY - 12}
                              width="32" height="24"
                              rx="6" fill="#000"
                              transform={`rotate(90, ${labelX}, ${labelY})`}
                            />
                          ) : null}
                          <text
                            x={labelX} y={labelY + 4}
                            fill={i === 0 && rawDonutData.length > 1 ? d.textColor : "#000"}
                            fontSize="13"
                            fontWeight="600"
                            textAnchor="middle"
                            fontFamily="Inter, sans-serif"
                            transform={`rotate(90, ${labelX}, ${labelY})`}
                          >
                            {d.value}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-ink-primary">
              Recent Assignments
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Latest activity and status updates across projects
            </p>
          </div>
          <div className="p-2 rounded-xl bg-secondary-soft text-primary-500 border border-border-default shrink-0">
            <ClipboardList size={18} />
          </div>
        </div>
        <RecentAssignmentsTable onDeleteSuccess={handleDeleteSuccess} />
      </section>

    </div>
  );
}
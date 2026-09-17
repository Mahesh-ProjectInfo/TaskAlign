import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { themeTokens } from "@/utils/themeTokens.js";

const STATUS_COLOR_MAP = {
  COMPLETED: themeTokens.status.success.text, // #2E7D58
  DRAFT: themeTokens.status.neutral.text,     // #C87A32

};

export default function AssignmentStatusChart({ chartData }) {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center text-ink-muted text-sm font-medium">
        No status data available.
      </div>
    );
  }

  const formattedItems = chartData.map((item) => {
    const raw = item.status || item.assignmentStatus || "UNKNOWN";
    const key = String(raw).toUpperCase().trim();
    let label = key;
    if (key === "COMPLETED") label = "Completed";
    else if (key === "DRAFT") label = "Draft";
    else if (key === "IN_PROGRESS" || key === "INPROGRESS") label = "In Progress";
    else if (key === "PENDING") label = "Pending";
    else if (key === "ACTIVE") label = "Active";

    const color = STATUS_COLOR_MAP[key] || themeTokens.ink.secondary;
    const count = Number(item.count || 0);

    return { label, count, color };
  });

  const labels = formattedItems.map((i) => i.label);
  const counts = formattedItems.map((i) => i.count);
  const colors = formattedItems.map((i) => i.color);

  const data = {
    labels: labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: themeTokens.ink.secondary,
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 12, family: "Inter, sans-serif", weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: themeTokens.ink.primary,
        titleColor: "#ffffff",
        bodyColor: "#DAEBE3",
        borderColor: themeTokens.sidebar.border,
        borderWidth: 1,
        titleFont: { size: 13, family: "Inter, sans-serif" },
        bodyFont: { size: 12, family: "Inter, sans-serif" },
        padding: 10,
        cornerRadius: 8,
      },
    },
  };


  return (
    <div className="h-72 w-full flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  );
}

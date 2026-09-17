import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

import { themeTokens } from "@/utils/themeTokens.js";

const PALETTE = themeTokens.chart;

const ASSIGNMENT_TYPE_MAP = {
  1: "Software Project Assignment",
  2: "Manufacturing Job Assignment",
  3: "Construction Project Assignment",
  4: "Sales Region Assignment",
  "1": "Software Project Assignment",
  "2": "Manufacturing Job Assignment",
  "3": "Construction Project Assignment",
  "4": "Sales Region Assignment",
  "TYPE 1": "Software Project Assignment",
  "TYPE 2": "Manufacturing Job Assignment",
  "TYPE 3": "Construction Project Assignment",
  "TYPE 4": "Sales Region Assignment",
  "TYPE1": "Software Project Assignment",
  "TYPE2": "Manufacturing Job Assignment",
  "TYPE3": "Construction Project Assignment",
  "TYPE4": "Sales Region Assignment",
};

export function resolveAssignmentTypeName(raw) {
  if (!raw && raw !== 0) return "Unknown Type";
  const str = String(raw).trim();
  if (ASSIGNMENT_TYPE_MAP[str]) return ASSIGNMENT_TYPE_MAP[str];
  if (ASSIGNMENT_TYPE_MAP[str.toUpperCase()]) return ASSIGNMENT_TYPE_MAP[str.toUpperCase()];
  const num = Number(str);
  if (!Number.isNaN(num) && ASSIGNMENT_TYPE_MAP[num]) return ASSIGNMENT_TYPE_MAP[num];
  return str;
}

export default function AssignmentTypeChart({ chartData }) {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center text-ink-muted text-sm font-medium">
        No assignment type data available.
      </div>
    );
  }

  const labels = chartData.map((item) => {
    const raw = item.assignmentType || item.type || item.assignmentTypeName || item.name;
    return resolveAssignmentTypeName(raw);
  });

  const counts = chartData.map((item) => Number(item.count || item.value || 0));
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Assignments",
        data: counts,
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 56,
        categoryPercentage: 0.9,
        barPercentage: 0.95,
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
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: label,
              fillStyle: ds.backgroundColor[i],
              strokeStyle: ds.backgroundColor[i],
              pointStyle: "circle",
              hidden: false,
              index: i,
            }));
          },
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
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: themeTokens.ink.secondary, font: { size: 11, family: "Inter, sans-serif" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#E1E7E3" },
        ticks: {
          color: themeTokens.ink.secondary,
          stepSize: 1,
          precision: 0,
          font: { size: 11, family: "Inter, sans-serif" },
        },
      },
    },
  };


  return (
    <div className="h-72 w-full flex items-center justify-center">
      <Bar data={data} options={options} />
    </div>
  );
}

import { Code2, Factory, HardHat, TrendingUp } from "lucide-react";

export const ASSIGNMENT_TYPE_CARDS = [
  {
    title: "Software Project Assignment",
    name: "Software Project Assignment",
    desc: "Assign developers, designers and QA to a software project.",
    description: "Assign developers, designers and QA to a software project.",
    icon: Code2,
    emoji: "💻",
    theme: {
      inactiveCard: "bg-violet-50/60 border-violet-200/70 hover:border-violet-300 hover:bg-violet-50/90",
      activeCard: "border-violet-600 bg-violet-100/70 ring-2 ring-violet-500/25",
      inactiveIcon: "bg-violet-100/80 text-violet-700 border border-violet-200/80",
      activeIcon: "bg-violet-600 text-white",
    },
  },
  {
    title: "Manufacturing Job Assignment",
    name: "Manufacturing Job Assignment",
    desc: "Assign operators and technicians for production lines.",
    description: "Assign operators and technicians for production lines.",
    icon: Factory,
    emoji: "🏭",
    theme: {
      inactiveCard: "bg-blue-50/60 border-blue-200/70 hover:border-blue-300 hover:bg-blue-50/90",
      activeCard: "border-blue-600 bg-blue-100/70 ring-2 ring-blue-500/25",
      inactiveIcon: "bg-blue-100/80 text-blue-700 border border-blue-200/80",
      activeIcon: "bg-blue-600 text-white",
    },
  },
  {
    title: "Construction Project Assignment",
    name: "Construction Project Assignment",
    desc: "Assign engineers and workers for construction projects.",
    description: "Assign engineers and workers for construction projects.",
    icon: HardHat,
    emoji: "🏗",
    theme: {
      inactiveCard: "bg-amber-50/60 border-amber-200/70 hover:border-amber-300 hover:bg-amber-50/90",
      activeCard: "border-amber-600 bg-amber-100/70 ring-2 ring-amber-500/25",
      inactiveIcon: "bg-amber-100/80 text-amber-700 border border-amber-200/80",
      activeIcon: "bg-amber-600 text-white",
    },
  },
  {
    title: "Sales Region Assignment",
    name: "Sales Region Assignment",
    desc: "Assign sales executives to regions and campaigns.",
    description: "Assign sales executives to regions and campaigns.",
    icon: TrendingUp,
    emoji: "📈",
    theme: {
      inactiveCard: "bg-emerald-50/60 border-emerald-200/70 hover:border-emerald-300 hover:bg-emerald-50/90",
      activeCard: "border-emerald-600 bg-emerald-100/70 ring-2 ring-emerald-500/25",
      inactiveIcon: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/80",
      activeIcon: "bg-emerald-600 text-white",
    },
  },
];

export const STEP_LABELS = [
  "Assignment Details",
  "Select Resources",
  "Task Management",
  "Assignment Constraints",
  "Preview Assignment",
];

export const OPTIMIZATION_TYPES = {
  COST: "Cost Minimization",
  PROFIT: "Profit Maximization",
};

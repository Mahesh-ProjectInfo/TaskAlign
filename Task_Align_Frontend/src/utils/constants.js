export const APP_NAME = "Task Align";
export const APP_TAGLINE = "Smart Resource Assignment & Optimization Platform";

export const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" },
  {
    label: "Master Data",
    icon: "Database",
    children: [
      { label: "Role Master", to: "/master-data/roles", icon: "Briefcase" },
      { label: "Skill Master", to: "/master-data/skills", icon: "Sparkles" },
      { label: "Resource Management", to: "/master-data/resources", icon: "Users" },
    ],
  },
  { label: "Create Assignment", to: "/create-assignment", icon: "ClipboardPlus" },
  { label: "Assignment History", to: "/assignment-history", icon: "ClipboardList" },
  { label: "Settings", to: "/settings", icon: "Settings" },
  { label: "Help & Guide", to: "/help-guide", icon: "HelpCircle" },
];

export const CURRENT_USER = {
  initials: "MK",
  name: "Mahesh Kumar",
  email: "mahesh@gmail.com",
};

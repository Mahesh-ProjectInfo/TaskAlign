import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const ROUTE_NAME_MAP = {
  dashboard: "Dashboard",
  "master-data": "Master Data",
  roles: "Roles",
  skills: "Skills",
  resources: "Resources",
  "create-assignment": "Create Assignment",
  "assignment-processing": "Matrix Processing",
  "assignment-results": "Assignment Results",
  "assignment-history": "Optimization History",
  settings: "Settings",
  "help-guide": "User Help Guide",
  "report-history": "Report History",
  "activity-logs": "Activity Audit Logs",
};

const ROUTE_REDIRECT_MAP = {
  "/master-data": "/master-data/resources",
};

export default function Breadcrumbs({ className = "" }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs text-ink-secondary ${className}`}>
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-ink-primary transition-colors p-1 rounded-md hover:bg-secondary-soft/40"
        title="Home / Dashboard"
      >
        <Home size={14} className="text-primary-500" />
        <span className="sr-only">Home</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const targetTo = ROUTE_REDIRECT_MAP[routeTo] || routeTo;
        const isLast = index === pathnames.length - 1;
        const displayName = ROUTE_NAME_MAP[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={routeTo} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-ink-muted shrink-0" />
            {isLast ? (
              <span className="font-bold text-ink-primary truncate max-w-[180px]">
                {displayName}
              </span>
            ) : (
              <Link
                to={targetTo}
                className="hover:text-ink-primary transition-colors p-1 rounded-md hover:bg-secondary-soft/40"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}



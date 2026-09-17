import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { CURRENT_USER } from "@/utils/constants.js";
import Breadcrumbs from "./Breadcrumbs.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { getProfileImageUrl } from "../../utils/profileImage.js";

export default function TopNavbar({ onToggleSidebar, onOpenMobile, collapsed }) {
  const { user } = useAuth();
  const userName = user?.fullName || CURRENT_USER.name;
  const userInitials = user?.initials || CURRENT_USER.initials;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border-subtle bg-surface-card/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left controls */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onOpenMobile}
          className="grid h-9 w-9 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-secondary-soft/60 hover:text-ink-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden h-9 w-9 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-secondary-soft/60 hover:text-ink-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring lg:grid"
          aria-label="Toggle sidebar width"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        {/* Top Navbar Breadcrumbs */}
        <div className="min-w-0 flex items-center">
          <Breadcrumbs className="truncate" />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* System Status Pill Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success-bg text-status-success-text border border-status-success-border text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-status-success-text animate-pulse" />
          <span>Hungarian v2.0 Engine</span>
        </div>

        {/* User Avatar Badge */}
        <div
          className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary-500 shadow-xs select-none"
          aria-label={userName}
          title={userName}
        >
          {user?.profilePicture ? (
            <img
              src={getProfileImageUrl(user.profilePicture)}
              alt={userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs font-bold text-white">
              {userInitials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}




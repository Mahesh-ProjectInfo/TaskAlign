import { User, UserPen, KeyRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function UserProfileDropdown({ open, collapsed = false, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  if (!open) return null;

  const items = [
    { icon: User, label: "My Profile", to: "/settings?tab=profile" },
    { icon: KeyRound, label: "Change Password", to: "/settings?tab=password" },
  ];


  const handleItemClick = (to) => {
    onClose?.();
    if (to) navigate(to);
  };

  const handleLogout = () => {
    onClose?.();
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`absolute bottom-full mb-2 overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50 ${collapsed ? "left-full ml-2 w-56" : "left-2 right-2"
        }`}
    >
      <ul className="py-1">
        {items.map((it) => (
          <li key={it.label}>
            <button
              type="button"
              onClick={() => handleItemClick(it.to)}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-ink-primary transition-colors hover:bg-secondary-soft/40 font-medium"
            >
              <it.icon size={16} className="text-ink-muted" />
              {it.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-border-subtle py-1">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-status-danger-text transition-colors hover:bg-status-danger-bg/50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}


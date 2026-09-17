import { useEffect, useRef, useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { getProfileImageUrl } from "../../utils/profileImage.js";

import {
  LayoutDashboard,
  Database,
  Shield,
  CheckSquare,
  Users,
  PlusCircle,
  History,
  HelpCircle,
  ChevronDown,
  X,
} from "lucide-react";

import {
  APP_NAME,
  APP_TAGLINE,
  CURRENT_USER,
} from "@/utils/constants.js";

import UserProfileDropdown from "./UserProfileDropdown.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}) {
  const { user } = useAuth();

  const [userOpen, setUserOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const footerRef = useRef(null);

  /* ============================================================
     MASTER DATA STATE
  ============================================================ */

  const [masterDataOpen, setMasterDataOpen] = useState(() =>
    pathname.startsWith("/master-data")
  );

  useEffect(() => {
    if (pathname.startsWith("/master-data")) {
      setMasterDataOpen(true);
    }
  }, [pathname]);

  /* ============================================================
     CLOSE USER DROPDOWN WHEN CLICKING OUTSIDE
  ============================================================ */

  useEffect(() => {
    if (!userOpen) return;

    const onClick = (e) => {
      if (
        footerRef.current &&
        !footerRef.current.contains(e.target)
      ) {
        setUserOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);

    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, [userOpen]);

  /* ============================================================
     HELPERS
  ============================================================ */

  const isMasterDataActive =
    pathname.startsWith("/master-data");

  const widthClass = collapsed
    ? "lg:w-[4.5rem]"
    : "lg:w-64";

  /*
   * Main navigation item.
   *
   * IMPORTANT:
   * The ::before-like absolute div creates the left-to-right
   * hover animation.
   *
   * Inactive:
   *   transparent background
   *
   * Hover:
   *   soft mint/slate fill expands from left -> right
   *
   * Active:
   *   stronger primary/secondary treatment
   */

  const mainNavClass = (isActive) =>
    `
      group
      relative
      flex
      items-center
      gap-3
      overflow-hidden
      rounded-xl
      px-3.5
      py-2.5
      text-xs
      sm:text-sm
      font-medium
      transition-all
      duration-200
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-accent-ring

      ${isActive
      ? `
            bg-secondary-soft
            text-primary-500
            font-semibold
            shadow-xs
          `
      : `
            text-ink-secondary
            hover:text-primary-500
          `
    }

      ${collapsed ? "lg:justify-center lg:px-0" : ""}
    `;

  /*
   * Master Data parent.
   */

  const masterDataButtonClass = `
    group
    relative
    flex
    w-full
    items-center
    gap-3
    overflow-hidden
    rounded-xl
    px-3.5
    py-2.5
    text-xs
    sm:text-sm
    transition-all
    duration-200
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-accent-ring

    ${isMasterDataActive
      ? `
          bg-secondary-soft
          text-primary-500
          font-semibold
          shadow-xs
        `
      : `
          text-ink-secondary
          hover:text-primary-500
        `
    }
  `;

  /*
   * Master Data child navigation item.
   *
   * Each child has its own hover/active state.
   */

  const subNavClass = (isActive) =>
    `
      group
      relative
      flex
      items-center
      gap-2.5
      overflow-hidden
      rounded-lg
      px-3
      py-2
      text-xs
      font-medium
      transition-all
      duration-200
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-accent-ring

      ${isActive
      ? `
            bg-secondary-soft
            text-primary-500
            font-semibold
            shadow-xs
          `
      : `
            text-ink-muted
            hover:text-primary-500
          `
    }

      ${collapsed ? "lg:justify-center" : ""}
    `;

  /*
   * Animated hover layer.
   *
   * Starts at width: 0 on the LEFT
   * and expands to width: 100% on hover.
   *
   * pointer-events-none prevents it from interfering
   * with clicks.
   */

  const HoverFill = ({ active = false, strong = false }) => {
    if (active) return null;

    return (
      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-0
          w-0
          rounded-inherit
          bg-secondary-soft
          opacity-0
          transition-all
          duration-300
          ease-out
          group-hover:w-full
          group-hover:opacity-100

          ${strong
            ? "bg-secondary-soft"
            : ""
          }
        `}
      />
    );
  };

  return (
    <>
      {/* =========================================================
          MOBILE BACKDROP
      ========================================================== */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-30
            bg-ink-primary/30
            backdrop-blur-sm
            transition-opacity
            lg:hidden
          "
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-40
          flex
          w-64
          flex-col
          border-r
          border-border-subtle
          bg-surface-app
          text-ink-primary
          transition-all
          duration-300
          lg:translate-x-0
          ${widthClass}
          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* =======================================================
            HEADER / BRAND
        ======================================================== */}

        <div
          className={`
            flex
            h-16
            shrink-0
            items-center
            gap-3
            border-b
            border-border-subtle
            px-4
            ${collapsed
              ? "lg:justify-center lg:px-2"
              : ""
            }
          `}
        >
          {/* Brand Icon */}

          <div
            onClick={() => navigate("/")}
            className="
              grid
              h-9
              w-9
              shrink-0
              cursor-pointer
              place-items-center
              rounded-xl
              bg-primary-500
              text-white
              shadow-xs
              transition-all
              duration-200
              hover:scale-105
              hover:shadow-sm
            "
            title="Return to Public Landing Page"
          >
            <CheckSquare size={18} />
          </div>

          {/* Brand Text */}

          <div
            className={`
              min-w-0
              flex-1
              ${collapsed
                ? "lg:hidden"
                : ""
              }
            `}
          >
            <p
              className="
                truncate
                text-sm
                font-bold
                leading-tight
                tracking-tight
                text-ink-primary
              "
            >
              {APP_NAME}
            </p>

            <p
              className="
                truncate
                text-[10px]
                font-medium
                leading-tight
                text-ink-muted
              "
            >
              {APP_TAGLINE}
            </p>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={onCloseMobile}
            className="
              ml-auto
              rounded-full
              p-1.5
              text-ink-muted
              transition-all
              duration-200
              hover:bg-secondary-soft
              hover:text-primary-500
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent-ring
              lg:hidden
            "
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* =======================================================
            NAVIGATION
        ======================================================== */}

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            overflow-x-hidden
            px-3
            py-5
          "
        >

          {/* =====================================================
              1. DASHBOARD
          ====================================================== */}

          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            title={
              collapsed
                ? "Dashboard"
                : undefined
            }
            className={({ isActive }) =>
              mainNavClass(isActive)
            }
          >
            {({ isActive }) => (
              <>
                <HoverFill active={isActive} />

                <LayoutDashboard
                  size={18}
                  className={`
                    relative
                    z-10
                    shrink-0
                    transition-colors
                    duration-200

                    ${isActive
                      ? "text-primary-500"
                      : "text-ink-muted group-hover:text-primary-500"
                    }
                  `}
                />

                <span
                  className={`
                    relative
                    z-10
                    truncate
                    ${collapsed
                      ? "lg:hidden"
                      : ""
                    }
                  `}
                >
                  Dashboard
                </span>
              </>
            )}
          </NavLink>

          {/* =====================================================
              2. MASTER DATA
          ====================================================== */}

          <div>
            <button
              type="button"
              onClick={() =>
                setMasterDataOpen(
                  (prev) => !prev
                )
              }
              title={
                collapsed
                  ? "Master Data"
                  : undefined
              }
              className={`
                ${masterDataButtonClass}
                ${collapsed
                  ? "lg:justify-center lg:px-0"
                  : ""
                }
              `}
            >
              <HoverFill
                active={isMasterDataActive}
              />

              <Database
                size={18}
                className={`
                  relative
                  z-10
                  shrink-0
                  transition-colors
                  duration-200

                  ${isMasterDataActive
                    ? "text-primary-500"
                    : "text-ink-muted group-hover:text-primary-500"
                  }
                `}
              />

              <span
                className={`
                  relative
                  z-10
                  flex-1
                  truncate
                  text-left
                  ${collapsed
                    ? "lg:hidden"
                    : ""
                  }
                `}
              >
                Master Data
              </span>

              <ChevronDown
                size={16}
                className={`
                  relative
                  z-10
                  shrink-0
                  transition-all
                  duration-200

                  ${isMasterDataActive
                    ? "text-primary-500"
                    : "text-ink-muted group-hover:text-primary-500"
                  }

                  ${masterDataOpen
                    ? "rotate-180"
                    : ""
                  }

                  ${collapsed
                    ? "lg:hidden"
                    : ""
                  }
                `}
              />
            </button>

            {/* =================================================
                MASTER DATA CHILDREN
            ================================================== */}

            {masterDataOpen && (
              <div
                className={`
                  mt-1
                  space-y-1

                  ${collapsed
                    ? "lg:pl-0"
                    : "ml-4 border-l border-border-default pl-3"
                  }
                `}
              >

                {/* =================================================
                    ROLE MASTER
                ================================================== */}

                <NavLink
                  to="/master-data/roles"
                  onClick={onCloseMobile}
                  title={
                    collapsed
                      ? "Role Master"
                      : undefined
                  }
                  className={({ isActive }) =>
                    subNavClass(isActive)
                  }
                >
                  {({ isActive }) => (
                    <>
                      <HoverFill active={isActive} />

                      <Shield
                        size={15}
                        className={`
                          relative
                          z-10
                          shrink-0
                          transition-colors
                          duration-200

                          ${isActive
                            ? "text-primary-500"
                            : "text-ink-muted group-hover:text-primary-500"
                          }
                        `}
                      />

                      <span
                        className={`
                          relative
                          z-10
                          truncate
                          ${collapsed
                            ? "lg:hidden"
                            : ""
                          }
                        `}
                      >
                        Role Master
                      </span>
                    </>
                  )}
                </NavLink>

                {/* =================================================
                    SKILL MASTER
                ================================================== */}

                <NavLink
                  to="/master-data/skills"
                  onClick={onCloseMobile}
                  title={
                    collapsed
                      ? "Skill Master"
                      : undefined
                  }
                  className={({ isActive }) =>
                    subNavClass(isActive)
                  }
                >
                  {({ isActive }) => (
                    <>
                      <HoverFill active={isActive} />

                      <CheckSquare
                        size={15}
                        className={`
                          relative
                          z-10
                          shrink-0
                          transition-colors
                          duration-200

                          ${isActive
                            ? "text-primary-500"
                            : "text-ink-muted group-hover:text-primary-500"
                          }
                        `}
                      />

                      <span
                        className={`
                          relative
                          z-10
                          truncate
                          ${collapsed
                            ? "lg:hidden"
                            : ""
                          }
                        `}
                      >
                        Skill Master
                      </span>
                    </>
                  )}
                </NavLink>

                {/* =================================================
                    RESOURCE MANAGEMENT
                ================================================== */}

                <NavLink
                  to="/master-data/resources"
                  onClick={onCloseMobile}
                  title={
                    collapsed
                      ? "Resource Management"
                      : undefined
                  }
                  className={({ isActive }) =>
                    subNavClass(isActive)
                  }
                >
                  {({ isActive }) => (
                    <>
                      <HoverFill active={isActive} />

                      <Users
                        size={15}
                        className={`
                          relative
                          z-10
                          shrink-0
                          transition-colors
                          duration-200

                          ${isActive
                            ? "text-primary-500"
                            : "text-ink-muted group-hover:text-primary-500"
                          }
                        `}
                      />

                      <span
                        className={`
                          relative
                          z-10
                          truncate
                          ${collapsed
                            ? "lg:hidden"
                            : ""
                          }
                        `}
                      >
                        Resource Management
                      </span>
                    </>
                  )}
                </NavLink>

              </div>
            )}
          </div>

          {/* =====================================================
              3. CREATE ASSIGNMENT
          ====================================================== */}

          <NavLink
            to="/create-assignment"
            onClick={onCloseMobile}
            title={
              collapsed
                ? "Create Assignment"
                : undefined
            }
            className={({ isActive }) =>
              mainNavClass(isActive)
            }
          >
            {({ isActive }) => (
              <>
                <HoverFill active={isActive} />

                <PlusCircle
                  size={18}
                  className={`
                    relative
                    z-10
                    shrink-0
                    transition-colors
                    duration-200

                    ${isActive
                      ? "text-primary-500"
                      : "text-ink-muted group-hover:text-primary-500"
                    }
                  `}
                />

                <span
                  className={`
                    relative
                    z-10
                    truncate
                    ${collapsed
                      ? "lg:hidden"
                      : ""
                    }
                  `}
                >
                  Create Assignment
                </span>
              </>
            )}
          </NavLink>

          {/* =====================================================
              4. ASSIGNMENT HISTORY
          ====================================================== */}

          <NavLink
            to="/assignment-history"
            onClick={onCloseMobile}
            title={
              collapsed
                ? "Assignment History"
                : undefined
            }
            className={({ isActive }) =>
              mainNavClass(isActive)
            }
          >
            {({ isActive }) => (
              <>
                <HoverFill active={isActive} />

                <History
                  size={18}
                  className={`
                    relative
                    z-10
                    shrink-0
                    transition-colors
                    duration-200

                    ${isActive
                      ? "text-primary-500"
                      : "text-ink-muted group-hover:text-primary-500"
                    }
                  `}
                />

                <span
                  className={`
                    relative
                    z-10
                    truncate
                    ${collapsed
                      ? "lg:hidden"
                      : ""
                    }
                  `}
                >
                  Assignment History
                </span>
              </>
            )}
          </NavLink>

          {/* =====================================================
              5. HELP & GUIDE
          ====================================================== */}

          <NavLink
            to="/help-guide"
            onClick={onCloseMobile}
            title={
              collapsed
                ? "Help & Guide"
                : undefined
            }
            className={({ isActive }) =>
              mainNavClass(isActive)
            }
          >
            {({ isActive }) => (
              <>
                <HoverFill active={isActive} />

                <HelpCircle
                  size={18}
                  className={`
                    relative
                    z-10
                    shrink-0
                    transition-colors
                    duration-200

                    ${isActive
                      ? "text-primary-500"
                      : "text-ink-muted group-hover:text-primary-500"
                    }
                  `}
                />

                <span
                  className={`
                    relative
                    z-10
                    truncate
                    ${collapsed
                      ? "lg:hidden"
                      : ""
                    }
                  `}
                >
                  Help & Guide
                </span>
              </>
            )}
          </NavLink>

        </nav>

        {/* =======================================================
            FOOTER / USER PROFILE
        ======================================================== */}

        <div
          ref={footerRef}
          className="
            relative
            border-t
            border-border-subtle
            bg-surface-card
            p-3
          "
        >
          <UserProfileDropdown
            open={userOpen}
            collapsed={collapsed}
            onClose={() => setUserOpen(false)}
          />

          <button
            type="button"
            onClick={() =>
              setUserOpen((v) => !v)
            }
            className={`
              group
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              p-2
              text-left
              transition-all
              duration-200
              hover:bg-secondary-soft
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent-ring

              ${collapsed
                ? "lg:justify-center lg:p-1.5"
                : ""
              }
            `}
          >

            {/* Profile Image */}

            <div
              className="
                h-9
                w-9
                shrink-0
                overflow-hidden
                rounded-full
                bg-primary-500
                shadow-xs
              "
            >
              {user?.profilePicture ? (
                <img
                  src={getProfileImageUrl(
                    user.profilePicture
                  )}
                  alt="Profile"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    grid
                    h-full
                    w-full
                    place-items-center
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  {user?.initials ||
                    CURRENT_USER.initials}
                </div>
              )}
            </div>

            {/* User Details */}

            <div
              className={`
                min-w-0
                flex-1
                ${collapsed
                  ? "lg:hidden"
                  : ""
                }
              `}
            >
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  leading-tight
                  text-ink-primary
                "
              >
                {user?.fullName ||
                  CURRENT_USER.name}
              </p>

              <p
                className="
                  truncate
                  text-xs
                  leading-tight
                  text-ink-muted
                "
              >
                {user?.email ||
                  CURRENT_USER.email}
              </p>
            </div>

            {/* Dropdown Icon */}

            <ChevronDown
              size={15}
              className={`
                shrink-0
                text-ink-muted
                transition-all
                duration-200

                ${userOpen
                  ? "rotate-180 text-primary-500"
                  : ""
                }

                ${collapsed
                  ? "lg:hidden"
                  : ""
                }
              `}
            />

          </button>
        </div>
      </aside>
    </>
  );
}
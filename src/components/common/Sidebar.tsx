"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { Hop as Home, Settings, ChevronRight, Menu, X, School, Calendar, Users, GraduationCap, IndianRupee, BookOpen, FileText, Bus, ChartBar as BarChart3, UserCheck, Shield, CircleAlert as AlertCircle } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import type { RoleType } from "@/types/rbac";

// Define all possible menu items
interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles: RoleType[]; // Which roles can see this item
}

interface SidebarMenuSection {
  title: string;
  items: SidebarNavItem[];
  roles: RoleType[]; // Which roles can see this section
}

// Complete menu configuration with role restrictions
const MENU_CONFIG: SidebarMenuSection[] = [
  {
    title: "ACADEMIC MANAGEMENT",
    roles: ["superadmin", "schooladmin", "teacher", "classteacher"],
    items: [
      {
        icon: School,
        label: "Schools",
        href: "/admin/academic/schools",
        roles: ["superadmin", "schooladmin"],
      },
      {
        icon: Calendar,
        label: "Sessions",
        href: "/admin/academic/sessions",
        roles: ["superadmin", "schooladmin"],
      },
      {
        icon: Users,
        label: "Classes",
        href: "/admin/academic/classes",
        roles: ["superadmin", "schooladmin"],
      },
      {
        icon: BookOpen,
        label: "Exams",
        href: "/admin/exams",
        roles: ["superadmin", "schooladmin", "teacher", "classteacher"],
      },
    ],
  },
  {
    title: "STUDENT MANAGEMENT",
    roles: ["superadmin", "schooladmin", "teacher", "classteacher", "parent"],
    items: [
      {
        icon: GraduationCap,
        label: "Students",
        href: "/admin/students",
        roles: ["superadmin", "schooladmin", "teacher", "classteacher"],
      },
      {
        icon: UserCheck,
        label: "My Ward",
        href: "/admin/my-ward",
        roles: ["parent"],
      },
      {
        icon: FileText,
        label: "Attendance",
        href: "/admin/attendance",
        roles: ["superadmin", "schooladmin", "teacher", "classteacher"],
      },
    ],
  },
  {
    title: "STAFF MANAGEMENT",
    roles: ["superadmin", "schooladmin"],
    items: [
      {
        icon: Users,
        label: "Staff",
        href: "/admin/staff",
        roles: ["superadmin", "schooladmin"],
      },
      {
        icon: Shield,
        label: "Roles & Permissions",
        href: "/admin/roles",
        roles: ["superadmin"],
      },
    ],
  },
  {
    title: "FEE MANAGEMENT",
    roles: ["superadmin", "schooladmin", "student", "parent"],
    items: [
      {
        icon: IndianRupee,
        label: "Fees",
        href: "/admin/fees",
        roles: ["superadmin", "schooladmin"],
      },
      {
        icon: FileText,
        label: "My Fees",
        href: "/admin/my-fees",
        roles: ["student", "parent"],
      },
    ],
  },
  {
    title: "REPORTS & ANALYTICS",
    roles: ["superadmin", "schooladmin", "teacher", "classteacher"],
    items: [
      {
        icon: BarChart3,
        label: "Reports",
        href: "/admin/reports",
        roles: ["superadmin", "schooladmin", "teacher", "classteacher"],
      },
      {
        icon: AlertCircle,
        label: "Audit Logs",
        href: "/admin/audit-logs",
        roles: ["superadmin", "schooladmin"],
      },
    ],
  },
  {
    title: "TRANSPORT",
    roles: ["superadmin", "schooladmin"],
    items: [
      {
        icon: Bus,
        label: "Transport",
        href: "/admin/transport",
        roles: ["superadmin", "schooladmin"],
      },
    ],
  },
];

interface SidebarSectionProps {
  title: string;
  items: SidebarNavItem[];
  activePath: string;
  onItemClick?: () => void;
}

function SidebarSection({ title, items, activePath, onItemClick }: SidebarSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
        {title}
      </h3>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                transition-all duration-150 group
                ${
                  isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
              onClick={onItemClick}
            >
              <Icon
                size={18}
                className={`
                  flex-shrink-0 transition-colors
                  ${isActive ? "text-white" : "text-white/60 group-hover:text-white/80"}
                `}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && (
                <ChevronRight size={14} className="text-white/50" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { authUser, hasRole, isAuthenticated } = useAuth();

  // Filter menu sections and items based on user role
  const filteredMenu = useMemo(() => {
    if (!authUser?.roles?.length) return [];

    return MENU_CONFIG.filter((section) => {
      // Check if user has any role that can see this section
      const hasSectionAccess = section.roles.some((role) => hasRole(role));
      if (!hasSectionAccess) return false;

      // Filter items within the section
      const filteredItems = section.items.filter((item) =>
        item.roles.some((role) => hasRole(role))
      );

      return filteredItems.length > 0;
    }).map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.roles.some((role) => hasRole(role))
      ),
    }));
  }, [authUser, hasRole]);

  // Get role display name
  const getRoleDisplayName = () => {
    if (!authUser?.roles?.length) return "Guest";
    const role = authUser.roles[0];
    const names: Record<string, string> = {
      superadmin: "Super Admin",
      schooladmin: "School Admin",
      teacher: "Teacher",
      classteacher: "Class Teacher",
      student: "Student",
      parent: "Parent",
    };
    return names[role] || role;
  };

  // Get initials
  const getInitials = () => {
    if (authUser?.first_name || authUser?.last_name) {
      return `${authUser.first_name?.charAt(0) || ""}${
        authUser.last_name?.charAt(0) || ""
      }`.toUpperCase();
    }
    return authUser?.email?.charAt(0).toUpperCase() || "U";
  };

  const sidebarContent = (
    <>
      {/* Logo & User Info Section */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <Link
          href="/admin"
          className="flex items-center gap-3 mb-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#7b1d2f] font-bold text-sm shadow-lg">
            SMS
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              SchoolMS
            </h1>
            <p className="text-[10px] text-white/60">Management Portal</p>
          </div>
        </Link>

        {/* User Info Card */}
        {isAuthenticated && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe8d1] to-[#e6bfa8] text-[#7b1d2f] font-bold text-sm">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {authUser?.first_name || authUser?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[10px] text-white/60">{getRoleDisplayName()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Dashboard Home Link */}
        <div className="mb-4">
          <Link
            href="/admin"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-150 group
              ${
                pathname === "/admin"
                  ? "bg-white text-[#7b1d2f] shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/15"
              }
            `}
            onClick={() => setIsOpen(false)}
          >
            <Home
              size={18}
              className={`
                flex-shrink-0
                ${
                  pathname === "/admin"
                    ? "text-[#7b1d2f]"
                    : "text-white/70 group-hover:text-white"
                }
              `}
            />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Role-Based Menu Sections */}
        {filteredMenu.length > 0 ? (
          filteredMenu.map((section) => (
            <SidebarSection
              key={section.title}
              title={section.title}
              items={section.items}
              activePath={pathname}
              onItemClick={() => setIsOpen(false)}
            />
          ))
        ) : (
          <div className="text-center py-8 px-4">
            <p className="text-white/50 text-sm">No menu items available</p>
            <p className="text-white/30 text-xs mt-2">
              Contact administrator for access
            </p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-white/10">
        <Link
          href="/admin/settings"
          className={`
            flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
            transition-all duration-150 group
            ${
              pathname === "/admin/settings"
                ? "bg-white/15 text-white font-medium"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }
          `}
          onClick={() => setIsOpen(false)}
        >
          <Settings
            size={18}
            className={`
              flex-shrink-0
              ${
                pathname === "/admin/settings"
                  ? "text-white"
                  : "text-white/60 group-hover:text-white/80"
              }
            `}
          />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button - Only visible in admin area */}
      {pathname.startsWith("/admin") && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-3 left-4 z-50 p-2 rounded-lg bg-white border border-slate-200 shadow-sm lg:hidden hover:bg-slate-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={20} className="text-[#7b1d2f]" />
          ) : (
            <Menu size={20} className="text-[#7b1d2f]" />
          )}
        </button>
      )}

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 h-screen flex flex-col
          bg-gradient-to-b from-[#7b1d2f] via-[#6B101C] to-[#5b1220]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

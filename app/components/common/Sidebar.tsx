"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hop as Home, Settings, ChevronRight } from "lucide-react";
import { SIDEBAR_MENU_SECTIONS } from "@/app/utils/constants";

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface SidebarSectionProps {
  title: string;
  items: SidebarNavItem[];
  activePath: string;
}

function SidebarSection({ title, items, activePath }: SidebarSectionProps) {
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

  return (
    <aside className="w-60 min-h-screen flex flex-col bg-gradient-to-b from-[var(--color-primary)] via-[#6B101C] to-[#4A0A12]">
      {/* Logo Section */}
      <div className="flex-shrink-0 p-6 border-b border-white/10">
        <Link href="/admin" className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Playground
          </h1>
          <p className="text-xs text-white/60">School Management</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {/* Dashboard Home Link */}
        <div className="mb-6">
          <Link
            href="/admin"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-150 group
              ${
                pathname === "/admin"
                  ? "bg-white text-[var(--color-primary)] shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/15"
              }
            `}
          >
            <Home
              size={18}
              className={`
                flex-shrink-0
                ${
                  pathname === "/admin"
                    ? "text-[var(--color-primary)]"
                    : "text-white/70 group-hover:text-white"
                }
              `}
            />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Menu Sections */}
        {SIDEBAR_MENU_SECTIONS.map((section) => (
          <SidebarSection
            key={section.title}
            title={section.title}
            items={section.items.map((item) => ({
              label: item.label,
              href: item.href,
              icon: item.icon,
            }))}
            activePath={pathname}
          />
        ))}
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
    </aside>
  );
}

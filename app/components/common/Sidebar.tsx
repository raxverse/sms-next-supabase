"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  GraduationCap,
  ClipboardList,
  Bus,
  MessageSquare,
  FileText,
  Settings,
  IndianRupee,
} from "lucide-react";
import { SIDEBAR_MENU_SECTIONS, APP_COLORS } from "@/app/utils/constants";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className="w-53 bg-gradient-to-b from-[#7A1421] to-[#4F0913] text-white min-h-screen flex flex-col"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${APP_COLORS.primary}, #4F0913)`,
      }}
    >
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">Playground</h1>
        <p className="text-sm text-gray-300">The School</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <Link href="/admin">
          <button
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 mb-6 transition ${
              isActive("/admin")
                ? "bg-white/20"
                : "bg-white/10 hover:bg-white/20"
            }`}
            style={!isActive("/admin") ? { backgroundColor: `${APP_COLORS.primary}40` } : {}}
          >
            <Home size={14} />
            Dashboard
          </button>
        </Link>

        {SIDEBAR_MENU_SECTIONS.map((section) => (
          <div key={section.title} className="mb-8">
            <h3 className="text-xs font-semibold text-gray-300 mb-3">
              {section.title}
            </h3>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link key={item.label} href={item.href}>
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition ${
                        active
                          ? "bg-white/20 text-white font-semibold"
                          : "hover:bg-white/10 text-gray-100"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/admin/settings">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-white/10 transition">
            <Settings size={14} />
            Settings
          </button>
        </Link>
      </div>
    </aside>
  );
}

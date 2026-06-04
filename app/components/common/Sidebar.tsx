"use client";

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
  return (
    <aside
      className="w-72 bg-gradient-to-b from-[#7A1421] to-[#4F0913] text-white min-h-screen flex flex-col"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${APP_COLORS.primary}, #4F0913)`,
      }}
    >
      <div className="p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold">EduManage</h1>
        <p className="text-sm text-gray-300">School ERP</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <button
          className="w-full flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 mb-6 hover:bg-white/20 transition"
          style={{ backgroundColor: `${APP_COLORS.primary}40` }}
        >
          <Home size={18} />
          Dashboard
        </button>

        {SIDEBAR_MENU_SECTIONS.map((section) => (
          <div key={section.title} className="mb-8">
            <h3 className="text-xs font-semibold text-gray-300 mb-3">
              {section.title}
            </h3>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-white/10 transition"
                  >
                    <Icon size={16} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-white/10 transition">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </aside>
  );
}

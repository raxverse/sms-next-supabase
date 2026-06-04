"use client";

import { Bell, Search } from "lucide-react";
import { APP_COLORS } from "@/app/utils/constants";

export default function Topbar() {
  return (
    <header className="bg-white border-b h-20 flex items-center justify-between px-8">
      <div className="relative w-[500px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          placeholder="Search students, staff, fees..."
          className="w-full rounded-xl border pl-11 pr-4 py-3 outline-none focus:ring-2 transition focus:ring-[#7A1421]"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative hover:opacity-75 transition">
          <Bell />
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            8
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full"
            style={{ backgroundColor: APP_COLORS.primary }}
          />
          <div>
            <p className="font-semibold">Super Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { Badge } from "@/app/components/ui";

interface TopbarProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function Topbar({ user }: TopbarProps) {
  const displayName = user?.name || "Super Admin";
  const displayRole = user?.role || "Administrator";

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-[var(--color-border)]">
      {/* Search Section */}
      <div className="relative w-full max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]"
          />
          <input
            type="search"
            placeholder="Search students, staff, fees..."
            className={`
              w-full h-10 pl-10 pr-4 rounded-xl text-sm
              bg-[var(--color-background)]
              border border-[var(--color-border-light)]
              text-[var(--color-text)]
              placeholder:text-[var(--color-text-light)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
              transition-all duration-150
            `}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-[var(--color-border-light)] transition-colors">
          <Bell className="w-5 h-5 text-[var(--color-text-muted)]" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--color-error)] text-white text-[10px] font-bold flex items-center justify-center">
            8
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[var(--color-border)]" />

        {/* User Profile */}
        <button className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[var(--color-border-light)] transition-colors">
          {/* Avatar */}
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-border-light)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white font-semibold text-sm">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            {/* Online Status */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--color-success)] border-2 border-white" />
          </div>

          {/* User Info */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-[var(--color-text)] leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{displayRole}</p>
          </div>

          <ChevronDown
            size={16}
            className="text-[var(--color-text-muted)] hidden sm:block"
          />
        </button>
      </div>
    </header>
  );
}

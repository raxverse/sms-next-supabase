"use client";

import { StatCard, ListCard, CardSkeleton } from "@/app/components/ui";
import { useDashboardStats } from "@/app/hooks/useDashboardStats";
import { usePendingActions } from "@/app/hooks/usePendingActions";
import { useRecentActivities } from "@/app/hooks/useRecentActivities";
import {
  Users,
  GraduationCap,
  IndianRupee,
  Calendar,
  Bus,
  School,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Users,
  GraduationCap,
  IndianRupee,
  Calendar,
  Bus,
  School,
};

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { actions, isLoading: actionsLoading } = usePendingActions();
  const { activities, isLoading: activitiesLoading } = useRecentActivities();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[#8f2438] rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-white/80">
          Here&apos;s your school management dashboard overview
        </p>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-color)] mb-4">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            : stats.map((stat) => {
                const IconComponent = iconMap[stat.icon];
                return (
                  <StatCard
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    subtitle={stat.subtitle}
                    icon={IconComponent}
                  />
                );
              })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Pending Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-[var(--text-color)] mb-4">
            Quick Actions
          </h2>
          {actionsLoading ? (
            <CardSkeleton />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {actions.map((action) => (
                <Link
                  key={action.id}
                  href="#"
                  className="p-4 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] hover:border-[var(--primary)] hover:bg-white transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[var(--text-color)]">
                        {action.name}
                      </p>
                      <p className="text-sm text-[var(--text-color)]/60 mt-1">
                        {action.count} pending
                      </p>
                    </div>
                    {action.count > 0 && (
                      <span className="px-2 py-1 rounded-full bg-[#e74c3c] text-white text-xs font-semibold">
                        {action.count}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Recent Activities */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-color)] mb-4">
            Recent Activities
          </h2>
          {activitiesLoading ? (
            <CardSkeleton />
          ) : activities.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm"
                >
                  <p className="font-medium text-[var(--text-color)]">
                    {activity.title}
                  </p>
                  <p className="text-xs text-[var(--text-color)]/60 mt-1">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-color)]/60">
              <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activities yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

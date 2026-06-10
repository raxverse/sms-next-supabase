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
  ArrowRight,
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100 text-lg">
          Here&apos;s your school management dashboard overview
        </p>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
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
                  className="p-4 rounded-lg bg-white border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {action.name}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {action.count} pending
                      </p>
                    </div>
                    {action.count > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold ml-2">
                        {action.count}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Recent Activities */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Recent Activities
          </h2>
          {activitiesLoading ? (
            <CardSkeleton />
          ) : activities.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 rounded-lg bg-white border border-slate-200 text-sm hover:shadow-sm transition-shadow"
                >
                  <p className="font-medium text-slate-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activities yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

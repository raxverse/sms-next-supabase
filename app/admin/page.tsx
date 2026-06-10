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
} from "lucide-react";

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
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Welcome back, manage your schools efficiently.
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Pending Actions */}
        {actionsLoading ? (
          <CardSkeleton />
        ) : (
          <ListCard
            title="Pending Actions"
            items={actions.map((action) => ({
              id: action.id,
              label: action.name,
              badge: {
                text: action.count,
                variant: "primary" as const,
              },
            }))}
            emptyMessage="No pending actions"
          />
        )}

        {/* Recent Activities */}
        {activitiesLoading ? (
          <CardSkeleton />
        ) : (
          <ListCard
            title="Recent Activities"
            items={activities.map((activity) => ({
              id: activity.id,
              label: activity.title,
              value: activity.time,
            }))}
            emptyMessage="No recent activities"
          />
        )}
      </div>
    </div>
  );
}

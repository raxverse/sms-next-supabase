"use client";

import { APP_COLORS } from "@/app/utils/constants";
import StatsGrid from "@/app/components/dashboard/StatsGrid";
import PendingActionsCard from "@/app/components/dashboard/PendingActionsCard";
import RecentActivitiesCard from "@/app/components/dashboard/RecentActivitiesCard";
import { useDashboardStats } from "@/app/hooks/useDashboardStats";
import { usePendingActions } from "@/app/hooks/usePendingActions";
import { useRecentActivities } from "@/app/hooks/useRecentActivities";

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { actions, isLoading: actionsLoading } = usePendingActions();
  const { activities, isLoading: activitiesLoading } = useRecentActivities();

  return (
    <div className="p-8">
      <h1
        className="text-4xl font-bold"
        style={{ color: APP_COLORS.dark }}
      >
        Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome back, manage your schools efficiently.
      </p>

      <StatsGrid stats={stats} isLoading={statsLoading} />

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <PendingActionsCard actions={actions} isLoading={actionsLoading} />
        <RecentActivitiesCard activities={activities} isLoading={activitiesLoading} />
      </div>
    </div>
  );
}

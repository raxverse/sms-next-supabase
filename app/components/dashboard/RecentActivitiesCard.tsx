"use client";

import { Activity } from "@/app/types";
import { APP_COLORS } from "@/app/utils/constants";

interface Props {
  activities: Activity[];
  isLoading?: boolean;
}

export default function RecentActivitiesCard({ activities, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-semibold text-xl mb-6" style={{ color: APP_COLORS.text }}>
          Recent Activities
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="font-semibold text-xl mb-6" style={{ color: APP_COLORS.text }}>
        Recent Activities
      </h2>

      <div className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b pb-4"
          >
            <span>{item.title}</span>
            <span className="text-sm text-gray-500">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

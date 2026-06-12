"use client";

import { Activity } from "@/types";

interface Props {
  activities: Activity[];
  isLoading?: boolean;
}

export default function RecentActivitiesCard({ activities, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-semibold text-xl mb-6 text-[var(--color-text)]">
          Recent Activities
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-[var(--color-border-light)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="font-semibold text-xl mb-6 text-[var(--color-text)]">
        Recent Activities
      </h2>

      <div className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b border-[var(--color-border-light)] pb-4"
          >
            <span className="text-[var(--color-text)]">{item.title}</span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

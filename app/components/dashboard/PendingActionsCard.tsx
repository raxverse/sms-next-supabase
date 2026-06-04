"use client";

import { PendingAction } from "@/app/types";
import { APP_COLORS } from "@/app/utils/constants";

interface Props {
  actions: PendingAction[];
  isLoading?: boolean;
}

export default function PendingActionsCard({ actions, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-semibold text-xl mb-6" style={{ color: APP_COLORS.text }}>
          Pending Actions
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
        Pending Actions
      </h2>

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex justify-between items-center border-b pb-4"
          >
            <span>{action.name}</span>

            <span
              className="px-4 py-1 rounded-lg font-medium"
              style={{
                backgroundColor: APP_COLORS.primaryLight,
                color: APP_COLORS.primary,
              }}
            >
              {action.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

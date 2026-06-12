"use client";

import { PendingAction } from "@/types";

interface Props {
  actions: PendingAction[];
  isLoading?: boolean;
}

export default function PendingActionsCard({ actions, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-semibold text-xl mb-6 text-[var(--color-text)]">
          Pending Actions
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
        Pending Actions
      </h2>

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex justify-between items-center border-b border-[var(--color-border-light)] pb-4"
          >
            <span className="text-[var(--color-text)]">{action.name}</span>

            <span
              className="px-4 py-1 rounded-lg font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]"
            >
              {action.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

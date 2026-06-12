"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-slate-600">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex flex-col gap-2 sm:flex-row">{action}</div>}
    </div>
  );
}

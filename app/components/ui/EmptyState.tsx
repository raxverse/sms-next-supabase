"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4 text-center
        ${className}
      `}
    >
      {Icon && (
        <div className="p-4 rounded-full bg-[var(--color-border-light)] mb-4">
          <Icon
            className="w-8 h-8 text-[var(--color-text-light)]"
            strokeWidth={1.5}
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            mt-6 px-4 py-2 text-sm font-medium
            bg-[var(--color-primary)] text-white rounded-lg
            hover:bg-[var(--color-primary-hover)] transition-colors
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/* Error State - for error scenarios */
interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: {
    label?: string;
    onClick: () => void;
  };
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  retry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4 text-center
        ${className}
      `}
    >
      <div className="p-4 rounded-full bg-[var(--color-error-light)] mb-4">
        <svg
          className="w-8 h-8 text-[var(--color-error)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-sm">
        {message}
      </p>
      {retry && (
        <button
          onClick={retry.onClick}
          className={`
            mt-6 px-4 py-2 text-sm font-medium
            bg-[var(--color-error)] text-white rounded-lg
            hover:bg-red-700 transition-colors
          `}
        >
          {retry.label || "Try Again"}
        </button>
      )}
    </div>
  );
}

/* No Permissions State */
interface NoPermissionStateProps {
  requiredPermission?: string;
  onBack?: () => void;
  className?: string;
}

export function NoPermissionState({
  requiredPermission,
  onBack,
  className = "",
}: NoPermissionStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4 text-center
        ${className}
      `}
    >
      <div className="p-4 rounded-full bg-[var(--color-warning-light)] mb-4">
        <svg
          className="w-8 h-8 text-[var(--color-warning)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text)]">
        Access Denied
      </h3>
      <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-sm">
        {requiredPermission
          ? `You need "${requiredPermission}" permission to view this content.`
          : "You don't have permission to view this content."}
      </p>
      {onBack && (
        <button
          onClick={onBack}
          className={`
            mt-6 px-4 py-2 text-sm font-medium
            bg-[var(--color-border-light)] text-[var(--color-text)] rounded-lg
            hover:bg-[var(--color-border)] transition-colors
          `}
        >
          Go Back
        </button>
      )}
    </div>
  );
}

export default EmptyState;

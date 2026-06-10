"use client";

import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-border)] text-[var(--color-text)]",
  primary:
    "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  secondary:
    "bg-[var(--color-border-light)] text-[var(--color-text-muted)]",
  success:
    "bg-[var(--color-success-light)] text-[var(--color-success)]",
  warning:
    "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  error: "bg-[var(--color-error-light)] text-[var(--color-error)]",
  info: "bg-[var(--color-info-light)] text-[var(--color-info)]",
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium rounded-full
          ${badgeVariants[variant]}
          ${badgeSizes[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`
              w-1.5 h-1.5 rounded-full mr-1.5
              ${
                variant === "success"
                  ? "bg-[var(--color-success)]"
                  : variant === "warning"
                  ? "bg-[var(--color-warning)]"
                  : variant === "error"
                  ? "bg-[var(--color-error)]"
                  : variant === "info"
                  ? "bg-[var(--color-info)]"
                  : variant === "primary"
                  ? "bg-[var(--color-primary)]"
                  : "bg-current"
              }
            `}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

/* Status Badge - specific for status indicators */
interface StatusBadgeProps extends Omit<BadgeProps, "dot"> {
  status: "active" | "inactive" | "pending" | "completed" | "failed";
}

const statusConfig = {
  active: { variant: "success" as BadgeVariant, label: "Active" },
  inactive: { variant: "default" as BadgeVariant, label: "Inactive" },
  pending: { variant: "warning" as BadgeVariant, label: "Pending" },
  completed: { variant: "success" as BadgeVariant, label: "Completed" },
  failed: { variant: "error" as BadgeVariant, label: "Failed" },
};

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} dot {...props}>
      {props.children || config.label}
    </Badge>
  );
}

export default Badge;

"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

const cardVariants = {
  default: "bg-[var(--color-surface)] shadow-sm",
  elevated: "bg-[var(--color-surface)] shadow-lg",
  outlined: "bg-[var(--color-surface)] border border-[var(--color-border)]",
};

const cardPadding = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl transition-shadow duration-[var(--transition-normal)]
          ${cardVariants[variant]}
          ${cardPadding[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* Card Header */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between mb-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

/* Card Title */
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = "h3", className = "", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`text-lg font-semibold text-[var(--color-text)] ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = "CardTitle";

/* Card Description */
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className = "", children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-[var(--color-text-muted)] mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

/* Card Content */
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

/* Card Footer */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border-light)] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

/* Stat Card - For Dashboard Stats */
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--color-text-light)]">
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className={`mt-2 text-sm font-medium ${
                trend.isPositive
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-error)]"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              <span className="text-[var(--color-text-muted)] ml-1">
                vs last month
              </span>
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0 p-3 rounded-xl bg-[var(--color-primary-light)]">
            <Icon
              size={20}
              className="text-[var(--color-primary)]"
            />
          </div>
        )}
      </div>
    </Card>
  );
}

/* List Card - For Lists */
interface ListCardProps {
  title: string;
  items: Array<{
    id: string;
    label: string;
    value?: string | number;
    badge?: {
      text: string | number;
      variant?: "default" | "primary" | "success" | "warning" | "error";
    };
  }>;
  emptyMessage?: string;
  className?: string;
}

export function ListCard({
  title,
  items,
  emptyMessage = "No items yet",
  className = "",
}: ListCardProps) {
  return (
    <Card variant="default" padding="md" className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
            {emptyMessage}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--color-border-light)]">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm text-[var(--color-text)]">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {item.value}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`
                        px-2.5 py-0.5 text-xs font-medium rounded-full
                        ${
                          item.badge.variant === "success"
                            ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
                            : item.badge.variant === "warning"
                            ? "bg-[var(--color-warning-light)] text-[var(--color-warning)]"
                            : item.badge.variant === "error"
                            ? "bg-[var(--color-error-light)] text-[var(--color-error)]"
                            : "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                        }
                      `}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default Card;

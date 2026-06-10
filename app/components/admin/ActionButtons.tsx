import { ReactNode } from "react";
import { Plus } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function ActionButton({
  label,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled = false,
  loading = false,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {label}
    </button>
  );
}

export function CreateButton({ onClick, label = "Create New" }: { onClick: () => void; label?: string }) {
  return (
    <ActionButton
      label={label}
      onClick={onClick}
      variant="primary"
      icon={Plus}
    />
  );
}

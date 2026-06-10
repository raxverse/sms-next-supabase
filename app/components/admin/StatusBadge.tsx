interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "rejected" | "completed" | "overdue" | string;
  label?: string;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  active: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-600",
  },
  inactive: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-600",
  },
  pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-600",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-600",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-600",
  },
  overdue: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-600",
  },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = statusColors[status] || statusColors["pending"];
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
      {displayLabel}
    </span>
  );
}

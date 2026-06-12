import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  subtitle?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  subtitle = "All Schools",
}: Props) {
  return (
    <div className="bg-white rounded-2xl border p-2 shadow-sm hover:shadow-md transition">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary)]">
        {icon}
      </div>

      <p className="text-[var(--color-text-muted)] mt-4 text-sm">{title}</p>

      <h3 className="text-2xl font-bold mt-2 text-[var(--color-text)]">
        {value}
      </h3>

      <p className="text-xs text-[var(--color-text-light)] mt-2">{subtitle}</p>
    </div>
  );
}

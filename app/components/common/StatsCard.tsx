import { ReactNode } from "react";
import { APP_COLORS } from "@/app/utils/constants";

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
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A1421]"
        style={{ backgroundColor: APP_COLORS.primaryLight, color: APP_COLORS.primary }}
      >
        {icon}
      </div>

      <p className="text-gray-500 mt-4">{title}</p>

      <h3 className="text-2xl font-bold mt-2" style={{ color: APP_COLORS.darkAlt }}>
        {value}
      </h3>

      <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}

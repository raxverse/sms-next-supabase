"use client";

import { ReactNode } from "react";
import StatsCard from "@/app/components/common/StatsCard";
import { DashboardStat } from "@/app/types";
import {
  Users,
  GraduationCap,
  IndianRupee,
  Calendar,
  Bus,
  School,
} from "lucide-react";

const iconMap: Record<string, ReactNode> = {
  Users: <Users />,
  GraduationCap: <GraduationCap />,
  IndianRupee: <IndianRupee />,
  Calendar: <Calendar />,
  Bus: <Bus />,
  School: <School />,
};

interface Props {
  stats: DashboardStat[];
  isLoading?: boolean;
}

export default function StatsGrid({ stats, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mt-8">
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={iconMap[stat.icon] || <Users />}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}

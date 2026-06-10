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
  Users: <Users size={16} />,
  GraduationCap: <GraduationCap size={16} />,
  IndianRupee: <IndianRupee size={16} />,
  Calendar: <Calendar size={16} />,
  Bus: <Bus size={16} />,
  School: <School size={16} />,
};

interface Props {
  stats: DashboardStat[];
  isLoading?: boolean;
}

export default function StatsGrid({ stats, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[var(--color-border-light)] rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mt-8">
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={iconMap[stat.icon] || <Users size={16} />}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}

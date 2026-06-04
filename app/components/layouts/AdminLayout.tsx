"use client";

import { ReactNode } from "react";
import Sidebar from "@/app/components/common/Sidebar";
import Topbar from "@/app/components/common/Topbar";
import { APP_COLORS } from "@/app/utils/constants";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div
      className="flex bg-[#F8F5F2] min-h-screen"
      style={{ backgroundColor: APP_COLORS.background }}
    >
      <Sidebar />
      <main className="flex-1">
        <Topbar />
        {children}
      </main>
    </div>
  );
}

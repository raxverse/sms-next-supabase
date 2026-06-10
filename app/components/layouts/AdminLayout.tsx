"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/app/components/common/Sidebar";
import Topbar from "@/app/components/common/Topbar";
import { APP_COLORS } from "@/app/utils/constants";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div
      className="flex min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: APP_COLORS.background }}
    >
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <Sidebar />
    </div>
  );
}
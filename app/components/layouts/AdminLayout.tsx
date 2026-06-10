"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/app/components/common/Sidebar";
import Topbar from "@/app/components/common/Topbar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div
      className="flex min-h-screen w-full overflow-hidden"
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
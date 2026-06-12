"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - Sidebar-first flexbox order */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <Topbar />
        
        {/* Main Content - Independent scrolling */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

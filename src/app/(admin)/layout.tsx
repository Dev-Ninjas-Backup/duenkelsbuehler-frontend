"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin/_components/admin-sidebar";
import { AdminHeader } from "./admin/_components/admin-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-dvh bg-white flex relative">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />
      <div className="flex-1 flex flex-col h-dvh overflow-hidden relative">
        <div className="w-full shrink-0 px-4 lg:px-8 pb-2 z-10 bg-white">
          <AdminHeader />
        </div>
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

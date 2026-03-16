"use client";

import { useState } from "react";
import { ClientSidebar } from "./client/_components/client-sidebar";
import { ClientBottomNav } from "./client/_components/client-bottom-nav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen p-4 gap-4 pb-30 relative">
        <ClientSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto rounded-2xl">{children}</main>
      </div>
      <ClientBottomNav />
    </div>
  );
}

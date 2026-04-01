"use client";

import { useState } from "react";
import { ClientSidebar } from "./client/_components/client-sidebar";
import { ClientBottomNav } from "./client/_components/client-bottom-nav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#F8F9FA]">
      <div className="flex h-full p-4 md:p-6 lg:p-10 gap-4 lg:gap-8 pb-[130px] lg:pb-[100px] relative max-w-[1600px] mx-auto">
        <ClientSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 bg-white rounded-[32px] overflow-hidden flex flex-col relative z-10">
          {children}
        </main>
      </div>
      <ClientBottomNav onMeClick={() => setSidebarOpen((p) => !p)} />
    </div>
  );
}

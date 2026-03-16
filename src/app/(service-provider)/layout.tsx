"use client";

import { useState } from "react";
import { SPSidebar } from "./sp/_components/sp-sidebar";
import { SPBottomNav } from "./sp/_components/sp-bottom-nav";

export default function ServiceProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen p-4 gap-4 pb-30 relative">
        {/* Sidebar */}
        <SPSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto rounded-2xl">{children}</main>
      </div>

      {/* Bottom Nav */}
      <SPBottomNav />
    </div>
  );
}

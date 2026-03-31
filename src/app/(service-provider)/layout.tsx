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
    <div className="h-dvh w-full overflow-hidden bg-[#F8F9FA]">
      {/* Outer wrapper to contain everything neatly above the nav */}
      <div className="flex h-full p-4 md:p-6 lg:p-10 gap-4 lg:gap-8 pb-[130px] lg:pb-[100px] relative max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <SPSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-32px overflow-hidden flex flex-col relative z-10">
          {children}
        </main>
      </div>

      {/* Bottom Nav */}
      <SPBottomNav onMeClick={() => setSidebarOpen((prev) => !prev)} />
    </div>
  );
}

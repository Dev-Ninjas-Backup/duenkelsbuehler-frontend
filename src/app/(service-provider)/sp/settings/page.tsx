"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MyProfileTab } from "./_components/my-profile-tab";
import { PaymentsTab } from "./_components/payments-tab";

type Tab = "profile" | "payments";

export default function SPSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-6"
      >
        Settings
      </motion.h1>

      {/* Main Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex justify-center mb-8 shrink-0"
      >
        <div className="flex border-b border-gray-200">
          {(["profile", "payments"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-3 font-work-sans text-sm font-medium transition-colors ${
                activeTab === tab ? "text-[#181D27]" : "text-[#9CA3AF] hover:text-[#414651]"
              }`}
            >
              {tab === "profile" ? "My Profile" : "Payments"}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#181D27]"
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && <MyProfileTab />}
          {activeTab === "payments" && <PaymentsTab />}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientMyProfileTab } from "./_components/client-my-profile-tab";
import { ClientTransactionHistoryTab } from "./_components/client-transaction-history-tab";
import { ClientDisputeTab } from "./_components/client-dispute-tab";

type Tab = "profile" | "payment-methods" | "transaction-history" | "dispute";

const tabs: { key: Tab; label: string }[] = [
  { key: "profile",             label: "My Profile" },
  { key: "payment-methods",     label: "Payment Methods" },
  { key: "transaction-history", label: "Transaction History" },
  { key: "dispute",             label: "Dispute a Charge" },
];

export default function ClientSettingsPage() {
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

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex border-b border-gray-200 mb-8 overflow-x-auto"
      >
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative px-6 py-3 font-work-sans text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === key ? "text-[#181D27]" : "text-[#9CA3AF] hover:text-[#414651]"
            }`}
          >
            {label}
            {activeTab === key && (
              <motion.div
                layoutId="client-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#181D27]"
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && <ClientMyProfileTab />}

        {activeTab === "payment-methods" && (
          <motion.div key="payment-methods" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
            className="flex items-center justify-center py-16">
            <p className="font-work-sans text-sm text-[#9CA3AF]">Payment Methods coming soon...</p>
          </motion.div>
        )}

        {activeTab === "transaction-history" && <ClientTransactionHistoryTab />}

        {activeTab === "dispute" && <ClientDisputeTab />}
      </AnimatePresence>
    </div>
  );
}

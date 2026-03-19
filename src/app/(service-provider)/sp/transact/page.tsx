"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tab } from "./_components/types";
import { NewTransactionTab } from "./_components/new-transaction-tab";
import { TrackTab } from "./_components/track-tab";

const TABS: { key: Tab; label: string }[] = [
  { key: "new",   label: "New Transaction" },
  { key: "track", label: "Track" },
];

export default function TransactPage() {
  const [activeTab, setActiveTab] = useState<Tab>("new");

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-6"
      >
        Make it Rain $
      </motion.h1>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex border-b border-gray-200 mb-8 max-w-sm mx-auto w-full"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative flex-1 py-3 font-work-sans text-sm font-medium transition-colors ${
              activeTab === key ? "text-[#181D27]" : "text-[#9CA3AF] hover:text-[#414651]"
            }`}
          >
            {label}
            {activeTab === key && (
              <motion.div
                layoutId="transact-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#181D27]"
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "new" && (
            <NewTransactionTab
              onDone={() => setActiveTab("track")}
            />
          )}
          {activeTab === "track" && <TrackTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

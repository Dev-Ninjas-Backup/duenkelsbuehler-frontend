"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentInformationTab } from "./payment-information-tab";
import { PaymentSetupTab } from "./payment-setup-tab";
import { TransactionHistoryTab } from "./transaction-history-tab";
import { DisputeResolutionTab } from "./dispute-resolution-tab";

type PaymentSubTab = "information" | "setup" | "history" | "dispute";

const subTabs: { key: PaymentSubTab; label: string }[] = [
  { key: "information", label: "Payment Information" },
  { key: "setup", label: "Payment Setup" },
  { key: "history", label: "Transaction History" },
  { key: "dispute", label: "Dispute Resolution" },
];

export function PaymentsTab() {
  const [activeSubTab, setActiveSubTab] = useState<PaymentSubTab>("information");

  return (
    <motion.div
      key="payments"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      {/* Sub-Tab Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {subTabs.map(({ key, label }) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSubTab(key)}
            className={`px-5 py-2.5 rounded-full font-work-sans text-sm font-medium border-2 transition-colors ${
              activeSubTab === key
                ? "bg-[#181D27] text-white border-[#181D27]"
                : "bg-white text-[#181D27] border-[#181D27] hover:bg-gray-50"
            }`}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Sub-Tab Content */}
      <AnimatePresence mode="wait">
        {activeSubTab === "information" && <PaymentInformationTab />}

        {activeSubTab === "setup" && <PaymentSetupTab />}

        {activeSubTab === "history" && <TransactionHistoryTab />}

        {activeSubTab === "dispute" && <DisputeResolutionTab />}
      </AnimatePresence>
    </motion.div>
  );
}

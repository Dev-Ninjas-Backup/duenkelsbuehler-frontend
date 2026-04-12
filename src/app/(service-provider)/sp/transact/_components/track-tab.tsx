"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useMySubscriptions } from "@/hooks/subscription/use-subscription";

const STEPS = [
  { label: "Contract Sent" },
  { label: "Payment Made" },
  { label: "Finalized" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const statusToStep: Record<string, number> = {
  PENDING: 0,
  ACTIVE: 1,
  TRIALING: 1,
  PAST_DUE: 1,
  CANCELED: 2,
};

export function TrackTab() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: subscriptions = [], isLoading } = useMySubscriptions();

  const selected = subscriptions.find((s) => s.id === selectedId);
  const activeStep = selected ? (statusToStep[selected.status] ?? 0) : 0;

  return (
    <div>
      <AnimatePresence>
        {selectedId && (
          <motion.button key="back" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }} onClick={() => setSelectedId(null)}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mb-5">
            <ChevronLeft size={16} /> Back
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedId ? (
          <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <div className="text-center mb-6">
              <p className="font-rozha text-2xl text-[#181D27]">Payment Tracking</p>
              <p className="font-work-sans text-sm text-[#414651] mt-1">
                Your active subscriptions and their status.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <span className="font-work-sans text-sm text-[#9CA3AF]">No active transactions</span>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {subscriptions.map((sub) => (
                  <motion.div key={sub.id} variants={cardVariants}
                    onClick={() => setSelectedId(sub.id)}
                    className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col gap-2 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
                    <p className="font-rozha text-base text-[#181D27]">{sub.plan.name}</p>
                    <p className="font-work-sans text-sm text-[#414651]">
                      {sub.plan.currency} {sub.plan.amount}/{sub.plan.interval === "MONTH" ? "mo" : "yr"}
                    </p>
                    <span className={`w-fit px-2 py-0.5 rounded-full font-work-sans text-xs font-medium ${
                      sub.status === "ACTIVE" ? "bg-green-50 text-green-600" :
                      sub.status === "CANCELED" ? "bg-red-50 text-red-500" :
                      "bg-gray-100 text-[#414651]"
                    }`}>
                      {sub.status}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="tracker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="max-w-2xl mx-auto">
            <p className="font-rozha text-2xl text-[#181D27] text-center mb-2">{selected?.plan.name}</p>
            <p className="font-work-sans text-sm text-[#414651] text-center mb-8">
              Status: <span className="font-semibold">{selected?.status}</span>
            </p>

            <div className="bg-[#F5F5F5] rounded-2xl px-8 py-6">
              <div className="flex items-start justify-between relative">
                <div className="absolute top-5 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 bg-gray-300 z-0" />
                {STEPS.map((step, i) => {
                  const isDone = i < activeStep;
                  const isActive = i === activeStep;
                  return (
                    <div key={step.label} className="flex flex-col items-center gap-2 z-10 flex-1">
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-work-sans text-sm font-bold transition-colors ${
                          isDone ? "bg-[#16A34A] text-white" : isActive ? "bg-[#181D27] text-white" : "bg-gray-300 text-white"
                        }`}>
                        {i + 1}
                      </motion.div>
                      <span className={`font-work-sans text-xs font-medium text-center ${
                        isActive ? "text-[#16A34A]" : "text-[#414651]"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

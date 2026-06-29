"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTransactStore } from "@/stores/transact/use-transact-store";

const textareaCls = "w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors resize-none";
const labelCls = "font-work-sans text-sm font-medium text-[#181D27]";

export function FinalRemarksStep() {
  const { data, updateData, setStep } = useTransactStore();

  const [notes, setNotes] = useState(data.notes);
  const [terms, setTerms] = useState(data.terms);

  return (
    <motion.div
      key="final-remarks"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col max-w-lg mx-auto w-full"
    >
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        Final Remarks
      </motion.h1>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Notes: <span className="text-red-500">*</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`Ex: "Thanks".`}
            rows={5}
            className={textareaCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Terms:</label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder={`Ex: "Payment due in 30 days".  (300 character limit)`}
            rows={5}
            maxLength={300}
            className={textareaCls}
          />
        </div>

        <div className="flex justify-center items-center gap-6 pt-2">
          <button
            onClick={() => {
              updateData({ notes, terms });
              setStep("proposal-details");
            }}
            className="font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              updateData({ notes: "", terms: "" });
              setStep("ready");
            }}
            className="font-work-sans text-sm text-[#414651] underline underline-offset-2"
          >
            Skip
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              updateData({ notes, terms });
              setStep("ready");
            }}
            className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

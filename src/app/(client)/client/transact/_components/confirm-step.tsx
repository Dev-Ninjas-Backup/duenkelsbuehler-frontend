"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, FileText } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { useTransactStore } from "@/stores/transact/use-transact-store";

export function ConfirmStep() {
  const { data, updateData, setStep } = useTransactStore();
  const sp = data.sp!;
  const contractFile = data.contractFile;
  const [docuSign, setDocuSign] = useState(data.docuSign ?? !!contractFile);

  const handleNext = () => {
    updateData({ docuSign });
    setStep("proposal-details");
  };

  const handleBack = () => {
    updateData({ docuSign });
    setStep("contract");
  };

  return (
    <motion.div
      key="confirm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center max-w-lg mx-auto w-full pt-4 pb-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        Confirm
      </motion.h1>

      {/* Selected SP Card */}
      <div className="w-full bg-[#F9F9F9] rounded-2xl px-6 py-4 flex items-center justify-start gap-4 mb-4 border border-gray-100/80">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-[#181D27] flex items-center justify-center text-white font-rozha text-lg">
          {sp.avatar ? (
            <Image src={sp.avatar} alt={sp.name} fill className="object-cover" />
          ) : (
            <span>{sp.name?.charAt(0).toUpperCase() ?? "?"}</span>
          )}
        </div>
        <div>
          <p className="font-rozha text-lg text-[#181D27] leading-snug">{sp.name}</p>
          {!sp.verified && (
            <span className="inline-flex items-center gap-1 font-work-sans text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-0.5">
              <AiFillWarning className="w-[11px] h-[11px]" /> Unverified
            </span>
          )}
        </div>
      </div>

      {/* File Card if attached */}
      {contractFile && (
        <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 flex items-center gap-4 mb-6 border border-gray-100/80">
          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0 text-white">
            <FileText size={20} />
          </div>
          <p className="font-rozha text-base text-[#181D27] flex-1 truncate">
            {contractFile.name}
          </p>
          <button
            type="button"
            onClick={() => updateData({ contractFile: null, docuSign: false })}
            className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            aria-label="Remove attached file"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* DocuSign Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer mb-8 self-center">
        <input
          type="checkbox"
          checked={docuSign}
          onChange={(e) => setDocuSign(e.target.checked)}
          className="w-4 h-4 accent-[#181D27] rounded border-gray-300"
        />
        <span className="font-work-sans text-xs text-[#414651]">
          Click this box to require a DocuSign signature before invoicing
        </span>
      </label>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-6 w-full">
        <button
          onClick={handleBack}
          className="font-work-sans text-sm text-[#535862] hover:text-[#181D27] transition-colors"
        >
          Back
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}

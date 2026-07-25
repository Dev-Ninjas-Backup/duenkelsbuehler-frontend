"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { useTransactStore } from "@/stores/transact/use-transact-store";

export function ContractStep() {
  const { data, updateData, setStep } = useTransactStore();
  const sp = data.sp!;
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(data.contractFile);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleNext = () => {
    updateData({ contractFile: file, docuSign: file ? true : data.docuSign });
    setStep("confirm");
  };

  const handleSkip = () => {
    updateData({ contractFile: null });
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("search");
  };

  return (
    <motion.div
      key="contract"
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
        Get it in Writing
      </motion.h1>

      {/* Selected SP Card */}
      <div className="w-full bg-[#F9F9F9] rounded-2xl px-6 py-4 flex items-center justify-start gap-4 mb-8 border border-gray-100/80">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-gray-200">
          <Image src={sp.avatar} alt={sp.name} fill className="object-cover" />
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

      {/* Crown + label */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-10 h-8 relative mb-1">
          <Image src="/svg/black_crown.svg" alt="Crown" fill className="object-contain" />
        </div>
        <p className="font-work-sans text-xs font-semibold text-[#181D27]">Optional (recommended):</p>
      </div>

      {/* Upload button & File Status */}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx"
        aria-label="Upload contract file"
        title="Upload contract file"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => fileRef.current?.click()}
        className="w-16 h-16 rounded-full bg-[#535862] hover:bg-[#181D27] flex items-center justify-center mb-4 transition-colors text-white shadow-sm"
      >
        <Upload size={24} />
      </motion.button>

      {file ? (
        <p className="font-work-sans text-sm font-semibold text-[#16A34A] mb-3 truncate max-w-xs">{file.name}</p>
      ) : (
        <p className="font-work-sans text-xs text-gray-400 mb-3">Click icon to select a PDF or DOCX file</p>
      )}

      <p className="font-work-sans text-xs text-[#535862] text-center max-w-sm mb-8 leading-relaxed">
        Upload your contract agreement. This will be emailed to the selected contact. This protects you and helps ensure both parties are on the same page
      </p>

      {/* Navigation Row */}
      <div className="flex items-center justify-center gap-6 w-full">
        <button
          onClick={handleBack}
          className="font-work-sans text-sm text-[#535862] hover:text-[#181D27] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSkip}
          className="font-work-sans text-sm text-[#535862] hover:text-[#181D27] underline underline-offset-2"
        >
          Skip
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

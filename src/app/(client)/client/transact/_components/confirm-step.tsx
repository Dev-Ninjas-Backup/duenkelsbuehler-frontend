"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { SP } from "./types";

export function ConfirmStep({
  sp,
  contractFile,
  onNext,
  onRemoveFile,
}: {
  sp: SP;
  contractFile: File | null;
  onNext: (docuSign: boolean) => void;
  onRemoveFile: () => void;
}) {
  const [docuSign, setDocuSign] = useState(false);

  return (
    <motion.div
      key="confirm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center max-w-lg mx-auto w-full"
    >
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        Confirm
      </motion.h1>

      {/* SP Card */}
      <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
          <Image src={sp.avatar} alt={sp.name} width={48} height={48} className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="font-rozha text-lg text-[#181D27]">{sp.name}</p>
          {!sp.verified && (
            <span className="inline-flex items-center gap-1 font-work-sans text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-0.5">
              <AiFillWarning className="w-[11px] h-[11px]" /> Unverified
            </span>
          )}
        </div>
      </div>

      {/* File card */}
      {contractFile && (
        <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-red-500">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16z" />
            </svg>
          </div>
          <p className="font-rozha text-base text-[#181D27] flex-1">{contractFile.name}</p>
          <button onClick={onRemoveFile} className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
            <X size={14} className="text-white" />
          </button>
        </div>
      )}

      {/* DocuSign checkbox */}
      <label className="flex items-center gap-3 cursor-pointer mb-8 self-start">
        <input
          type="checkbox"
          checked={docuSign}
          onChange={(e) => setDocuSign(e.target.checked)}
          className="w-4 h-4 accent-[#181D27]"
        />
        <span className="font-work-sans text-sm text-[#414651]">
          Click this box to require a DocuSign signature before invoicing
        </span>
      </label>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onNext(docuSign)}
        className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
      >
        Next
      </motion.button>
    </motion.div>
  );
}

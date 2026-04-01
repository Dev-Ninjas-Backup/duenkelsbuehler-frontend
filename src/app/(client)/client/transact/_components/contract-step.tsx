"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { SP } from "./types";

export function ContractStep({
  sp,
  onNext,
  onSkip,
}: {
  sp: SP;
  onNext: (file: File | null) => void;
  onSkip: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  return (
    <motion.div
      key="contract"
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
        Get it in Writing
      </motion.h1>

      {/* SP Card */}
      <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 flex items-center gap-4 mb-8">
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

      {/* Crown + label */}
      <div className="flex flex-col items-center mb-6">
        <Image src="/svg/black_crown.svg" alt="Crown" width={48} height={32} className="object-contain mb-1" />
        <p className="font-work-sans text-sm text-[#414651]">Optional (recommended):</p>
      </div>

      {/* Upload button */}
      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" aria-label="Upload contract file" title="Upload contract file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => fileRef.current?.click()}
        className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mb-4 hover:bg-gray-400 transition-colors"
      >
        <Upload size={24} className="text-white" />
      </motion.button>

      {file && (
        <p className="font-work-sans text-sm text-[#16A34A] mb-2">{file.name}</p>
      )}

      <p className="font-work-sans text-sm text-[#414651] text-center max-w-xs mb-8 leading-relaxed">
        Upload your contract agreement. This will be emailed to the selected contact. This protects you and helps ensure both parties are on the same page
      </p>

      <div className="flex items-center gap-6">
        <button onClick={onSkip} className="font-work-sans text-sm text-[#414651] underline underline-offset-2">
          Skip
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNext(file)}
          className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, ShieldAlert, Bookmark, ChevronDown } from "lucide-react";
import { Contact } from "./types";
import { FinePrintModal } from "./fine-print-modal";
import { useSavedContracts } from "@/store/saved-contracts";

interface Props {
  contact: Contact;
  contractFile: File | null;
  docuSign: boolean;
  isSubscriber?: boolean;
  onFileChange: (file: File | null) => void;
  onDocuSignChange: (val: boolean) => void;
  onNext: (shouldSave: boolean) => void;
  onSkip: () => void;
}

export function ContractStep({
  contact, contractFile, docuSign, isSubscriber = true,
  onFileChange, onDocuSignChange, onNext, onSkip,
}: Props) {
  const [showModal, setShowModal] = useState(true);
  const [saveContract, setSaveContract] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { contracts } = useSavedContracts();

  const handleNext = () => onNext(saveContract);

  const handleFileChange = (file: File | null) => {
    onFileChange(file);
    setSaveContract(false);
  };

  return (
    <>
      <FinePrintModal isOpen={showModal} onNext={() => setShowModal(false)} onSkip={onSkip} />

      <div className="max-w-lg mx-auto w-full flex flex-col gap-5">
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-rozha text-2xl text-[#181D27]"
        >
          Get it in Writing
        </motion.h2>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-[#F5F5F5] rounded-2xl px-5 py-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
            <Image src={contact.avatar} alt={contact.name} width={48} height={48} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-work-sans text-sm font-bold text-[#181D27]">{contact.name}</p>
            {contact.badge === "gold" ? (
              <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A] mt-0.5">
                <Image src="/svg/crown.svg" alt="Verified" width={13} height={13} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 font-work-sans text-xs text-red-500 mt-0.5">
                <ShieldAlert size={13} /> Unverified
              </span>
            )}
          </div>
        </motion.div>

        {/* Saved contracts dropdown — subscriber only */}
        {isSubscriber && contracts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="flex flex-col gap-2"
          >
            <button
              onClick={() => setShowSaved((p) => !p)}
              className="flex items-center justify-between w-full bg-[#F5F5F5] rounded-2xl px-5 py-3 font-work-sans text-sm font-semibold text-[#181D27] hover:bg-gray-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Bookmark size={15} className="fill-[#181D27]" />
                Use a saved contract
              </span>
              <ChevronDown size={15} className={`transition-transform ${showSaved ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden flex flex-col gap-2"
                >
                  {contracts.map((c) => (
                    <motion.button
                      key={c.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { handleFileChange(c.file ?? null); setShowSaved(false); }}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <FileText size={18} className="text-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-work-sans text-sm font-semibold text-[#181D27] truncate">{c.fileName}</p>
                        <p className="font-work-sans text-xs text-[#9CA3AF]">Saved {c.savedAt}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* File preview or upload info */}
        <AnimatePresence mode="wait">
          {contractFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#F5F5F5] rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              <FileText size={28} className="text-red-500 shrink-0" />
              <span className="font-work-sans text-sm font-semibold text-[#181D27] flex-1 truncate">
                {contractFile.name}
              </span>
              <button aria-label="Remove file" onClick={() => handleFileChange(null)} className="text-red-500 hover:text-red-600 transition-colors shrink-0">
                <X size={20} className="bg-red-500 text-white rounded-full p-0.5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload-info"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex flex-col items-center gap-1">
                <Image src="/svg/black_crown.svg" alt="Crown" width={32} height={24} className="object-contain" />
                <span className="font-work-sans text-xs font-semibold text-[#181D27]">Optional (recommended):</span>
              </div>
              <p className="font-work-sans text-xs text-[#414651] max-w-sm">
                Upload your contract agreement. This will be emailed to the selected contact. This protects you and helps ensure both parties are on the same page
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DocuSign checkbox */}
        {contractFile && (
          <motion.label initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={docuSign}
              onChange={(e) => onDocuSignChange(e.target.checked)}
              title="Require DocuSign signature"
              className="mt-0.5 w-4 h-4 accent-[#181D27] cursor-pointer"
            />
            <span className="font-work-sans text-sm text-[#414651]">
              Click this box to require a DocuSign signature before invoicing
            </span>
          </motion.label>
        )}

        {/* Save contract checkbox — subscriber only, shown when file is selected */}
        {isSubscriber && contractFile && (
          <motion.label initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saveContract}
              onChange={(e) => setSaveContract(e.target.checked)}
              title="Save this contract"
              className="mt-0.5 w-4 h-4 accent-[#181D27] cursor-pointer"
            />
            <span className="font-work-sans text-sm text-[#414651] flex items-center gap-1.5">
              <Bookmark size={13} className="shrink-0" />
              Save this contract for future use
            </span>
          </motion.label>
        )}

        {/* Upload button */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          aria-label="Upload contract file"
          title="Upload contract file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        />
        <div className="flex items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            aria-label="Upload contract"
            onClick={() => fileRef.current?.click()}
            className="w-14 h-14 rounded-full bg-[#6B7280] flex items-center justify-center text-white shadow-md hover:bg-[#4B5563] transition-colors"
          >
            <Upload size={22} />
          </motion.button>
        </div>

        {/* Skip + Next */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button onClick={onSkip} className="font-work-sans text-sm text-[#414651] underline underline-offset-2 hover:text-[#181D27] transition-colors">
            Skip
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
          >
            Next
          </motion.button>
        </div>
      </div>
    </>
  );
}

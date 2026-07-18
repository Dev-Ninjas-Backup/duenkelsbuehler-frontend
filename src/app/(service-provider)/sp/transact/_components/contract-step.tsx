"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Bookmark, ChevronDown, Loader2 } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { Contact } from "./types";
import { FinePrintModal } from "./fine-print-modal";
import { useUploadDocument } from "@/hooks/files/use-files";
import { useMyTemplates } from "@/hooks/contract-templates/use-contract-templates";
import { contractTemplatesService } from "@/services/contract-templates/contract-templates-service";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import { toast } from "sonner";

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
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  const token = useAuthStore((s) => s.accessToken) ?? "";
  const { data: templates = [] } = useMyTemplates();
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();

  const handleNext = () => onNext(saveContract);

  const handleFileChange = (file: File | null) => {
    if (!file) { onFileChange(null); setSaveContract(false); return; }
    uploadDocument(file, {
      onSuccess: () => onFileChange(file),
      onError: () => onFileChange(file), // still allow local use even if upload fails
    });
    setSaveContract(false);
  };

  const handleSelectTemplate = async (templateId: number, originalName: string) => {
    setIsLoadingFile(true);
    try {
      const blob = await contractTemplatesService.download(templateId, token);
      const file = new File([blob], originalName, { type: blob.type });
      handleFileChange(file);
      setShowSaved(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to load template file");
    } finally {
      setIsLoadingFile(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#181D27] flex items-center justify-center shrink-0">
            {contact.avatar ? (
              <Image src={contact.avatar} alt={contact.name} width={48} height={48} className="object-cover w-full h-full" />
            ) : (
              <span className="font-rozha text-lg text-white">{contact.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="font-work-sans text-sm font-bold text-[#181D27]">{contact.name}</p>
            {contact.badge === "gold" ? (
              <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A] mt-0.5">
                <Image src="/svg/crown.svg" alt="Verified" width={13} height={13} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 font-work-sans text-xs text-red-500 mt-0.5">
                <AiFillWarning className="w-4 h-4" /> Unverified
              </span>
            )}
          </div>
        </motion.div>

        {/* Saved contracts dropdown — subscriber only */}
        {isSubscriber && templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="flex flex-col gap-2"
          >
            <button
              onClick={() => setShowSaved((p) => !p)}
              disabled={isLoadingFile}
              className="flex items-center justify-between w-full bg-[#F5F5F5] rounded-2xl px-5 py-3 font-work-sans text-sm font-semibold text-[#181D27] hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              <span className="flex items-center gap-2">
                {isLoadingFile ? (
                  <Loader2 size={15} className="animate-spin text-[#181D27]" />
                ) : (
                  <Bookmark size={15} className="fill-[#181D27]" />
                )}
                Use a saved template
              </span>
              <ChevronDown size={15} className={`transition-transform ${showSaved ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden flex flex-col gap-2 bg-white border border-gray-100 rounded-xl p-2 max-h-60 overflow-y-auto"
                >
                  {templates.map((t) => (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTemplate(t.id, t.originalName)}
                      className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-100/60 rounded-xl px-4 py-3 transition-colors text-left w-full cursor-pointer"
                    >
                      <FileText size={18} className="text-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-work-sans text-sm font-semibold text-[#181D27] truncate">{t.title}</p>
                        <p className="font-work-sans text-xs text-[#9CA3AF]">Saved {formatDate(t.createdAt)}</p>
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
              <button aria-label="Remove file" onClick={() => handleFileChange(null)} className="text-red-500 hover:text-red-600 transition-colors shrink-0 cursor-pointer">
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
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-start gap-3 ${isSubscriber ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
          >
            <input
              type="checkbox"
              checked={isSubscriber ? docuSign : false}
              disabled={!isSubscriber}
              onChange={(e) => onDocuSignChange(e.target.checked)}
              title={isSubscriber ? "Require DocuSign signature" : "Premium subscription required"}
              className="mt-0.5 w-4 h-4 accent-[#181D27]"
            />
            <span className="font-work-sans text-sm text-[#414651]">
              Click this box to require a DocuSign signature before invoicing {!isSubscriber && <span className="text-red-500 font-semibold">(Premium Only)</span>}
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
            disabled={isUploading || isLoadingFile}
            className="w-14 h-14 rounded-full bg-[#6B7280] flex items-center justify-center text-white shadow-md hover:bg-[#4B5563] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isUploading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Upload size={22} />
            )}
          </motion.button>
        </div>

        {/* Skip + Next */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button onClick={onSkip} className="font-work-sans text-sm text-[#414651] underline underline-offset-2 hover:text-[#181D27] transition-colors cursor-pointer">
            Skip
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors cursor-pointer"
          >
            Next
          </motion.button>
        </div>
      </div>
    </>
  );
}

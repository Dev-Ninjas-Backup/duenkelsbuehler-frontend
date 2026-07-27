"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Bookmark, ChevronDown, Loader2 } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { useTransactStore } from "@/stores/transact/use-transact-store";
import { useMyTemplates } from "@/hooks/contract-templates/use-contract-templates";
import { contractTemplatesService } from "@/services/contract-templates/contract-templates-service";
import { useUploadDocument } from "@/hooks/files/use-files";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import { toast } from "sonner";

export function ContractStep() {
  const { data, updateData, setStep } = useTransactStore();
  const sp = data.sp!;
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(data.contractFile);
  const [saveContract, setSaveContract] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const token = useAuthStore((s) => s.accessToken) ?? "";
  const { data: templates = [] } = useMyTemplates();
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();

  const handleFileChange = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      setSaveContract(false);
      return;
    }
    setFile(selected);
    uploadDocument(selected, {
      onSuccess: () => setFile(selected),
      onError: () => setFile(selected),
    });
    setSaveContract(false);
  };

  const handleSelectTemplate = async (templateId: number, originalName: string) => {
    setIsLoadingFile(true);
    try {
      const blob = await contractTemplatesService.download(templateId, token);
      const selectedFile = new File([blob], originalName, { type: blob.type });
      handleFileChange(selectedFile);
      setShowSaved(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to load template file");
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleNext = async () => {
    if (saveContract && file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
        formData.append("description", "Saved from proposal creation");
        await contractTemplatesService.upload(formData, token);
        toast.success("Contract saved to templates!");
      } catch (err: any) {
        console.error("Failed to save template", err);
      }
    }
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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
      <div className="w-full bg-[#F9F9F9] rounded-2xl px-6 py-4 flex items-center justify-start gap-4 mb-6 border border-gray-100/80">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-gray-200">
          {sp.avatar ? (
            <Image src={sp.avatar} alt={sp.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#181D27] text-white font-rozha text-lg">
              {sp.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-rozha text-lg text-[#181D27] leading-snug">{sp.name}</p>
          {sp.verified ? (
            <span className="inline-flex items-center gap-1 font-work-sans text-xs text-[#16A34A] bg-green-50 px-2 py-0.5 rounded-full mt-0.5">
              <Image src="/svg/crown.svg" alt="Verified" width={12} height={12} /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-work-sans text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-0.5">
              <AiFillWarning className="w-[11px] h-[11px]" /> Unverified
            </span>
          )}
        </div>
      </div>

      {/* Saved contracts dropdown */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2 w-full mb-6"
      >
        <button
          onClick={() => setShowSaved((p) => !p)}
          disabled={isLoadingFile}
          className="flex items-center justify-between w-full bg-[#F5F5F5] rounded-2xl px-5 py-3 font-work-sans text-sm font-semibold text-[#181D27] hover:bg-gray-200 transition-colors disabled:opacity-60 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {isLoadingFile ? (
              <Loader2 size={15} className="animate-spin text-[#181D27]" />
            ) : (
              <Bookmark size={15} className="fill-[#181D27]" />
            )}
            Use a saved template {templates.length > 0 && `(${templates.length})`}
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
              {templates.length > 0 ? (
                templates.map((t) => (
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
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="font-work-sans text-xs text-gray-500">
                    No saved templates yet. Upload a contract file below and check &quot;Save this contract for future use&quot;.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File Preview or Crown Info */}
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full bg-[#F5F5F5] rounded-2xl px-5 py-4 flex items-center gap-4 mb-6"
          >
            <FileText size={28} className="text-red-500 shrink-0" />
            <span className="font-work-sans text-sm font-semibold text-[#181D27] flex-1 truncate">
              {file.name}
            </span>
            <button
              aria-label="Remove file"
              onClick={() => handleFileChange(null)}
              className="text-red-500 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
            >
              <X size={20} className="bg-red-500 text-white rounded-full p-0.5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="upload-info"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center gap-2 text-center mb-6"
          >
            <div className="flex flex-col items-center gap-1">
              <Image src="/svg/black_crown.svg" alt="Crown" width={32} height={24} className="object-contain" />
              <p className="font-work-sans text-xs font-semibold text-[#181D27]">Optional (recommended):</p>
            </div>
            <p className="font-work-sans text-xs text-[#535862] max-w-sm leading-relaxed">
              Upload your contract agreement. This will be emailed to the selected contact. This protects you and helps ensure both parties are on the same page
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save contract checkbox if file selected */}
      {file && (
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-6 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={saveContract}
            onChange={(e) => setSaveContract(e.target.checked)}
            className="w-4 h-4 accent-[#181D27] cursor-pointer"
          />
          <span className="font-work-sans text-xs text-[#414651] flex items-center gap-1.5 font-medium">
            <Bookmark size={13} className="shrink-0" />
            Save this contract for future use
          </span>
        </motion.label>
      )}

      {/* Upload Button */}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx"
        aria-label="Upload contract file"
        title="Upload contract file"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
      />
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => fileRef.current?.click()}
        disabled={isUploading || isLoadingFile}
        className="w-16 h-16 rounded-full bg-[#535862] hover:bg-[#181D27] flex items-center justify-center mb-8 transition-colors text-white shadow-sm disabled:opacity-60 cursor-pointer"
      >
        {isUploading || isLoadingFile ? (
          <Loader2 size={24} className="animate-spin text-white" />
        ) : (
          <Upload size={24} />
        )}
      </motion.button>

      {/* Navigation Row */}
      <div className="flex items-center justify-center gap-6 w-full">
        <button
          onClick={handleBack}
          className="font-work-sans text-sm text-[#535862] hover:text-[#181D27] transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={handleSkip}
          className="font-work-sans text-sm text-[#535862] hover:text-[#181D27] underline underline-offset-2 cursor-pointer"
        >
          Skip
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors cursor-pointer"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}

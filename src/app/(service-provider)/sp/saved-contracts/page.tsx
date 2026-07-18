"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Search,
  Send,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import {
  useMyTemplates,
  useUploadTemplate,
  useDeleteTemplate,
  useSendFromTemplate,
} from "@/hooks/contract-templates/use-contract-templates";
import { contractTemplatesService } from "@/services/contract-templates/contract-templates-service";
import {
  useSearchClients,
  useSPSentProposals,
  useReceivedProposals,
  useDocusignSignUrl,
} from "@/hooks/sp/use-sp";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

// File size utility formatter
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// File icon selector helper
const FILE_ICONS: Record<string, string> = {
  pdf: "📄",
  docx: "📝",
  doc: "📝",
  png: "🖼️",
  jpg: "🖼️",
  jpeg: "🖼️",
};
const getFileIcon = (fileType: string) => FILE_ICONS[fileType?.toLowerCase()] ?? "📁";

// Date formatting helper
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function SavedContractsPage() {
  const token = useAuthStore((s) => s.accessToken) ?? "";

  // Queries / Mutations for templates
  const { data: templates = [], isLoading: isLoadingTemplates } = useMyTemplates();
  const uploadTemplateMutation = useUploadTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const sendFromTemplateMutation = useSendFromTemplate();
  const getSignUrlMutation = useDocusignSignUrl();

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(templates.length / pageSize));
  const paginatedTemplates = templates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // Download Handler
  const handleDownload = async (id: number, originalName: string) => {
    try {
      const blob = await contractTemplatesService.download(id, token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = originalName;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (err: any) {
      toast.error(err.message || "Failed to download template file");
    }
  };

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this template permanently?")) return;
    try {
      await deleteTemplateMutation.mutateAsync(id);
      toast.success("Template deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete template");
    }
  };

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-6 shrink-0">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center sm:text-left"
        >
          Saved Templates
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-[#181D27] hover:bg-[#181D27]/90 text-white rounded-full px-5 py-2.5 font-work-sans text-sm font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Upload New Template
        </motion.button>
      </div>

      {/* Table Header (Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="hidden lg:grid bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3"
        style={{ gridTemplateColumns: "40px 1.5fr 1fr 120px 220px" }}
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Template Title</span>
        <span className="font-work-sans text-sm font-medium">Filename</span>
        <span className="font-work-sans text-sm font-medium">Details</span>
        <span className="font-work-sans text-sm font-medium text-center">Action</span>
      </motion.div>

      {/* Loading state */}
      {isLoadingTemplates && (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#181D27] mb-2" />
          <p className="font-work-sans text-sm text-[#9CA3AF]">Loading templates...</p>
        </div>
      )}

      {/* Empty state */}
      <AnimatePresence>
        {!isLoadingTemplates && templates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center py-16"
          >
            <p className="font-work-sans text-sm text-[#9CA3AF] text-center max-w-md">
              No templates saved yet. Upload documents (PDF, DOCX) to save them here and send them via DocuSign anytime without re-uploading.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Rows */}
      {!isLoadingTemplates && templates.length > 0 && (
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            {paginatedTemplates.map((t, index) => (
              <motion.div
                key={t.id}
                variants={rowVariants}
                className="flex flex-col lg:grid bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 items-start lg:items-center border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0"
                style={{ gridTemplateColumns: "40px 1.5fr 1fr 120px 220px" }}
              >
                {/* Desktop Sl */}
                <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                  {(currentPage - 1) * pageSize + index + 1}
                </span>

                {/* Mobile Header with ID & Actions */}
                <div className="flex w-full items-center justify-between lg:hidden mb-1 border-b border-gray-200 pb-3">
                  <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Template #{(currentPage - 1) * pageSize + index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleDownload(t.id, t.originalName)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors shrink-0"
                      aria-label="Download template"
                    >
                      <Download className="h-[14px] w-[14px]" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setIsSendOpen(true);
                      }}
                      className="w-8 h-8 rounded-full bg-[#181D27] shadow-sm flex items-center justify-center text-white hover:bg-[#181D27]/90 transition-colors shrink-0"
                      aria-label="Use template"
                    >
                      <Send className="h-[12px] w-[12px]" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleDelete(t.id)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      aria-label="Delete template"
                    >
                      <Trash2 className="h-[14px] w-[14px]" />
                    </motion.button>
                  </div>
                </div>

                {/* Title and Icon */}
                <div className="flex w-full items-center gap-4 lg:w-auto">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <span className="text-xl">{getFileIcon(t.fileType)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-work-sans text-[15px] font-bold text-[#181D27] truncate mb-0.5">
                      {t.title}
                    </p>
                    {t.description && (
                      <p className="font-work-sans text-xs text-[#535862] line-clamp-1 italic">
                        {t.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Filename (Desktop) */}
                <div className="hidden lg:block min-w-0 w-full pr-4">
                  <p className="font-work-sans text-sm text-[#414651] truncate">{t.originalName}</p>
                </div>

                {/* Details (Size, Date) */}
                <div className="min-w-0 w-full lg:w-auto pl-14 lg:pl-0">
                  <p className="font-work-sans text-xs font-semibold text-[#181D27]">
                    {formatFileSize(t.fileSize)}
                  </p>
                  <p className="font-work-sans text-[11px] text-[#535862] mt-0.5">
                    Saved {formatDate(t.createdAt)}
                  </p>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center justify-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDownload(t.id, t.originalName)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                    title="Download original file"
                  >
                    <Download className="h-[14px] w-[14px]" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedTemplate(t);
                      setIsSendOpen(true);
                    }}
                    className="h-8 px-3.5 rounded-full bg-[#181D27] text-white hover:bg-[#181D27]/90 transition-colors font-work-sans text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    title="Send contract using this template"
                  >
                    <Send className="h-[11px] w-[11px]" />
                    Use Template
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDelete(t.id)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    title="Delete template"
                  >
                    <Trash2 className="h-[14px] w-[14px]" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Pagination */}
      {!isLoadingTemplates && templates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 mb-2 shrink-0 gap-4 sm:gap-0"
        >
          {/* Page size dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-work-sans text-sm text-[#414651]">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Entries per page"
              className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer bg-white"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="font-work-sans text-sm text-[#414651]">entries</span>
          </div>

          {/* Page numbers */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]"
                >
                  ...
                </span>
              ) : (
                <motion.button
                  key={page}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-[#181D27] text-white font-bold"
                      : "border border-gray-200 text-[#414651] hover:bg-gray-50"
                  }`}
                >
                  {page}
                </motion.button>
              )
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Upload Template Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <UploadModal
            onClose={() => setIsUploadOpen(false)}
            onUpload={async (title, description, file) => {
              const formData = new FormData();
              formData.append("title", title);
              if (description) formData.append("description", description);
              formData.append("file", file);

              try {
                await uploadTemplateMutation.mutateAsync(formData);
                toast.success("Contract template uploaded successfully!");
                setIsUploadOpen(false);
              } catch (err: any) {
                toast.error(err.message || "Failed to upload contract template");
              }
            }}
            isPending={uploadTemplateMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* Use Template Modal */}
      <AnimatePresence>
        {isSendOpen && selectedTemplate && (
          <UseTemplateModal
            template={selectedTemplate}
            onClose={() => {
              setIsSendOpen(false);
              setSelectedTemplate(null);
            }}
            onSend={async (sendData) => {
              try {
                const res = await sendFromTemplateMutation.mutateAsync(sendData);
                if (res?.overageWarning) {
                  toast.warning(res.overageWarning, { duration: 6000 });
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                } else {
                  toast.success("Contract envelope successfully created! Redirecting to sign...");
                }

                // Redirect client straight to sign URL
                const signUrlRes = await getSignUrlMutation.mutateAsync(res.dbId);
                if (signUrlRes && signUrlRes.url) {
                  window.location.href = signUrlRes.url;
                } else {
                  toast.error("Failed to fetch signature URL, please sign from proposals portal.");
                  setIsSendOpen(false);
                  setSelectedTemplate(null);
                }
              } catch (err: any) {
                toast.error(err.message || "Failed to send template contract");
              }
            }}
            isPending={sendFromTemplateMutation.isPending || getSignUrlMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// UPLOAD MODAL COMPONENT
// ──────────────────────────────────────────────────────────────────
interface UploadModalProps {
  onClose: () => void;
  onUpload: (title: string, description: string, file: File) => Promise<void>;
  isPending: boolean;
}

function UploadModal({ onClose, onUpload, isPending }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a contract document file");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a template title");
      return;
    }
    onUpload(title, description, file);
  };

  const content = (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-100 flex flex-col gap-5"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div>
          <h3 className="font-rozha text-xl sm:text-2xl text-[#181D27] leading-tight">
            Upload Template
          </h3>
          <p className="font-work-sans text-xs text-[#535862] mt-1">
            Save a reusable PDF or Word document as a template.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Template Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Standard Service Agreement"
              required
              disabled={isPending}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#181D27] font-work-sans text-sm bg-white"
            />
          </div>

          <div>
            <label className="block font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what projects this template applies to..."
              rows={2}
              disabled={isPending}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#181D27] font-work-sans text-sm resize-none bg-white"
            />
          </div>

          <div>
            <label className="block font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Document File (PDF/DOCX/JPG/PNG) *
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div
              onClick={() => !isPending && fileRef.current?.click()}
              className={`border-2 border-dashed border-gray-200 hover:border-[#181D27] transition-colors rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer text-center ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-2">
                <Plus size={20} />
              </div>
              {file ? (
                <p className="font-work-sans text-sm text-[#16A34A] font-semibold truncate max-w-xs">
                  {file.name}
                </p>
              ) : (
                <>
                  <p className="font-work-sans text-sm text-gray-700 font-medium">
                    Click to select template file
                  </p>
                  <p className="font-work-sans text-xs text-gray-400 mt-0.5">
                    Supports PDF, Word, or images up to 25MB
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-36 h-12 rounded-full border border-gray-200 text-gray-600 font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                </>
              ) : (
                "Save Template"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}

// ──────────────────────────────────────────────────────────────────
// USE TEMPLATE MODAL COMPONENT
// ──────────────────────────────────────────────────────────────────
interface UseTemplateModalProps {
  template: any;
  onClose: () => void;
  onSend: (data: {
    templateId: number;
    title?: string;
    clientId: number;
    proposalId?: number;
  }) => Promise<void>;
  isPending: boolean;
}

function UseTemplateModal({ template, onClose, onSend, isPending }: UseTemplateModalProps) {
  const [customTitle, setCustomTitle] = useState("");
  const [search, setSearch] = useState("");
  const [clientSearchPage, setClientSearchPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch search results
  const { data: searchResults, isLoading: isSearchingClients } = useSearchClients({
    search,
    page: clientSearchPage,
    limit: 5,
  });

  const clients = useMemo(() => {
    const rawClients = Array.isArray(searchResults?.data) ? searchResults.data : [];
    return rawClients.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.imageUrl || "/images/user/user_avatar.png",
      verified: u.isIdentityVerified || false,
    }));
  }, [searchResults]);

  // Fetch proposals (to optionally link)
  const sentProposalsQuery = useSPSentProposals();
  const receivedProposalsQuery = useReceivedProposals();

  // Combine & Filter proposals matching selected client which are ACCEPTED
  const availableProposals = useMemo(() => {
    if (!selectedClient) return [];
    const all = [
      ...(sentProposalsQuery.data || []),
      ...(receivedProposalsQuery.data || []),
    ];
    // Filter duplicates by id, match current client, and match status ACCEPTED
    const seenIds = new Set<number>();
    return all.filter((p: any) => {
      if (seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return p.client?.id === selectedClient.id && p.status === "ACCEPTED";
    });
  }, [selectedClient, sentProposalsQuery.data, receivedProposalsQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      toast.error("Please search and select a client user");
      return;
    }

    onSend({
      templateId: template.id,
      title: customTitle.trim() || undefined,
      clientId: selectedClient.id,
      proposalId: selectedProposalId ? Number(selectedProposalId) : undefined,
    });
  };

  const content = (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-100 flex flex-col gap-4 overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div>
          <h3 className="font-rozha text-xl sm:text-2xl text-[#181D27] leading-tight">
            Send with Template
          </h3>
          <p className="font-work-sans text-xs text-[#535862] mt-1">
            Send a DocuSign envelope using this saved template.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Template Info */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
            <span className="text-xl">📄</span>
            <div className="min-w-0 flex-1">
              <p className="font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wide">
                Using Template
              </p>
              <p className="font-work-sans text-sm font-semibold text-[#181D27] truncate">
                {template.title}
              </p>
            </div>
          </div>

          {/* Custom title */}
          <div>
            <label className="block font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Custom Contract Title (Optional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Defaults to template title"
              disabled={isPending}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#181D27] font-work-sans text-sm bg-white"
            />
          </div>

          {/* Select client section */}
          <div>
            <label className="block font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Select Client *
            </label>

            {selectedClient ? (
              <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-work-sans text-sm font-semibold text-[#181D27] truncate">
                      {selectedClient.name}
                    </p>
                    <p className="font-work-sans text-xs text-[#535862] truncate">
                      {selectedClient.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClient(null);
                    setSelectedProposalId("");
                  }}
                  className="text-red-500 hover:text-red-700 font-semibold font-work-sans text-xs underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="relative w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setClientSearchPage(1);
                    }}
                    placeholder="Search client by name or email..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#181D27] font-work-sans text-xs bg-white"
                  />
                </div>

                {/* Client results list */}
                {search.trim().length > 0 && (
                  <div className="border border-gray-100 rounded-xl max-h-40 overflow-y-auto flex flex-col divide-y divide-gray-100 bg-white">
                    {isSearchingClients ? (
                      <p className="p-3 text-center text-xs font-work-sans text-gray-400">
                        Searching...
                      </p>
                    ) : clients.length === 0 ? (
                      <p className="p-3 text-center text-xs font-work-sans text-gray-400">
                        No clients found
                      </p>
                    ) : (
                      clients.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedClient(c)}
                          className="flex items-center gap-3 p-2.5 hover:bg-gray-50 cursor-pointer text-left transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100">
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-work-sans text-xs font-semibold text-[#181D27] truncate">
                              {c.name}
                            </p>
                            <p className="font-work-sans text-[10px] text-gray-500 truncate">
                              {c.email}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Link to Proposal (Enabled only when client is selected) */}
          {selectedClient && (
            <div>
              <label className="block font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Link to Proposal (Optional)
              </label>
              <select
                value={selectedProposalId}
                onChange={(e) => setSelectedProposalId(e.target.value)}
                disabled={isPending}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#181D27] font-work-sans text-xs bg-white cursor-pointer"
              >
                <option value="">-- No linked proposal --</option>
                {availableProposals.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.proposalTitle} ({p.proposedPrice} {p.currency})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-4 justify-center pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-36 h-12 rounded-full border border-gray-200 text-gray-600 font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !selectedClient}
              className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={14} /> Send Contract
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  DollarSign,
  Calendar,
  User,
  FolderOpen,
  Eye,
  AlertCircle,
  Download
} from "lucide-react";
import { useAdminDeals, useAdminDeal } from "@/hooks/admin/use-admin";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

// Color-coded status helpers
function getDocStatusBadge(status: string) {
  let bg = "bg-gray-100 text-gray-700 border-gray-200";
  if (status === "SENT") bg = "bg-blue-50 text-blue-700 border-blue-200/60";
  else if (status === "VIEWED") bg = "bg-amber-50 text-amber-700 border-amber-200/60";
  else if (status === "SIGNED") bg = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  else if (status === "REJECTED") bg = "bg-rose-50 text-rose-700 border-rose-200/60";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
      {status}
    </span>
  );
}

function getPaymentStatusBadge(status: string) {
  let bg = "bg-gray-100 text-gray-600 border-gray-200";
  if (status === "SUCCESS") bg = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  else if (status === "REFUNDED") bg = "bg-purple-50 text-purple-700 border-purple-200/60";
  else if (status === "FAILED") bg = "bg-rose-50 text-rose-700 border-rose-200/60";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
      {status}
    </span>
  );
}

function getWorkingStatusBadge(status: string) {
  let bg = "bg-gray-100 text-gray-500 border-gray-200";
  if (status === "START_FROM_PROVIDER") bg = "bg-blue-50 text-blue-700 border-blue-200/60";
  else if (status === "FINISED_FROM_CLIENT") bg = "bg-violet-50 text-violet-700 border-violet-200/60";
  else if (status === "FINISHED") bg = "bg-emerald-50 text-emerald-700 border-emerald-200/60";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
      {status === "START_FROM_PROVIDER" ? "IN_PROGRESS" : status === "FINISED_FROM_CLIENT" ? "CLIENT_APPROVED" : status}
    </span>
  );
}

// Sidebar Drawer details modal
interface DealDetailDrawerProps {
  dealId: number;
  onClose: () => void;
}

function DealDetailDrawer({ dealId, onClose }: DealDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const { data: deal, isLoading, error } = useAdminDeal(dealId);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy • hh:mm a");
    } catch {
      return dateStr;
    }
  };

  const getFullDownloadUrl = (path?: string) => {
    if (!path) return "#";
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    // Check if path is absolute URL
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanBase = base.endsWith("/api") ? base.slice(0, -4) : base;
    return `${cleanBase}/${path}`;
  };

  if (!mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[999] flex justify-end overflow-hidden">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
      />

      {/* Slide-over panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        className="relative w-full sm:max-w-xl h-full bg-white shadow-2xl z-[1000] flex flex-col p-6 sm:p-8 overflow-y-auto rounded-l-[30px] border-l border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <svg className="animate-spin h-8 w-8 text-[#181D27] mb-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-work-sans text-sm text-gray-500">Loading details...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <h4 className="font-rozha text-lg text-[#181D27] mb-1">Failed to load deal</h4>
            <p className="font-work-sans text-xs text-red-600 max-w-sm">{(error as any)?.message || "Network error. Please try again."}</p>
          </div>
        ) : deal ? (
          <div className="flex flex-col gap-6 flex-1 pr-1 mt-6">
            {/* Header info */}
            <div>
              <span className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Deal ID: #{deal.id}
              </span>
              <h3 className="font-rozha text-2xl text-[#181D27] leading-tight mb-3">
                {deal.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <div>{getDocStatusBadge(deal.status)}</div>
                <div>{getPaymentStatusBadge(deal.isPaymented)}</div>
                <div>{getWorkingStatusBadge(deal.wokringStatus)}</div>
              </div>
            </div>

            {/* Document Details Card */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
              <span className="font-work-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
                <FileText size={12} /> Agreement Document
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-work-sans text-xs font-bold text-[#181D27] truncate">{deal.title}</p>
                  <p className="font-work-sans text-[11px] text-gray-400 truncate mt-0.5">Envelope: {deal.envelopeId || "N/A"}</p>
                </div>
                <a
                  href={getFullDownloadUrl(deal.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181D27] hover:bg-[#181D27]/90 text-white rounded-xl font-work-sans text-[11px] font-semibold transition-colors shrink-0"
                >
                  <Download size={11} /> Download PDF
                </a>
              </div>
            </div>

            {/* Client / Provider Profiles */}
            <div className="grid grid-cols-2 gap-4">
              {/* Client profile */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                <span className="font-work-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <User size={11} /> Client (Payer)
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#181D27]/10 flex items-center justify-center font-rozha text-xs font-bold text-[#181D27] shrink-0">
                    {deal.client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-work-sans text-xs font-bold text-[#181D27] truncate">{deal.client.name}</p>
                    <p className="font-work-sans text-[10px] text-gray-500 truncate mt-0.5">{deal.client.email}</p>
                    <p className="font-work-sans text-[10px] text-gray-400 mt-0.5">{deal.client.country || "No Country Specified"}</p>
                  </div>
                </div>
              </div>

              {/* Provider profile */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                <span className="font-work-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <User size={11} /> Provider (Payee)
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#181D27]/10 flex items-center justify-center font-rozha text-xs font-bold text-[#181D27] shrink-0">
                    {deal.provider.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-work-sans text-xs font-bold text-[#181D27] truncate">{deal.provider.name}</p>
                    <p className="font-work-sans text-[10px] text-gray-500 truncate mt-0.5">{deal.provider.email}</p>
                    <p className="font-work-sans text-[10px] text-gray-400 mt-0.5">{deal.provider.country || "No Country Specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked proposal details */}
            {deal.proposal ? (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                <span className="font-work-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
                  <FolderOpen size={12} /> Linked Service Proposal
                </span>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <span className="font-work-sans text-[10px] text-gray-400">Proposal Title</span>
                    <p className="font-work-sans text-xs font-bold text-[#181D27] mt-0.5">{deal.proposal.proposalTitle}</p>
                  </div>
                  {deal.proposal.serviceDescription && (
                    <div>
                      <span className="font-work-sans text-[10px] text-gray-400">Scope of Work</span>
                      <p className="font-work-sans text-xs text-[#535862] mt-0.5 whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto custom-scrollbar bg-white/60 p-2 rounded-lg border border-gray-200/30">
                        {deal.proposal.serviceDescription}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-1 border-t border-gray-200/40 pt-2">
                    <div>
                      <span className="font-work-sans text-[10px] text-gray-400">Proposed Budget</span>
                      <p className="font-work-sans text-xs font-bold text-emerald-600 mt-0.5">
                        {deal.proposal.proposedPrice} {deal.proposal.currency}
                      </p>
                    </div>
                    <div>
                      <span className="font-work-sans text-[10px] text-gray-400">Payment Option</span>
                      <p className="font-work-sans text-xs font-bold text-[#181D27] mt-0.5 uppercase tracking-wider">
                        {deal.proposal.paymentMethod === "TRUST_APP" ? "Trust App" : deal.proposal.paymentMethod === "BANK_TRANSFER" ? "Bank Transfer" : deal.proposal.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-200/40 pt-2">
                    <div>
                      <span className="font-work-sans text-[10px] text-gray-400">Issue / Start Date</span>
                      <p className="font-work-sans text-xs font-bold text-[#181D27] mt-0.5">
                        {deal.proposal.issueDate ? format(new Date(deal.proposal.issueDate), "MMM dd, yyyy") : "—"}
                      </p>
                    </div>
                    <div>
                      <span className="font-work-sans text-[10px] text-gray-400">Due / Completion Date</span>
                      <p className="font-work-sans text-xs font-bold text-[#181D27] mt-0.5">
                        {deal.proposal.dueDate ? format(new Date(deal.proposal.dueDate), "MMM dd, yyyy") : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-work-sans text-xs text-gray-400 italic">No linked service proposal found for this deal.</p>
            )}

            {/* Timeline */}
            <div className="border-t border-gray-100 pt-4 mt-auto">
              <div className="flex items-center justify-between text-[11px] font-work-sans text-gray-400">
                <span>Created at: {formatDate(deal.createdAt)}</span>
                <span>Last updated: {formatDate(deal.updatedAt)}</span>
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
}

// Main page component
export default function DealManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);

  // Filter States
  const [filterDocStatus, setFilterDocStatus] = useState<string>("ALL");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("ALL");
  const [filterWorkingStatus, setFilterWorkingStatus] = useState<string>("ALL");

  // Fetch paginated & filtered deals
  const { data, isLoading, error } = useAdminDeals({
    page: currentPage,
    limit: pageSize,
    status: filterDocStatus === "ALL" ? undefined : filterDocStatus,
    isPaymented: filterPaymentStatus === "ALL" ? undefined : filterPaymentStatus,
    wokringStatus: filterWorkingStatus === "ALL" ? undefined : filterWorkingStatus,
  });

  const deals = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDocStatus, filterPaymentStatus, filterWorkingStatus, pageSize]);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100dvh-160px)]">
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-rozha text-2xl md:text-3xl text-[#181D27] shrink-0"
        >
          Deal Management
        </motion.h2>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Doc Status filter */}
          <div className="flex flex-col gap-0.5">
            <span className="font-work-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider">Document Status</span>
            <select
              value={filterDocStatus}
              onChange={(e) => setFilterDocStatus(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 font-work-sans text-xs font-semibold text-[#181D27] focus:outline-none cursor-pointer bg-white"
            >
              <option value="ALL">All Documents</option>
              <option value="CREATED">CREATED</option>
              <option value="SENT">SENT</option>
              <option value="VIEWED">VIEWED</option>
              <option value="SIGNED">SIGNED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* Payment Status filter */}
          <div className="flex flex-col gap-0.5">
            <span className="font-work-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment Status</span>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 font-work-sans text-xs font-semibold text-[#181D27] focus:outline-none cursor-pointer bg-white"
            >
              <option value="ALL">All Payments</option>
              <option value="INITIAL">INITIAL</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="REFUNDED">REFUNDED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          {/* Working Status filter */}
          <div className="flex flex-col gap-0.5">
            <span className="font-work-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider">Work Status</span>
            <select
              value={filterWorkingStatus}
              onChange={(e) => setFilterWorkingStatus(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 font-work-sans text-xs font-semibold text-[#181D27] focus:outline-none cursor-pointer bg-white"
            >
              <option value="ALL">All Work Status</option>
              <option value="NOT_STARTED">NOT_STARTED</option>
              <option value="START_FROM_PROVIDER">IN_PROGRESS</option>
              <option value="FINISED_FROM_CLIENT">CLIENT_APPROVED</option>
              <option value="FINISHED">FINISHED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 min-h-0 overflow-x-auto w-full custom-scrollbar">
        <div className="min-w-[950px] h-full flex flex-col">
          {/* Table Header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="grid grid-cols-[60px_2.5fr_1.5fr_1.5fr_1.2fr_1.2fr_1.2fr_60px] bg-[#181D27] text-white rounded-xl px-6 py-4 items-center shrink-0 mb-4 font-work-sans text-xs font-medium"
          >
            <span>Sl</span>
            <span>Agreement Title</span>
            <span>Client (Payer)</span>
            <span>Provider (Payee)</span>
            <span>Document Status</span>
            <span>Payment Status</span>
            <span>Work Status</span>
            <span className="text-center">Details</span>
          </motion.div>

          {/* Table Rows */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <svg className="animate-spin h-8 w-8 text-[#181D27] mb-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="font-work-sans text-sm text-[#535862]">Fetching deals...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center bg-red-50/20 border border-red-100 rounded-3xl p-6">
              <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
              <h4 className="font-rozha text-lg text-[#181D27] mb-1">Failed to load deals</h4>
              <p className="font-work-sans text-xs text-red-600">{(error as any)?.message || "Network error. Please try again later."}</p>
            </div>
          ) : deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 bg-[#F9F9F9] border border-gray-100 rounded-3xl p-8 text-center">
              <FileText className="w-10 h-10 text-gray-300 mb-3" />
              <h4 className="font-rozha text-lg text-[#181D27] mb-1">No deals found</h4>
              <p className="font-work-sans text-xs text-gray-500 max-w-xs">No active agreements match the selected status filters.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1 min-h-0 custom-scrollbar pb-2"
            >
              {deals.map((deal: any, index: number) => (
                <motion.div
                  key={deal.id}
                  variants={rowVariants}
                  className="grid grid-cols-[60px_2.5fr_1.5fr_1.5fr_1.2fr_1.2fr_1.2fr_60px] items-center bg-[#F9F9F9] hover:bg-[#F3F4F6]/40 transition-colors border border-gray-200/50 rounded-2xl px-6 py-4.5 shrink-0"
                >
                  <span className="font-work-sans text-xs text-[#535862]">
                    {(currentPage - 1) * pageSize + index + 1}
                  </span>

                  <span className="font-work-sans text-xs font-bold text-[#181D27] leading-snug truncate pr-4">
                    {deal.title}
                  </span>

                  <div className="min-w-0 pr-2">
                    <p className="font-work-sans text-xs font-semibold text-[#181D27] truncate">{deal.client.name}</p>
                    <p className="font-work-sans text-[10px] text-gray-400 truncate mt-0.5">{deal.client.email}</p>
                  </div>

                  <div className="min-w-0 pr-2">
                    <p className="font-work-sans text-xs font-semibold text-[#181D27] truncate">{deal.provider.name}</p>
                    <p className="font-work-sans text-[10px] text-gray-400 truncate mt-0.5">{deal.provider.email}</p>
                  </div>

                  <div>{getDocStatusBadge(deal.status)}</div>
                  <div>{getPaymentStatusBadge(deal.isPaymented)}</div>
                  <div>{getWorkingStatusBadge(deal.wokringStatus)}</div>

                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDealId(deal.id)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] hover:border-[#181D27]/30 transition-colors shadow-xs"
                      aria-label="View deal details"
                    >
                      <Eye size={13} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Pagination Bar */}
      {deals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between shrink-0 pt-2"
        >
          <div className="flex items-center gap-2">
            <span className="font-work-sans text-xs text-[#535862]">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Entries per page"
              className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-xs text-[#181D27] focus:outline-none cursor-pointer bg-white"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="font-work-sans text-xs text-[#535862]">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </motion.button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`e-${i}`}
                  className="w-8 h-8 flex items-center justify-center font-work-sans text-xs text-[#535862]"
                >
                  ...
                </span>
              ) : (
                <motion.button
                  key={page}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-8 h-8 rounded-full font-work-sans text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-[#181D27] text-white"
                      : "border border-gray-200 text-[#414651] hover:bg-gray-50 bg-white"
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
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Details Side-over Panel */}
      <AnimatePresence>
        {selectedDealId !== null && (
          <DealDetailDrawer
            dealId={selectedDealId}
            onClose={() => setSelectedDealId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useSavedContracts } from "@/store/saved-contracts";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function SavedContractsPage() {
  const { contracts, removeContract } = useSavedContracts();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.max(1, Math.ceil(contracts.length / pageSize));
  const paginated = contracts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const handleDownload = (file: File | undefined, name: string) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        Saved Contracts
      </motion.h1>

      {/* Table Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[40px_1fr_160px_120px] bg-[#181D27] text-white rounded-xl px-6 py-4 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Contract</span>
        <span className="font-work-sans text-sm font-medium">Details</span>
        <span className="font-work-sans text-sm font-medium text-center">Action</span>
      </motion.div>

      {/* Empty state */}
      <AnimatePresence>
        {contracts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <p className="font-work-sans text-sm text-[#9CA3AF] text-center py-12">
              No saved contracts yet. Save a contract during a transaction to reuse it later.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Rows */}
      {contracts.length > 0 && (
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 flex-1"
        >
          {paginated.map((c, index) => (
            <motion.div
              key={c.id}
              variants={rowVariants}
              className="grid grid-cols-[40px_1fr_160px_120px] bg-[#F9F9F9] rounded-xl px-6 py-4 items-center"
            >
              {/* Sl */}
              <span className="font-work-sans text-sm text-[#414651]">
                {(currentPage - 1) * pageSize + index + 1}
              </span>

              {/* Contract file info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-work-sans text-sm font-semibold text-[#181D27] truncate">{c.fileName}</p>
                  <p className="font-work-sans text-xs text-[#9CA3AF]">Saved {c.savedAt}</p>
                </div>
              </div>

              {/* Details — client + amount */}
              <div className="min-w-0">
                <p className="font-work-sans text-sm font-medium text-[#181D27] truncate">{c.clientName}</p>
                <p className="font-work-sans text-xs text-[#414651] truncate">{c.amount}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleDownload(c.file, c.fileName)}
                  className="text-[#181D27] hover:text-[#414651] transition-colors"
                  aria-label="Download contract"
                >
                  <Download className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => removeContract(c.id)}
                  className="text-[#9CA3AF] hover:text-red-500 transition-colors"
                  aria-label="Delete contract"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {contracts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-between mt-6"
        >
          {/* Show entries */}
          <div className="flex items-center gap-2">
            <span className="font-work-sans text-sm text-[#414651]">Show</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              aria-label="Entries per page"
              className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="font-work-sans text-sm text-[#414651]">entries</span>
          </div>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]">
                  ...
                </span>
              ) : (
                <motion.button
                  key={page}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[#181D27] text-white"
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
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

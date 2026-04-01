"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { AiFillDelete } from "react-icons/ai";
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
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-6 shrink-0"
      >
        Saved Contracts
      </motion.h1>

      {/* Table Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="hidden lg:grid grid-cols-[40px_1fr_160px_120px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3"
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
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            {paginated.map((c, index) => (
              <motion.div
                key={c.id}
                variants={rowVariants}
                className="flex flex-col lg:grid lg:grid-cols-[40px_1fr_160px_120px] bg-[#F9F9F9] lg:bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 items-start lg:items-center border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0"
              >
                {/* Desktop Sl */}
                <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                  {(currentPage - 1) * pageSize + index + 1}
                </span>

                {/* Mobile Header with ID & Actions */}
                <div className="flex w-full items-center justify-between lg:hidden mb-1 border-b border-gray-200 pb-3">
                  <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Contract #{(currentPage - 1) * pageSize + index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleDownload(c.file, c.fileName)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                      aria-label="Download contract"
                    >
                      <Download className="h-[14px] w-[14px]" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeContract(c.id)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Delete contract"
                    >
                      <AiFillDelete className="h-[16px] w-[16px]" />
                    </motion.button>
                  </div>
                </div>

                {/* Contract Info */}
                <div className="flex w-full items-center gap-4 lg:w-auto">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-work-sans text-[15px] font-bold text-[#181D27] truncate mb-1.5 mt-0.5">{c.fileName}</p>
                    <p className="font-work-sans text-[13px] text-[#535862]">Saved {c.savedAt}</p>
                  </div>
                </div>

                {/* Details — client + amount */}
                <div className="min-w-0 w-full lg:w-auto pl-14 lg:pl-0">
                  <p className="font-work-sans text-sm font-medium text-[#181D27] truncate">{c.clientName}</p>
                  <p className="font-work-sans text-[13px] text-[#414651] truncate">{c.amount}</p>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center justify-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDownload(c.file, c.fileName)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                    aria-label="Download contract"
                  >
                    <Download className="h-[14px] w-[14px]" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeContract(c.id)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete contract"
                  >
                    <AiFillDelete className="h-[16px] w-[16px]" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Pagination */}
      {contracts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 mb-2 shrink-0 gap-4 sm:gap-0"
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

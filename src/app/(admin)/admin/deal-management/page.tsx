"use client";

import { useState } from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Deal {
  id: number;
  fileName: string;
  uploadDateTime: string;
  role: "Client" | "Service Provider";
  uploadedBy: string;
}

const MOCK: Deal[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  fileName: "File: Service and Payment agreement",
  uploadDateTime: "12 March 26, 10:00 PM",
  role: i % 3 === 1 || i % 3 === 2 ? "Service Provider" : "Client",
  uploadedBy: "First Name,Last Name",
}));

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function DealManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(MOCK.length / pageSize);
  const paginated = MOCK.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      <div className="flex items-center justify-between shrink-0 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-rozha text-2xl md:text-3xl text-[#181D27] shrink-0"
        >
          Deal Management
        </motion.h2>
      </div>

      {/* Scrollable Table Wrapper */}
      <div className="flex-1 min-h-0 overflow-x-auto w-full custom-scrollbar">
        <div className="min-w-[800px] h-full flex flex-col">
          {/* Table header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="grid grid-cols-[60px_2.5fr_1.5fr_1.2fr_1.5fr_80px] bg-[#181D27] text-white rounded-xl px-6 py-4 items-center shrink-0 mb-5"
          >
            <span className="font-work-sans text-sm font-medium">Sl</span>
            <span className="font-work-sans text-sm font-medium">File Name</span>
            <span className="font-work-sans text-sm font-medium">Upload Date & Time</span>
            <span className="font-work-sans text-sm font-medium">Role</span>
            <span className="font-work-sans text-sm font-medium">Uploaded by</span>
            <span className="font-work-sans text-sm font-medium text-center">Action</span>
          </motion.div>

          {/* Rows */}
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar pb-2"
          >
            {paginated.map((deal, i) => (
              <motion.div
                key={deal.id}
                variants={rowVariants}
                className="grid grid-cols-[60px_2.5fr_1.5fr_1.2fr_1.5fr_80px] items-center bg-[#F9F9F9] rounded-2xl px-6 py-5 shrink-0"
              >
                <span className="font-work-sans text-sm text-[#414651]">
                  {(currentPage - 1) * pageSize + i + 1}
                </span>

                <span className="font-work-sans text-sm font-bold text-[#181D27] leading-snug">
                  {deal.fileName}
                </span>

                <span className="font-work-sans text-sm text-[#414651]">
                  {deal.uploadDateTime}
                </span>

                <span className="font-work-sans text-sm text-[#414651]">
                  {deal.role}
                </span>

                <span className="font-work-sans text-sm text-[#414651]">
                  {deal.uploadedBy}
                </span>

                <div className="flex justify-center">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] hover:border-gray-300 transition-colors shadow-sm"
                    aria-label="More options"
                  >
                    <MoreVertical size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-between shrink-0 pt-2"
      >
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Entries per page"
            className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>

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
              <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]">...</span>
            ) : (
              <motion.button
                key={page}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(page as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${
                  currentPage === page ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50"
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
    </div>
  );
}

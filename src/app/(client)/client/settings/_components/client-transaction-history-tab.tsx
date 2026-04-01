"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: number;
  serviceName: string;
  status: "Paid" | "In Process" | "Due";
  amount: string;
}

const MOCK: Transaction[] = [
  { id: 1,  serviceName: "Tax Attorny",       status: "Paid", amount: "$89.759" },
  { id: 2,  serviceName: "Accountant",         status: "Paid", amount: "$89.759" },
  { id: 3,  serviceName: "Marketing Analyst",  status: "Paid", amount: "$89.759" },
  { id: 4,  serviceName: "Tax Attorny",        status: "Paid", amount: "$89.759" },
  { id: 5,  serviceName: "Accountant",         status: "Paid", amount: "$89.759" },
  { id: 6,  serviceName: "Marketing Analyst",  status: "Paid", amount: "$89.759" },
  { id: 7,  serviceName: "Tax Attorny",        status: "Paid", amount: "$89.759" },
  { id: 8,  serviceName: "Accountant",         status: "Paid", amount: "$89.759" },
  { id: 9,  serviceName: "Marketing Analyst",  status: "Paid", amount: "$89.759" },
  { id: 10, serviceName: "Tax Attorny",        status: "Paid", amount: "$89.759" },
  { id: 11, serviceName: "Accountant",         status: "Paid", amount: "$89.759" },
  { id: 12, serviceName: "Marketing Analyst",  status: "Paid", amount: "$89.759" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const statusColor: Record<Transaction["status"], string> = {
  Paid:       "text-[#16A34A]",
  "In Process": "text-[#414651]",
  Due:        "text-red-500",
};

const amountColor: Record<Transaction["status"], string> = {
  Paid:         "text-[#16A34A]",
  "In Process": "text-[#181D27]",
  Due:          "text-red-500",
};

export function ClientTransactionHistoryTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    <motion.div
      key="transaction-history"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full pl-0 lg:pl-0 pr-0"
    >
      {/* Table Header */}
      <div className="hidden lg:grid grid-cols-[40px_1fr_160px_160px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3 shrink-0">
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium">Status</span>
        <span className="font-work-sans text-sm font-medium">Paid</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {paginated.map((tx, index) => (
            <motion.div
              key={tx.id}
              variants={rowVariants}
              className="flex flex-col lg:grid lg:grid-cols-[40px_1fr_160px_160px] lg:items-center bg-[#F9F9F9] lg:bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0 mt-1"
            >
              {/* Desktop Sl */}
              <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                {(currentPage - 1) * pageSize + index + 1}
              </span>

              {/* Mobile Header with Sl and Status */}
              <div className="flex w-full items-center justify-between lg:hidden mb-1 border-b border-gray-200 pb-3">
                <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Transaction #{(currentPage - 1) * pageSize + index + 1}
                </span>
                <span className={`font-work-sans text-[13px] font-bold ${statusColor[tx.status]}`}>
                  {tx.status}
                </span>
              </div>

              {/* Service name + dollar icon */}
              <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto">
                <div className="w-10 h-10 rounded-full bg-[#16A34A] shadow-sm flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span className="font-work-sans text-[15px] font-bold text-[#181D27]">{tx.serviceName}</span>
                
                {/* Mobile Amount (Paid) */}
                <div className="ml-auto lg:hidden">
                  <span className={`font-work-sans text-[15px] font-bold ${amountColor[tx.status]}`}>
                    {tx.amount}
                  </span>
                </div>
              </div>

              {/* Desktop Status */}
              <span className={`hidden lg:block font-work-sans text-sm font-medium ${statusColor[tx.status]}`}>
                {tx.status}
              </span>

              {/* Desktop Amount (Paid) */}
              <span className={`hidden lg:block font-work-sans text-sm font-semibold ${amountColor[tx.status]}`}>
                {tx.amount}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-auto shrink-0 bg-white/50 backdrop-blur-sm lg:py-2 rounded-xl gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Entries per page"
            className="h-10 px-3 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
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
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>

          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center font-work-sans text-sm text-[#414651]">...</span>
            ) : (
              <motion.button
                key={page}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(page as number)}
                className={`w-10 h-10 rounded-full font-work-sans text-sm font-medium transition-colors shadow-sm ${
                  currentPage === page ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50 bg-white"
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
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

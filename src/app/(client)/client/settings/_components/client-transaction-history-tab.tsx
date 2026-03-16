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
      className="flex flex-col"
    >
      {/* Table Header */}
      <div className="grid grid-cols-[40px_1fr_160px_160px] bg-[#181D27] text-white rounded-xl px-6 py-4 mb-3">
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium">Status</span>
        <span className="font-work-sans text-sm font-medium">Paid</span>
      </div>

      {/* Rows */}
      <motion.div
        key={currentPage}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {paginated.map((tx, index) => (
          <motion.div
            key={tx.id}
            variants={rowVariants}
            className="grid grid-cols-[40px_1fr_160px_160px] items-center bg-[#F9F9F9] rounded-xl px-6 py-4"
          >
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + index + 1}
            </span>

            {/* Service name + dollar icon */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="font-work-sans text-sm font-semibold text-[#181D27]">{tx.serviceName}</span>
            </div>

            <span className={`font-work-sans text-sm font-medium ${statusColor[tx.status]}`}>
              {tx.status}
            </span>

            <span className={`font-work-sans text-sm font-semibold ${amountColor[tx.status]}`}>
              {tx.amount}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
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
      </div>
    </motion.div>
  );
}

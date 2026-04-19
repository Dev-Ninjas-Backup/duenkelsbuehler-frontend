"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useMySubscriptions } from "@/hooks/subscription/use-subscription";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const statusStyle: Record<string, { label: string; cls: string }> = {
  PAID: { label: "Paid", cls: "text-[#16A34A]" },
  PENDING: { label: "In Process", cls: "bg-gray-100 text-[#414651] px-3 py-0.5 rounded-full text-xs" },
  FAILED: { label: "Failed", cls: "text-[#DC2626]" },
  REFUNDED: { label: "Refunded", cls: "text-[#9CA3AF]" },
  ACTIVE: { label: "Active", cls: "text-[#16A34A]" },
  CANCELED: { label: "Canceled", cls: "text-[#DC2626]" },
  PAST_DUE: { label: "Past Due", cls: "text-orange-500" },
};

function PagBtn({ children, onClick, active, disabled }: {
  children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-9 h-9 rounded-full flex items-center justify-center font-work-sans text-sm transition-colors ${
        active ? "bg-[#181D27] text-white" : disabled ? "text-gray-300 cursor-not-allowed" : "text-[#414651] hover:bg-gray-100 border border-gray-200"
      }`}>
      {children}
    </button>
  );
}

export function TransactionHistoryTab() {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: subscriptions = [], isLoading } = useMySubscriptions();

  // Flatten all payments from all subscriptions
  const allPayments = subscriptions.flatMap((sub) =>
    sub.payments.map((p) => ({
      id: p.id,
      planName: sub.plan.name,
      status: p.status,
      amount: `${p.currency} ${p.amount.toFixed(2)}`,
      date: p.paidAt ? new Date(p.paidAt).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString(),
    }))
  );

  const totalPages = Math.ceil(allPayments.length / pageSize) || 1;
  const paginated = allPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <motion.div key="history" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-6">
      <h2 className="font-rozha text-2xl text-[#181D27]">Transaction History</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
        </div>
      ) : allPayments.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-work-sans text-sm text-[#414651]">No transactions found</span>
        </div>
      ) : (
        <div className="w-full">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-[60px_1fr_140px_120px] bg-[#181D27] rounded-[16px] px-6 py-3.5 mb-3">
            <span className="font-work-sans text-sm font-medium text-white">Sl</span>
            <span className="font-work-sans text-sm font-medium text-white">Plan</span>
            <span className="font-work-sans text-sm font-medium text-white text-center">Status</span>
            <span className="font-work-sans text-sm font-medium text-white text-right">Amount</span>
          </div>

          <div className="flex flex-col gap-4">
            {paginated.map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="flex flex-col lg:grid lg:grid-cols-[60px_1fr_140px_120px] items-start lg:items-center bg-[#F9F9F9] border border-gray-100/80 rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 gap-3 lg:gap-0">
                <span className="hidden lg:block font-work-sans text-sm text-[#414651]">{(currentPage - 1) * pageSize + i + 1}</span>
                <div className="flex flex-col">
                  <span className="font-work-sans text-[14px] font-bold text-[#181D27]">{tx.planName}</span>
                  <span className="font-work-sans text-xs text-[#9CA3AF]">{tx.date}</span>
                </div>
                <div className="flex justify-center">
                  <span className={`font-work-sans text-sm font-medium ${statusStyle[tx.status]?.cls ?? ""}`}>
                    {statusStyle[tx.status]?.label ?? tx.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-work-sans text-[15px] font-bold text-[#181D27]">{tx.amount}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select aria-label="Entries per page" value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-gray-200 rounded-lg px-2 py-1.5 font-work-sans text-sm text-[#181D27] focus:outline-none bg-white">
            {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-1.5">
          <PagBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronLeft size={15} />
          </PagBtn>
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#9CA3AF]">...</span>
            ) : (
              <PagBtn key={p} active={currentPage === p} onClick={() => setCurrentPage(p as number)}>{p}</PagBtn>
            )
          )}
          <PagBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            <ChevronRight size={15} />
          </PagBtn>
        </div>
      </div>
    </motion.div>
  );
}

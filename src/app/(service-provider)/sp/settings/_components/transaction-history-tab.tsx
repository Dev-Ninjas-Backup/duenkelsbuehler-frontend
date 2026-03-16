"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type TxStatus = "Paid" | "In Process" | "Due";

interface Transaction {
  id: number;
  name: string;
  avatar: string;
  status: TxStatus;
  amount: string;
}

const MOCK: Transaction[] = [
  {
    id: 1,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "Paid",
    amount: "$89.759",
  },
  {
    id: 2,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "In Process",
    amount: "$89.759",
  },
  {
    id: 3,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "Due",
    amount: "$89.759",
  },
  {
    id: 4,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "Paid",
    amount: "$89.759",
  },
  {
    id: 5,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "In Process",
    amount: "$89.759",
  },
  {
    id: 6,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "Due",
    amount: "$89.759",
  },
  {
    id: 7,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "Paid",
    amount: "$89.759",
  },
  {
    id: 8,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "In Process",
    amount: "$89.759",
  },
  {
    id: 9,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "Due",
    amount: "$89.759",
  },
  {
    id: 10,
    name: "First Name, Last Name",
    avatar: "/images/logo/Logo2.png",
    status: "Paid",
    amount: "$89.759",
  },
];

const FILTER_OPTIONS = [
  "Last 24h",
  "Last 7 days",
  "Last 30 days",
  "Last 3 months",
  "Last year",
];
const PAGE_SIZE_OPTIONS = [5, 10, 20];
const TOTAL_PAGES = 10;

const statusStyle: Record<
  TxStatus,
  { text: string; badge: string; amount: string }
> = {
  Paid: {
    text: "text-[#16A34A]",
    badge: "text-[#16A34A]",
    amount: "text-[#16A34A]",
  },
  "In Process": {
    text: "text-[#414651]",
    badge: "bg-gray-100 text-[#414651] px-3 py-0.5 rounded-full text-xs",
    amount: "text-[#181D27]",
  },
  Due: {
    text: "text-[#DC2626]",
    badge: "text-[#DC2626]",
    amount: "text-[#DC2626]",
  },
};

function StatusBadge({ status }: { status: TxStatus }) {
  if (status === "In Process") {
    return (
      <span className="bg-gray-100 text-[#414651] px-3 py-1 rounded-full font-work-sans text-xs font-medium">
        In Process
      </span>
    );
  }
  return (
    <span
      className={`font-work-sans text-sm font-medium ${statusStyle[status].text}`}
    >
      {status}
    </span>
  );
}

export function TransactionHistoryTab() {
  const [filter, setFilter] = useState("Last 24h");
  const [filterOpen, setFilterOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(3);

  const rows = MOCK.slice(0, pageSize);

  const visiblePages = (() => {
    if (TOTAL_PAGES <= 5)
      return Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, null, TOTAL_PAGES];
    if (currentPage >= TOTAL_PAGES - 2)
      return [1, null, TOTAL_PAGES - 2, TOTAL_PAGES - 1, TOTAL_PAGES];
    return [1, 2, currentPage, null, TOTAL_PAGES];
  })();

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-6"
    >
      <h2 className="font-rozha text-2xl text-[#181D27]">
        Transaction History
      </h2>

      {/* Filter dropdown */}
      <div className="relative">
        <button
          onClick={() => setFilterOpen((p) => !p)}
          className="flex items-center gap-3 px-5 py-2.5 border border-gray-200 rounded-lg bg-white font-work-sans text-sm text-[#181D27] min-w-[160px] justify-between hover:border-[#181D27] transition-colors"
        >
          {filter}
          <motion.span
            animate={{ rotate: filterOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-[#414651]" />
          </motion.span>
        </button>

        <AnimatePresence>
          {filterOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-md z-10 overflow-hidden"
            >
              {FILTER_OPTIONS.map((opt) => (
                <li key={opt}>
                  <button
                    onClick={() => {
                      setFilter(opt);
                      setFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 font-work-sans text-sm transition-colors ${
                      filter === opt
                        ? "bg-[#181D27] text-white"
                        : "text-[#181D27] hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Header */}
        <div className="grid grid-cols-[60px_1fr_160px_160px] bg-[#181D27] rounded-xl px-6 py-3.5 mb-3">
          <span className="font-work-sans text-sm font-medium text-white">
            Sl
          </span>
          <span className="font-work-sans text-sm font-medium text-white">
            Name
          </span>
          <span className="font-work-sans text-sm font-medium text-white">
            Status
          </span>
          <span className="font-work-sans text-sm font-medium text-white">
            Paid
          </span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3">
          {rows.map((tx, i) => (
            <motion.div
              key={tx.id + "-" + i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="grid grid-cols-[60px_1fr_160px_160px] items-center bg-white border border-gray-100 rounded-xl px-6 py-4 shadow-sm"
            >
              <span className="font-work-sans text-sm text-[#414651]">
                {i + 1}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src={tx.avatar}
                    alt={tx.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-work-sans text-sm font-semibold text-[#181D27]">
                  {tx.name}
                </span>
              </div>
              <StatusBadge status={tx.status} />
              <span
                className={`font-work-sans text-sm font-semibold ${statusStyle[tx.status].amount}`}
              >
                {tx.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer: show entries + pagination */}
      <div className="flex items-center justify-between w-full mt-2">
        {/* Show entries */}
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select
            aria-label="Entries per page"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-lg px-2 py-1.5 font-work-sans text-sm text-[#181D27] focus:outline-none focus:border-[#181D27] bg-white"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-1.5">
          <PagBtn
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={15} />
          </PagBtn>

          {visiblePages.map((p, i) =>
            p === null ? (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#9CA3AF]"
              >
                ...
              </span>
            ) : (
              <PagBtn
                key={p}
                active={currentPage === p}
                onClick={() => setCurrentPage(p as number)}
              >
                {p}
              </PagBtn>
            ),
          )}

          <PagBtn
            onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={currentPage === TOTAL_PAGES}
          >
            <ChevronRight size={15} />
          </PagBtn>
        </div>
      </div>
    </motion.div>
  );
}

function PagBtn({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 rounded-full flex items-center justify-center font-work-sans text-sm transition-colors ${
        active
          ? "bg-[#181D27] text-white"
          : disabled
            ? "text-gray-300 cursor-not-allowed"
            : "text-[#414651] hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_SPS } from "./data";
import { SP } from "./types";

const PAGE_SIZE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export function SearchStep({ onSelect }: { onSelect: (sp: SP) => void }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = MOCK_SPS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.handle.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <motion.div
      key="search"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-2"
      >
        Send a Proposal
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-sm text-[#414651] text-center mb-6"
      >
        Search for the S.P you would like to send a proposal to
      </motion.p>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="relative max-w-sm mx-auto w-full mb-6"
      >
        <input
          type="text"
          placeholder="Maria Go|"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
        />
        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </motion.div>

      {/* Table header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="grid grid-cols-[40px_1fr_80px] bg-[#181D27] text-white rounded-xl px-6 py-3.5 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium text-center">Rating</span>
      </motion.div>

      {/* Rows */}
      <motion.div
        key={`${page}-${search}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 flex-1"
      >
        {paginated.map((sp, i) => (
          <motion.div
            key={sp.id}
            variants={rowVariants}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(sp)}
            className="grid grid-cols-[40px_1fr_80px] items-center bg-[#F9F9F9] rounded-xl px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <span className="font-work-sans text-sm text-[#414651]">
              {(page - 1) * PAGE_SIZE + i + 1}
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <Image src={sp.avatar} alt={sp.name} width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-work-sans text-sm font-semibold text-[#181D27]">{sp.name}</span>
                  {sp.verified && (
                    <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A]">
                      <Image src="/svg/crown.svg" alt="Verified" width={12} height={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="font-work-sans text-xs text-[#9CA3AF]">{sp.handle}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <svg viewBox="0 0 16 20" className="w-4 h-5 fill-[#181D27]">
                <path d="M2 0h12a2 2 0 012 2v18l-8-4-8 4V2a2 2 0 012-2z" />
              </svg>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <span className="font-work-sans text-sm font-medium text-[#181D27]">10</span>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          {getPages().map((p, i) =>
            p === "..." ? (
              <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]">...</span>
            ) : (
              <motion.button key={p} whileTap={{ scale: 0.9 }} onClick={() => setPage(p as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${page === p ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50"}`}>
                {p}
              </motion.button>
            )
          )}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

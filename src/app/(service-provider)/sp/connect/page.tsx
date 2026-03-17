"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Client {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  rating: number;
}

const MOCK: Client[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: "Vanessa R.",
  handle: "@Vanessa92",
  avatar: "/images/user/user_avatar.png",
  verified: true,
  rating: 4,
}));

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" as const },
  },
};

export default function ConnectPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = MOCK.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.handle.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-2"
      >
        Connect
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-sm text-[#414651] text-center mb-6"
      >
        Search Clients to learn more about their ratings and connect on
        projects.
      </motion.p>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="relative max-w-sm mx-auto w-full mb-6"
      >
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Maria Go|"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
        />
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
        <span className="font-work-sans text-sm font-medium text-center">
          Rating
        </span>
      </motion.div>

      {/* Rows */}
      <motion.div
        key={`${currentPage}-${search}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 flex-1"
      >
        {paginated.map((client, i) => (
          <motion.div
            key={client.id}
            variants={rowVariants}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push(`/sp/connect/${client.id}`)}
            className="grid grid-cols-[40px_1fr_80px] items-center bg-[#F9F9F9] rounded-xl px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + i + 1}
            </span>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <Image
                  src={client.avatar}
                  alt={client.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-work-sans text-sm font-semibold text-[#181D27]">
                    {client.name}
                  </span>
                  {client.verified && (
                    <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A]">
                      <Image src="/svg/crown.svg" alt="Verified" width={12} height={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="font-work-sans text-xs text-[#9CA3AF]">
                  {client.handle}
                </p>
              </div>
            </div>

            {/* Bookmark icon as rating placeholder */}
            <div className="flex justify-center">
              <svg viewBox="0 0 16 20" className="w-4 h-5 fill-[#181D27]">
                <path d="M2 0h12a2 2 0 012 2v18l-8-4-8 4V2a2 2 0 012-2z" />
              </svg>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-between mt-6"
      >
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Entries per page"
            className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
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
              <span
                key={`e-${i}`}
                className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]"
              >
                ...
              </span>
            ) : (
              <motion.button
                key={page}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(page as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${currentPage === page ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50"}`}
              >
                {page}
              </motion.button>
            ),
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

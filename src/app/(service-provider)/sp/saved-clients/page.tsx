"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AiFillWarning, AiFillMessage } from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Client {
  id: number;
  name: string;
  description: string;
  verified: boolean;
  avatar: string;
}

const mockClients: Client[] = [
  {
    id: 1,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 2,
    name: "Vanessa R.",
    description: "Corporate baddie.",
    verified: false,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 3,
    name: "Vanessa R.",
    description: "Marketing Wizard",
    verified: false,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 4,
    name: "Vanessa R.",
    description: "Marketing Wizard",
    verified: true,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 5,
    name: "Vanessa R.",
    description: "Marketing Wizard",
    verified: false,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 6,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 7,
    name: "Vanessa R.",
    description: "Marketing Wizard",
    verified: false,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 8,
    name: "Vanessa R.",
    description: "Corporate baddie.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 9,
    name: "Vanessa R.",
    description: "Marketing Wizard",
    verified: false,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 10,
    name: "Vanessa R.",
    description: "Marketing Wizard",
    verified: true,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 11,
    name: "Vanessa R.",
    description: "Corporate baddie.",
    verified: false,
    avatar: "/images/user/user_avatar.png",
  },
  {
    id: 12,
    name: "Vanessa R.",
    description: "Marketing Wizard",
    verified: true,
    avatar: "/images/user/user_avatar.png",
  },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function SavedClientsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(mockClients.length / pageSize);
  const paginated = mockClients.slice(
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
      ) {
        pages.push(i);
      }
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
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-6 shrink-0"
      >
        Saved Clients
      </motion.h1>

      {/* Table Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="hidden lg:grid grid-cols-[40px_1fr_100px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium text-center">
          Action
        </span>
      </motion.div>

      {/* Table Rows */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
        {paginated.map((client, index) => (
          <motion.div
            key={client.id}
            variants={rowVariants}
            className="flex flex-col lg:grid lg:grid-cols-[40px_1fr_100px] bg-[#F9F9F9] lg:bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 items-start lg:items-center border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0"
          >
            {/* Desktop Sl */}
            <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + index + 1}
            </span>

            {/* Mobile Header with ID & Actions */}
            <div className="flex w-full items-center justify-between lg:hidden mb-1 border-b border-gray-200 pb-3">
              <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Client #{(currentPage - 1) * pageSize + index + 1}
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                  aria-label="Save client"
                >
                  <Bookmark className="h-[14px] w-[14px] fill-[#181D27]" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() =>
                    router.push(`/sp/messages?clientId=${client.id}`)
                  }
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                  aria-label="Message client"
                >
                  <AiFillMessage className="h-[14px] w-[14px]" />
                </motion.button>
              </div>
            </div>

            {/* Name + Info */}
            <div className="flex w-full items-center gap-4 lg:w-auto">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
                <Image
                  src={client.avatar}
                  alt={client.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 mt-0.5">
                  <span className="font-work-sans text-[15px] font-bold text-[#181D27]">
                    {client.name}
                  </span>
                  {client.verified ? (
                    <span className="flex items-center gap-1 font-work-sans text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <Image src="/svg/crown.svg" alt="Verified" width={14} height={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-work-sans text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      <AiFillWarning className="h-3 w-3" />
                      Unverified
                    </span>
                  )}
                </div>
                <p className="font-work-sans text-[13px] text-[#535862]">
                  {client.description}
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                aria-label="Save client"
              >
                <Bookmark className="h-[14px] w-[14px] fill-[#181D27]" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() =>
                  router.push(`/sp/messages?clientId=${client.id}`)
                }
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                aria-label="Message client"
              >
                <AiFillMessage className="h-[14px] w-[14px]" />
              </motion.button>
            </div>
          </motion.div>
        ))}
        </motion.div>
      </div>

      {/* Pagination */}
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

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {/* Prev */}
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
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]"
              >
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
            ),
          )}

          {/* Next */}
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

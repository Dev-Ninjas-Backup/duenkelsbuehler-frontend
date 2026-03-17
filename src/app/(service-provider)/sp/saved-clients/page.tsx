"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
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
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        Saved Clients
      </motion.h1>

      {/* Table Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[40px_1fr_100px] bg-[#181D27] text-white rounded-xl px-6 py-4 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium text-center">
          Action
        </span>
      </motion.div>

      {/* Table Rows */}
      <motion.div
        key={currentPage}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 flex-1"
      >
        {paginated.map((client, index) => (
          <motion.div
            key={client.id}
            variants={rowVariants}
            className="grid grid-cols-[40px_1fr_100px] bg-[#F9F9F9] rounded-xl px-6 py-4 items-center"
          >
            {/* Sl */}
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + index + 1}
            </span>

            {/* Name + Info */}
            <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-work-sans text-sm font-semibold text-[#181D27]">
                    {client.name}
                  </span>
                  {client.verified ? (
                    <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A]">
                      <Image src="/svg/crown.svg" alt="Verified" width={14} height={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-work-sans text-xs text-red-500">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Unverified
                    </span>
                  )}
                </div>
                <p className="font-work-sans text-xs text-[#414651]">
                  {client.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="text-[#181D27] hover:text-[#414651] transition-colors"
              >
                <Bookmark className="h-4 w-4 fill-[#181D27]" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() =>
                  router.push(`/sp/messages?clientId=${client.id}`)
                }
                className="text-[#181D27] hover:text-[#414651] transition-colors"
              >
                <MessageCircle className="h-4 w-4 fill-[#181D27]" />
              </motion.button>
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

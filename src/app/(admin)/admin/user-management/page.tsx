"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldAlert,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  avatar: string;
  verified: boolean;
  signInBy: "google" | "apple";
  dateTime: string;
}

const MOCK: User[] = [
  {
    id: 1,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: true,
    signInBy: "google",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 2,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: false,
    signInBy: "apple",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 3,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: false,
    signInBy: "google",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 4,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: false,
    signInBy: "google",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 5,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: true,
    signInBy: "apple",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 6,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: true,
    signInBy: "google",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 7,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: false,
    signInBy: "apple",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 8,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: true,
    signInBy: "google",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 9,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: false,
    signInBy: "apple",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 10,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: true,
    signInBy: "google",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 11,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: false,
    signInBy: "google",
    dateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 12,
    name: "Vanessa R.",
    avatar: "/images/user/user_avatar.png",
    verified: true,
    signInBy: "apple",
    dateTime: "12 March 26, 10:00 PM",
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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#181D27">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(MOCK.length / pageSize);
  const paginated = MOCK.slice(
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
    <div className="flex flex-col gap-6 h-[calc(100dvh-160px)]">
      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-3xl text-[#181D27] shrink-0"
      >
        User Management
      </motion.h2>

      {/* Table header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[30px_1fr_60px_40px] md:grid-cols-[60px_2.5fr_1fr_1.5fr_80px] gap-2 md:gap-0 bg-[#181D27] text-white rounded-xl px-4 md:px-6 py-4 items-center shrink-0"
      >
        <span className="font-work-sans text-xs md:text-sm font-medium">Sl</span>
        <span className="font-work-sans text-xs md:text-sm font-medium">Name</span>
        <span className="font-work-sans text-[11px] md:text-sm font-medium text-center leading-tight">
          Sign in
        </span>
        <span className="font-work-sans text-sm font-medium hidden md:block">
          Date & Time
        </span>
        <span className="font-work-sans text-xs md:text-sm font-medium text-center">Action</span>
      </motion.div>

      {/* Rows */}
      <motion.div
        key={currentPage}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar pb-2"
      >
        {paginated.map((user, i) => (
          <motion.div
            key={user.id}
            variants={rowVariants}
            className="grid grid-cols-[30px_1fr_60px_40px] md:grid-cols-[60px_2.5fr_1fr_1.5fr_80px] gap-2 md:gap-0 items-center bg-[#F9F9F9] rounded-2xl px-4 md:px-6 py-5 shrink-0"
          >
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + i + 1}
            </span>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-work-sans text-sm font-bold text-[#181D27]">
                  {user.name}
                </span>
                {user.verified ? (
                  <span className="flex items-center gap-1 font-work-sans text-[10px] sm:text-xs text-[#16A34A] bg-[#16A34A]/10 px-2 py-1 rounded-full font-semibold">
                    <Image src="/svg/crown.svg" alt="Verified" width={12} height={12} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-work-sans text-[10px] sm:text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded-full font-semibold">
                    <AiFillWarning className="w-3 h-3 lg:w-[14px] lg:h-[14px]" /> Unverified
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              {user.signInBy === "google" ? <GoogleIcon /> : <AppleIcon />}
            </div>

            <span className="font-work-sans text-sm text-[#414651] hidden md:block">
              {user.dateTime}
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

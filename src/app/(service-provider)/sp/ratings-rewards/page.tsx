"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

interface Review {
  id: number;
  name: string;
  description: string;
  verified: boolean;
  avatar: string;
  rating: number;
}

const mockReviews: Review[] = [
  {
    id: 1,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 4,
  },
  {
    id: 2,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 4,
  },
  {
    id: 3,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 4,
  },
  {
    id: 4,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 5,
  },
  {
    id: 5,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 3,
  },
  {
    id: 6,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 5,
  },
  {
    id: 7,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 4,
  },
  {
    id: 8,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 4,
  },
  {
    id: 9,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 5,
  },
  {
    id: 10,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 3,
  },
  {
    id: 11,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 4,
  },
  {
    id: 12,
    name: "Vanessa R.",
    description: "Corporate lawyer specializing in mergers and aquisitions.",
    verified: true,
    avatar: "/images/user/user_avatar.png",
    rating: 5,
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

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function RatingsRewardsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(mockReviews.length / pageSize);
  const paginated = mockReviews.slice(
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
        Rating & Badges
      </motion.h1>

      {/* Badge Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-6 mb-6 shrink-0"
      >
        {/* Badge 1 — Seal */}
        <div className="flex items-start gap-4 lg:gap-5">
          <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 flex items-center justify-center">
            <Image src="/images/seal.png" alt="Seal" width={80} height={80} className="object-contain" />
          </div>
          <div>
            <h2 className="font-rozha text-xl lg:text-2xl text-[#181D27] mb-1">
              The seal is now yours to bear.
            </h2>
            <p className="font-work-sans text-[13px] lg:text-sm text-[#414651]">
              No more shadows—your name carries weight.
            </p>
          </div>
        </div>

        {/* Badge 2 — Fine Print Club */}
        <div className="flex items-start gap-4 lg:gap-5">
          <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 flex items-center justify-center">
            <Image src="/images/hand.png" alt="Fine Print Club" width={80} height={80} className="object-contain" />
          </div>
          <div>
            <h2 className="font-rozha text-xl lg:text-2xl text-[#181D27] mb-1">
              The Fine Print Club
            </h2>
            <p className="font-work-sans text-[13px] lg:text-sm text-[#414651] max-w-sm">
              A contract sent, a standard set. Welcome to The Fine Print Club —
              where the details are respected.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Table Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="hidden lg:grid grid-cols-[1fr_160px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium text-center">
          Rating
        </span>
      </motion.div>

      {/* Table Rows - Wrapped by Scroll Container max height */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {paginated.map((review) => (
            <motion.div
              key={review.id}
              variants={rowVariants}
              className="flex flex-col lg:grid lg:grid-cols-[1fr_160px] bg-[#F9F9F9] lg:bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 items-start lg:items-center border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0"
            >
              {/* Name + Info */}
              <div className="flex w-full items-start gap-4 lg:items-center lg:w-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200 mt-1 lg:mt-0">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1.5 mt-0.5">
                    <span className="font-work-sans text-[15px] font-bold text-[#181D27]">
                      {review.name}
                    </span>
                    {review.verified && (
                      <span className="flex items-center gap-1 w-max font-work-sans text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <Image src="/svg/crown.svg" alt="Verified" width={14} height={14} />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="font-work-sans text-[13px] text-[#535862]">
                    {review.description}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-start lg:justify-center pl-14 lg:pl-0 w-full lg:w-auto">
                <StarRating rating={review.rating} />
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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useMyGivenReviews } from "@/hooks/reviews/use-reviews";
import { useBadges } from "@/hooks/admin/use-admin";

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const rowVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } } };

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function RatingsRewardsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: reviews = [], isLoading } = useMyGivenReviews();
  const { data: badges = [] } = useBadges();

  const totalPages = Math.ceil(reviews.length / pageSize) || 1;
  const paginated = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-6 shrink-0">
        Rating & Badges
      </motion.h1>

      {/* Badges from API */}
      {badges.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-6 mb-6 shrink-0">
          {badges.slice(0, 2).map((badge) => (
            <div key={badge.id} className="flex items-start gap-4 lg:gap-5">
              <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 flex items-center justify-center">
                <Image src={badge.imageUrl} alt={badge.title} width={80} height={80} className="object-contain" />
              </div>
              <div>
                <h2 className="font-rozha text-xl lg:text-2xl text-[#181D27] mb-1">{badge.title}</h2>
                <p className="font-work-sans text-[13px] lg:text-sm text-[#414651]">{badge.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Table Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}
        className="hidden lg:grid grid-cols-[1fr_1fr_160px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3">
        <span className="font-work-sans text-sm font-medium">Reviewed User</span>
        <span className="font-work-sans text-sm font-medium">Service</span>
        <span className="font-work-sans text-sm font-medium text-center">Rating</span>
      </motion.div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <motion.div key={currentPage} variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">No reviews given yet</span>
            </div>
          ) : paginated.map((review) => (
            <motion.div key={review.reviewId} variants={rowVariants}
              className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr_160px] bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 items-start lg:items-center border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
                  <span className="font-work-sans text-sm font-bold text-white">
                    {review.reviewedUser.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-work-sans text-[15px] font-bold text-[#181D27]">{review.reviewedUser.name}</span>
                  <p className="font-work-sans text-[12px] text-[#9CA3AF]">{review.reviewedUser.email}</p>
                </div>
              </div>
              <div>
                <span className="font-work-sans text-[13px] text-[#535862]">{review.service.description}</span>
                <p className="font-work-sans text-[12px] text-[#9CA3AF]">{review.service.industry} · {review.service.location}</p>
              </div>
              <div className="flex justify-start lg:justify-center pl-14 lg:pl-0 w-full lg:w-auto">
                <StarRating rating={review.rating} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 mb-2 shrink-0 gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Entries per page"
            className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer">
            {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]">...</span>
            ) : (
              <motion.button key={page} whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(page as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${currentPage === page ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50"}`}>
                {page}
              </motion.button>
            )
          )}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

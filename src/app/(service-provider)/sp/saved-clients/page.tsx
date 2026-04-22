"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { AiFillWarning, AiFillMessage } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useMyFavorites } from "@/hooks/favorites/use-favorites";
import { useRemoveFavorite } from "@/hooks/favorites/use-favorites";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function SavedClientsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: favoritesData, isLoading } = useMyFavorites();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const clients = favoritesData?.favorites ?? [];
  const totalPages = Math.ceil(clients.length / pageSize);
  const paginated = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
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
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-6 shrink-0"
      >
        Saved Clients
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="hidden lg:grid grid-cols-[40px_1fr_100px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium text-center">Action</span>
      </motion.div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center bg-[#F9F9F9] rounded-[20px] px-6 py-4 gap-4">
                <div className="w-6 h-3 bg-gray-200 rounded-full hidden lg:block" />
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 w-32 bg-gray-200 rounded-full" />
                  <div className="h-3 w-48 bg-gray-200 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <span className="font-work-sans text-sm text-[#9CA3AF]">No saved clients yet.</span>
          </div>
        ) : (
          <motion.div key={currentPage} variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            {paginated.map((fav, index) => (
              <motion.div
                key={fav.favoriteId}
                variants={rowVariants}
                className="flex flex-col lg:grid lg:grid-cols-[40px_1fr_100px] bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 items-start lg:items-center border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0"
              >
                <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                  {(currentPage - 1) * pageSize + index + 1}
                </span>

                {/* Mobile header */}
                <div className="flex w-full items-center justify-between lg:hidden mb-1 border-b border-gray-200 pb-3">
                  <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Client #{(currentPage - 1) * pageSize + index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeFavorite(fav.user.id)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                      aria-label="Remove from saved"
                    >
                      <Bookmark className="h-[14px] w-[14px] fill-[#181D27]" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => router.push(`/sp/messages?clientId=${fav.user.id}`)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                      aria-label="Message client"
                    >
                      <AiFillMessage className="h-[14px] w-[14px]" />
                    </motion.button>
                  </div>
                </div>

                {/* Name + Info */}
                <div className="flex w-full items-center gap-4 lg:w-auto">
                  <div className="w-10 h-10 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
                    <span className="font-work-sans text-sm font-bold text-white">
                      {fav.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-work-sans text-[15px] font-bold text-[#181D27]">{fav.user.name}</span>
                      <span className="flex items-center gap-1 font-work-sans text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                        <AiFillWarning className="h-3 w-3" /> Unverified
                      </span>
                    </div>
                    <p className="font-work-sans text-[13px] text-[#535862]">{fav.user.email}</p>
                  </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center justify-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeFavorite(fav.user.id)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                    aria-label="Remove from saved"
                  >
                    <Bookmark className="h-[14px] w-[14px] fill-[#181D27]" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => router.push(`/sp/messages?clientId=${fav.user.id}`)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#181D27] hover:bg-gray-100 transition-colors"
                    aria-label="Message client"
                  >
                    <AiFillMessage className="h-[14px] w-[14px]" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && clients.length > 0 && (
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
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              aria-label="Entries per page"
              className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer"
            >
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
      )}
    </div>
  );
}

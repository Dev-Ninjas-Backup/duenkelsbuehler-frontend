"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useServiceItems } from "@/hooks/sp/use-sp";
import { useAddFavorite, useMyFavorites } from "@/hooks/favorites/use-favorites";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

export default function DiscoverPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: services = [], isLoading } = useServiceItems();
  const { data: favData } = useMyFavorites();
  const { mutate: addFavorite } = useAddFavorite();

  const favoritedIds = new Set(favData?.favorites.map((f) => f.user.id) ?? []);

  const filtered = services.filter(
    (s) =>
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.industry.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-2 shrink-0">
        Discover
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-[13px] lg:text-sm text-[#414651] text-center mb-6 shrink-0">
        Discover experts for your business and learn about their ratings.
      </motion.p>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
        className="relative max-w-sm mx-auto w-full mb-6 shrink-0">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by description, industry or location..."
          value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white" />
      </motion.div>

      {/* Table header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}
        className="hidden lg:grid grid-cols-[40px_2fr_1fr_1fr_80px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3">
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Description</span>
        <span className="font-work-sans text-sm font-medium">Industry</span>
        <span className="font-work-sans text-sm font-medium">Location</span>
        <span className="font-work-sans text-sm font-medium text-center">Save</span>
      </motion.div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <motion.div key={`${currentPage}-${search}`} variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">No services found</span>
            </div>
          ) : paginated.map((service, i) => (
            <motion.div key={service.id} variants={rowVariants}
              onClick={() => router.push(`/client/discover/${service.id}`)}
              className="flex flex-col lg:grid lg:grid-cols-[40px_2fr_1fr_1fr_80px] items-start lg:items-center bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 cursor-pointer hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0 border border-gray-100/80">
              <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                {(currentPage - 1) * pageSize + i + 1}
              </span>
              <span className="font-work-sans text-[13px] text-[#535862] lg:pr-4">{service.description}</span>
              <span className="font-work-sans text-sm font-medium text-[#181D27] bg-white px-3 py-1 rounded-full shadow-sm lg:bg-transparent lg:shadow-none lg:p-0 lg:rounded-none">
                {service.industry}
              </span>
              <span className="font-work-sans text-sm text-[#414651]">{service.location}</span>
              <div className="flex items-center justify-center">
                <motion.button whileTap={{ scale: 0.85 }}
                  onClick={(e) => { e.stopPropagation(); addFavorite(service.id); }}
                  className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors ${favoritedIds.has(service.id) ? "text-[#181D27]" : "text-gray-400 hover:text-[#181D27]"}`}
                  aria-label="Save service">
                  <svg viewBox="0 0 16 20" className={`w-[14px] h-[14px] ${favoritedIds.has(service.id) ? "fill-[#181D27]" : "fill-none stroke-current stroke-[1.5]"}`}>
                    <path d="M2 0h12a2 2 0 012 2v18l-8-4-8 4V2a2 2 0 012-2z" />
                  </svg>
                </motion.button>
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
          {getPageNumbers().map((pg, i) =>
            pg === "..." ? (
              <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]">...</span>
            ) : (
              <motion.button key={pg} whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(pg as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${currentPage === pg ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50"}`}>
                {pg}
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

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { SP } from "./types";
import { useAllServiceItems } from "@/hooks/sp/use-sp";
import { useAddFavorite, useRemoveFavorite, useMyFavorites } from "@/hooks/favorites/use-favorites";
import { useTransactStore } from "@/stores/transact/use-transact-store";
import { toast } from "sonner";

interface DiscoverUser {
  id: number;
  name: string;
  role: string[];
  imageUrl: string | null;
  isIdentityVerified: boolean;
}

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

export function SearchStep() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data = [], isLoading } = useAllServiceItems({ limit: 100 });
  const { data: favData } = useMyFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();
  const { updateData, setStep } = useTransactStore();

  const favoritedIds = useMemo(() => new Set(favData?.favorites.map((f) => f.user.id) ?? []), [favData]);

  const serviceProviders = useMemo(() => {
    const rawServices = (data as unknown as DiscoverUser[]) || [];
    return rawServices
      .filter((user) => user.role?.includes("SERVICE_PROVIDER"))
      .map((user) => ({
        id: user.id,
        name: user.name,
        handle: `@${user.name.toLowerCase().replace(/\s+/g, "")}`,
        avatar: user.imageUrl || "/images/user/user_avatar.png",
        verified: user.isIdentityVerified,
      }));
  }, [data]);

  const filtered = useMemo(() => {
    return serviceProviders.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.handle.toLowerCase().includes(search.toLowerCase())
    );
  }, [serviceProviders, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filtered, currentPage, pageSize]);

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

  const handleFavoriteToggle = (spId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoritedIds.has(spId)) {
      removeFavorite(spId, {
        onSuccess: () => toast.success("Removed from favorites"),
        onError: (err: any) => toast.error(err?.message || "Failed to remove from favorites")
      });
    } else {
      addFavorite(spId, {
        onSuccess: () => toast.success("Saved to favorites"),
        onError: (err: any) => toast.error(err?.message || "Failed to save to favorites")
      });
    }
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
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-2 shrink-0"
      >
        Send a Proposal
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-[13px] lg:text-sm text-[#414651] text-center mb-6 shrink-0"
      >
        Search for the S.P you would like to send a proposal to
      </motion.p>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="relative max-w-sm mx-auto w-full mb-6 shrink-0"
      >
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name or handle..."
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
        className="hidden lg:grid grid-cols-[40px_1fr_80px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium text-center">
          Action
        </span>
      </motion.div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <motion.div
          key={`${currentPage}-${search}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">No service providers found</span>
            </div>
          ) : (
            paginated.map((sp, i) => (
              <motion.div
                key={sp.id}
                variants={rowVariants}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  updateData({ sp });
                  setStep("contract");
                }}
                className="flex flex-col lg:grid lg:grid-cols-[40px_1fr_80px] items-start lg:items-center bg-[#F9F9F9] lg:bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 cursor-pointer hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0 border border-gray-100/80"
              >
                {/* Desktop Sl */}
                <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                  {(currentPage - 1) * pageSize + i + 1}
                </span>

                {/* Mobile Header with ID & Action */}
                <div className="flex w-full items-center justify-between lg:hidden mb-1 border-b border-gray-200 pb-3">
                  <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Provider #{(currentPage - 1) * pageSize + i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => handleFavoriteToggle(sp.id, e)}
                      className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors ${favoritedIds.has(sp.id) ? "text-[#181D27]" : "text-gray-400 hover:text-[#181D27]"}`}
                      aria-label="Save Provider"
                    >
                      <svg
                        viewBox="0 0 16 20"
                        className={`w-[14px] h-[14px] ${favoritedIds.has(sp.id) ? "fill-[#181D27]" : "fill-none stroke-current stroke-[1.5]"}`}
                      >
                        <path d="M2 0h12a2 2 0 012 2v18l-8-4-8 4V2a2 2 0 012-2z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Name + Info */}
                <div className="flex w-full items-center gap-4 lg:w-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0 relative">
                    <Image
                      src={sp.avatar}
                      alt={sp.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 mt-0.5 flex-wrap">
                      <span className="font-work-sans text-[15px] font-bold text-[#181D27]">
                        {sp.name}
                      </span>
                      {sp.verified ? (
                        <span className="flex items-center gap-1 font-work-sans text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-max">
                          <Image
                            src="/svg/crown.svg"
                            alt="Verified"
                            width={14}
                            height={14}
                          />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-work-sans text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-max">
                          <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="font-work-sans text-[13px] text-[#535862]">
                      {sp.handle}
                    </p>
                  </div>
                </div>

                {/* Desktop Action */}
                <div className="hidden lg:flex items-center justify-center">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => handleFavoriteToggle(sp.id, e)}
                    className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors ${favoritedIds.has(sp.id) ? "text-[#181D27]" : "text-gray-400 hover:text-[#181D27]"}`}
                    aria-label="Save Provider"
                  >
                    <svg
                      viewBox="0 0 16 20"
                      className={`w-[14px] h-[14px] ${favoritedIds.has(sp.id) ? "fill-[#181D27]" : "fill-none stroke-current stroke-[1.5]"}`}
                    >
                      <path d="M2 0h12a2 2 0 012 2v18l-8-4-8 4V2a2 2 0 012-2z" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Pagination & Back Button */}
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

          {getPageNumbers().map((pg, i) =>
            pg === "..." ? (
              <span
                key={`e-${i}`}
                className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]"
              >
                ...
              </span>
            ) : (
              <motion.button
                key={pg}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(pg as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${
                  currentPage === pg
                    ? "bg-[#181D27] text-white"
                    : "border border-gray-200 text-[#414651] hover:bg-gray-50"
                }`}
              >
                {pg}
              </motion.button>
            ),
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Back to landing button */}
      <div className="flex justify-center mt-4 shrink-0">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setStep(null)}
          className="px-8 h-10 rounded-full border border-gray-200 font-work-sans text-sm text-[#414651] font-medium hover:bg-gray-50 transition-colors"
        >
          ← Back
        </motion.button>
      </div>
    </motion.div>
  );
}

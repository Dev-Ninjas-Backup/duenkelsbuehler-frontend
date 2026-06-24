"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, Crown, AlertTriangle, Star } from "lucide-react";
import { useAllServiceItems } from "@/hooks/sp/use-sp";
import { useAddFavorite, useRemoveFavorite, useMyFavorites } from "@/hooks/favorites/use-favorites";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

interface DiscoverUser {
  id: number;
  dbId: string;
  email: string;
  name: string;
  country: string | null;
  role: string[];
  imageUrl: string | null;
  isIdentityVerified: boolean;
  verifIdentityVerificationStatus: string;
  createdAt: string;
  updatedAt: string;
  serviceItems: {
    id: number;
    description: string;
    industry: string;
    location: string;
  }[];
  receivedServiceReviews: any[];
  averageRating: number;
}

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
  const [searchName, setSearchName] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const debouncedName = useDebounce(searchName, 400);
  const debouncedIndustry = useDebounce(searchIndustry, 400);
  const debouncedLocation = useDebounce(searchLocation, 400);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Memoize search parameters to prevent queries on intermediate keystrokes
  const queryParams = useMemo(() => ({
    name: debouncedName || undefined,
    industry: debouncedIndustry || undefined,
    location: debouncedLocation || undefined,
    limit: 100,
  }), [debouncedName, debouncedIndustry, debouncedLocation]);

  // Fetch items using debounced search params for backend filtering
  const { data = [], isLoading } = useAllServiceItems(queryParams);

  const { data: favData } = useMyFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const favoritedIds = new Set(favData?.favorites.map((f) => f.user.id) ?? []);

  // Filter the backend response to only show Service Providers
  const rawServices = data as unknown as DiscoverUser[];
  const serviceProviders = rawServices.filter(
    (user) => user.role?.includes("SERVICE_PROVIDER")
  );

  // In addition to backend query parameters, apply client-side filtering as a fallback/reinforcement
  const filtered = serviceProviders.filter(
    (user) => {
      const matchName = !searchName || user.name?.toLowerCase().includes(searchName.toLowerCase());
      const matchIndustry = !searchIndustry || user.serviceItems?.some(
        (s) => s.industry?.toLowerCase().includes(searchIndustry.toLowerCase())
      );
      const matchLocation = !searchLocation || user.serviceItems?.some(
        (s) => s.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
      return matchName && matchIndustry && matchLocation;
    }
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-2 shrink-0">
        Discover
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-[13px] lg:text-sm text-[#414651] text-center mb-6 shrink-0">
        Discover experts for your business and learn about their ratings.
      </motion.p>

      {/* Search Filters */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full mb-6 shrink-0">
        {/* Name Filter */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name..."
            value={searchName} onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white shadow-sm" />
        </div>

        {/* Industry Filter */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by industry..."
            value={searchIndustry} onChange={(e) => { setSearchIndustry(e.target.value); setCurrentPage(1); }}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white shadow-sm" />
        </div>

        {/* Location Filter */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by location..."
            value={searchLocation} onChange={(e) => { setSearchLocation(e.target.value); setCurrentPage(1); }}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white shadow-sm" />
        </div>
      </motion.div>

      {/* Table header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}
        className="hidden lg:grid grid-cols-[60px_2.5fr_1.5fr_3fr_1.2fr_80px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3 text-sm font-medium">
        <span>Sl</span>
        <span>Name</span>
        <span>Badge</span>
        <span>Service</span>
        <span className="text-center">Rating</span>
        <span className="text-center">Save</span>
      </motion.div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <motion.div key={`${currentPage}-${searchName}-${searchIndustry}-${searchLocation}`} variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">No service providers found</span>
            </div>
          ) : paginated.map((user, i) => (
            <motion.div key={user.id} variants={rowVariants}
              onClick={() => router.push(`/client/discover/${user.id}`)}
              className="flex flex-col lg:grid lg:grid-cols-[60px_2.5fr_1.5fr_3fr_1.2fr_80px] items-start lg:items-center bg-[#F9F9F9] rounded-[20px] px-5 py-5 lg:px-6 lg:py-4 cursor-pointer hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0 border border-gray-100/80">
              
              {/* Sl */}
              <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                {(currentPage - 1) * pageSize + i + 1}
              </span>

              {/* Name (Avatar, Name, Handle) */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm relative flex items-center justify-center bg-[#181D27] shrink-0">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/images/user/user_avatar.png"
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <span className="font-work-sans text-[15px] font-bold text-[#181D27] block leading-tight">{user.name}</span>
                  <p className="font-work-sans text-[12px] text-[#9CA3AF] mt-1.5">
                    {`@${user.name.toLowerCase().replace(/\s+/g, "")}`}
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-center">
                {user.isIdentityVerified ? (
                  <span className="flex items-center gap-1.5 font-work-sans text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full w-max">
                    <Image src="/svg/crown.svg" alt="Verified Crown" width={14} height={11} className="w-3.5 h-3.5 shrink-0 object-contain" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-work-sans text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full w-max">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Unverified
                  </span>
                )}
              </div>

              {/* Service (Capsules for all industries of serviceItems) */}
              <div className="flex flex-wrap gap-1.5">
                {user.serviceItems?.map((s) => (
                  <span key={s.id} className="bg-[#181D27] text-white text-[10px] font-work-sans font-semibold px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                    {s.industry}
                  </span>
                ))}
                {(!user.serviceItems || user.serviceItems.length === 0) && (
                  <span className="text-gray-400 font-work-sans text-xs italic">No services</span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 w-full lg:w-auto">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const ratingVal = user.averageRating ?? 0;
                    const isFilled = idx < Math.round(ratingVal);
                    return (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isFilled ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-none"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="font-work-sans text-xs font-semibold text-[#181D27] ml-1">
                  {user.averageRating?.toFixed(1) ?? "0.0"}
                </span>
              </div>

              {/* Save (Favorite) */}
              <div className="flex items-center justify-center w-full lg:w-auto pr-1">
                <motion.button whileTap={{ scale: 0.85 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (favoritedIds.has(user.id)) {
                      removeFavorite(user.id, {
                        onSuccess: () => toast.success("Removed from favorites"),
                        onError: (err: any) => toast.error(err?.message || "Failed to remove from favorites")
                      });
                    } else {
                      addFavorite(user.id, {
                        onSuccess: () => toast.success("Saved to favorites"),
                        onError: (err: any) => toast.error(err?.message || "Failed to save to favorites")
                      });
                    }
                  }}
                  className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors ${favoritedIds.has(user.id) ? "text-[#181D27]" : "text-gray-400 hover:text-[#181D27]"}`}
                  aria-label="Save service">
                  <svg viewBox="0 0 16 20" className={`w-[14px] h-[14px] ${favoritedIds.has(user.id) ? "fill-[#181D27]" : "fill-none stroke-current stroke-[1.5]"}`}>
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

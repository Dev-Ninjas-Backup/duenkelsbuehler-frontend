"use client";

import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, Star, AlertTriangle } from "lucide-react";
import { useServiceItem } from "@/hooks/sp/use-sp";
import { useMyFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/favorites/use-favorites";
import { toast } from "sonner";
import { useMemo } from "react";

const btnDark =
  "w-full max-w-xs h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors shadow-sm flex items-center justify-center";
const btnOutline =
  "w-full max-w-xs h-12 rounded-full border border-[#181D27] text-[#181D27] font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center";

interface ServiceProviderDetail {
  id: number;
  dbId: string;
  email: string;
  name: string;
  imageUrl: string | null;
  isIdentityVerified: boolean;
  serviceItems: {
    id: number;
    description: string;
    industry: string;
    location: string;
  }[];
  receivedServiceReviews: {
    id: number;
    rating: number;
    comment: string;
  }[];
}

export default function DiscoverProfilePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  // Get service provider profile by fetching service item by ID (matches GET /services/{id} API)
  const { data: rawSp, isLoading } = useServiceItem(Number(id));
  const sp = rawSp as unknown as ServiceProviderDetail | undefined;

  // Favorites logic
  const { data: favData } = useMyFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const isFavorited = useMemo(() => {
    return favData?.favorites.some((f) => f.user.id === sp?.id) ?? false;
  }, [favData, sp?.id]);

  const handleToggleFavorite = () => {
    if (!sp) return;
    if (isFavorited) {
      removeFavorite(sp.id, {
        onSuccess: () => toast.success("Removed from favorites"),
        onError: (err: any) => toast.error(err?.message || "Failed to remove from favorites"),
      });
    } else {
      addFavorite(sp.id, {
        onSuccess: () => toast.success("Saved to favorites"),
        onError: (err: any) => toast.error(err?.message || "Failed to save to favorites"),
      });
    }
  };

  // Calculate average rating from receivedServiceReviews
  const averageRating = useMemo(() => {
    const reviews = sp?.receivedServiceReviews ?? [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [sp?.receivedServiceReviews]);

  return (
    <div className="flex flex-col items-center min-h-full relative bg-white rounded-2xl overflow-hidden pb-12 shadow-sm border border-gray-100/50">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => router.push("/client/discover")} 
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Header Banner */}
      <div className="w-full bg-[#181D27] h-28" />

      <div className="flex flex-col items-center px-6 -mt-14 w-full">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 bg-[#181D27] flex items-center justify-center overflow-hidden relative shrink-0"
        >
          {sp?.imageUrl ? (
            <Image
              src={sp.imageUrl}
              alt={sp?.name ?? "Profile"}
              fill
              className="object-cover"
            />
          ) : (
            <span className="font-rozha text-3xl text-white">
              {sp?.name?.charAt(0).toUpperCase() ?? "?"}
            </span>
          )}
        </motion.div>

        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center gap-3 w-full my-4">
            <div className="h-4 w-28 bg-gray-200 rounded-full" />
            <div className="h-6 w-40 bg-gray-200 rounded-full" />
            <div className="h-4 w-32 bg-gray-200 rounded-full" />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Stars Row */}
            <div className="flex items-center gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, idx) => {
                const isFilled = idx < Math.round(averageRating);
                return (
                  <Star
                    key={idx}
                    className={`w-4 h-4 shrink-0 ${
                      isFilled ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-none"
                    }`}
                  />
                );
              })}
            </div>

            {/* Fullname */}
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="font-rozha text-2xl text-[#181D27] text-center font-bold"
            >
              {sp?.name ?? "Unknown"}
            </motion.h1>

            {/* Handle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="font-work-sans text-sm text-[#9CA3AF] mt-0.5"
            >
              {`@${sp?.name?.toLowerCase().replace(/\s+/g, "") ?? "user"}`}
            </motion.p>

            {/* Occupation / Industry */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="font-work-sans text-sm text-[#6B7280] mt-1.5"
            >
              {sp?.serviceItems?.[0]?.industry ?? "Service Provider"}
            </motion.p>

            {/* Verification & Save Badges Row */}
            <div className="flex items-center gap-3 mt-4">
              {/* Verification status badge */}
              {sp?.isIdentityVerified ? (
                <div 
                  className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center border border-green-200 shadow-sm"
                  title="Verified User"
                >
                  <Image 
                    src="/svg/crown.svg" 
                    alt="Verified Crown" 
                    width={16} 
                    height={13} 
                    className="object-contain" 
                  />
                </div>
              ) : (
                <div 
                  className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center border border-red-200 shadow-sm"
                  title="Unverified User"
                >
                  <AlertTriangle className="w-[15px] h-[15px] text-red-600" />
                </div>
              )}

              {/* Bookmark Save Button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleToggleFavorite}
                className={`w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm transition-colors ${
                  isFavorited 
                    ? "border-[#181D27] text-[#181D27]" 
                    : "border-gray-200 text-gray-400 hover:text-[#181D27]"
                }`}
                aria-label="Save service provider"
              >
                <svg
                  viewBox="0 0 16 20"
                  className={`w-[13px] h-[13px] ${
                    isFavorited ? "fill-[#181D27]" : "fill-none stroke-current stroke-[1.5]"
                  }`}
                >
                  <path d="M2 0h12a2 2 0 012 2v18l-8-4-8 4V2a2 2 0 012-2z" />
                </svg>
              </motion.button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="flex flex-col items-center gap-3 w-full mt-8"
        >
          <motion.button 
            whileTap={{ scale: 0.97 }} 
            onClick={() => router.push(`/client/transact?spId=${sp?.id ?? id}`)} 
            className={btnDark}
          >
            Transact
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.97 }} 
            onClick={() => router.push(`/client/discover/${sp?.id ?? id}/services`)} 
            className={btnDark}
          >
            Services
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.97 }} 
            onClick={() => router.push(`/client/discover/${sp?.id ?? id}/ratings`)} 
            className={btnDark}
          >
            Ratings
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.97 }} 
            onClick={() => router.push(`/client/messages?spId=${sp?.id ?? id}`)} 
            className={btnOutline}
          >
            Message
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

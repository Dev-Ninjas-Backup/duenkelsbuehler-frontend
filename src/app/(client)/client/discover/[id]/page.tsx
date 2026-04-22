"use client";

import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useServiceProvider } from "@/hooks/sp/use-sp";

const btnDark =
  "w-full max-w-xs h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors";
const btnOutline =
  "w-full max-w-xs h-12 rounded-full border border-[#181D27] text-[#181D27] font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors";

export default function DiscoverProfilePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: sp, isLoading } = useServiceProvider(Number(id));

  return (
    <div className="flex flex-col items-center min-h-full">
      <div className="w-full bg-[#181D27] h-28 rounded-t-2xl" />

      <div className="flex flex-col items-center px-6 pb-10 -mt-14 w-full">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 bg-[#181D27] flex items-center justify-center"
        >
          <span className="font-rozha text-3xl text-white">
            {sp?.Fullname?.charAt(0).toUpperCase() ?? "?"}
          </span>
        </motion.div>

        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center gap-3 w-full">
            <div className="h-6 w-40 bg-gray-200 rounded-full" />
            <div className="h-4 w-28 bg-gray-200 rounded-full" />
            <div className="h-4 w-32 bg-gray-200 rounded-full" />
          </div>
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="font-rozha text-2xl text-[#181D27] text-center"
            >
              {sp?.Fullname ?? "Unknown"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="font-work-sans text-sm text-[#9CA3AF] mt-0.5"
            >
              {sp?.location ?? ""}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="font-work-sans text-sm text-[#6B7280] mt-0.5"
            >
              {sp?.occupation ?? ""}
            </motion.p>
          </>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="flex flex-col items-center gap-3 w-full mt-6"
        >
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/client/transact`)} className={btnDark}>
            Transact
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/client/discover/${id}/services`)} className={btnDark}>
            Services
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/client/discover/${id}/ratings`)} className={btnDark}>
            Ratings
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/client/messages?spId=${sp?.userId ?? id}`)} className={btnOutline}>
            Message
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

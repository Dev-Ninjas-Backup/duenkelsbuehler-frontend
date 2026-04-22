"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useAdminUser } from "@/hooks/admin/use-admin";

export default function ConnectProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const clientId = Number(id);

  const { data: user, isLoading } = useAdminUser(clientId);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#181D27] h-32 relative flex items-end justify-center pb-0 rounded-t-2xl">
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div className="w-28 h-28 rounded-full border-4 border-white bg-[#181D27] flex items-center justify-center">
            {isLoading ? (
              <div className="w-full h-full rounded-full bg-gray-700 animate-pulse" />
            ) : (
              <span className="font-rozha text-4xl text-white">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mt-4 px-6"
      >
        <ChevronLeft size={16} /> Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center gap-3 mt-10 px-6"
      >
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center gap-3 w-full">
            <div className="h-6 w-40 bg-gray-200 rounded-full" />
            <div className="h-4 w-28 bg-gray-200 rounded-full" />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="font-rozha text-2xl text-[#181D27]">{user?.name ?? "Unknown"}</h2>
            <p className="font-work-sans text-sm text-[#9CA3AF] mt-0.5">{user?.email ?? ""}</p>
            {user?.country && (
              <p className="font-work-sans text-sm text-[#6B7280] mt-0.5">{user.country}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/sp/ratings-rewards")}
            className="w-full py-3.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
          >
            Ratings &amp; Badges
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!user}
            onClick={() => router.push(`/sp/messages?clientId=${clientId}`)}
            className="w-full py-3.5 rounded-full border-2 border-[#181D27] text-[#181D27] font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Message
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

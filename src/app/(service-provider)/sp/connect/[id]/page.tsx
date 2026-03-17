"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronLeft } from "lucide-react";

// Mock — replace with API fetch by id
const MOCK_CLIENT = {
  name: "Maria Gonzalez Castillo",
  handle: "@Vanessa92",
  avatar: "/images/user/user_avatar.png",
  rating: 5,
  badges: ["crown", "contract"],
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-7 w-7 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}


export default function ConnectProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const clientId = Number(id);

  return (
    <div className="flex flex-col h-full">
      {/* Dark header */}
      <div className="bg-[#181D27] h-32 relative flex items-end justify-center pb-0 rounded-t-2xl">
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white bg-gray-200">
            <Image
              src={MOCK_CLIENT.avatar}
              alt={MOCK_CLIENT.name}
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mt-4 px-6"
      >
        <ChevronLeft size={16} /> Back
      </motion.button>

      {/* Profile content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center gap-3 mt-10 px-6"
      >
        {/* Stars */}
        <StarRating rating={MOCK_CLIENT.rating} />

        {/* Name + handle */}
        <div className="text-center">
          <h2 className="font-rozha text-2xl text-[#181D27]">
            {MOCK_CLIENT.name}
          </h2>
          <p className="font-work-sans text-sm text-[#9CA3AF] mt-0.5">
            {MOCK_CLIENT.handle}
          </p>
        </div>

        {/* Badge icons */}
        <div className="flex items-center gap-3">
          <Image src="/svg/black_crown.svg" alt="Crown" width={32} height={24} className="object-contain" />
          <Image src="/images/logo/logo_white.png" alt="AristoPay" width={32} height={32} className="object-contain" />
        </div>

        {/* Action buttons */}
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
            onClick={() => router.push(`/sp/messages?clientId=${clientId}`)}
            className="w-full py-3.5 rounded-full border-2 border-[#181D27] text-[#181D27] font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Message
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

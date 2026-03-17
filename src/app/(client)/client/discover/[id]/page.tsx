"use client";

import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const EXPERTS: Record<
  number,
  {
    name: string;
    handle: string;
    avatar: string;
    profession: string;
    rating: number;
  }
> = {
  1: {
    name: "Maria Gonzalez Castillo",
    handle: "@Vanessa92",
    avatar: "/images/user/user_avatar.png",
    profession: "Corporate Lawyer",
    rating: 5,
  },
};

function getExpert(id: number) {
  return (
    EXPERTS[id] ?? {
      name: "Vanessa R.",
      handle: "@Vanessa92",
      avatar: "/images/user/user_avatar.png",
      profession: "Corporate Lawyer",
      rating: 4,
    }
  );
}

const btnDark =
  "w-full max-w-xs h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors";
const btnOutline =
  "w-full max-w-xs h-12 rounded-full border border-[#181D27] text-[#181D27] font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors";

export default function DiscoverProfilePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const expert = getExpert(Number(id));

  return (
    <div className="flex flex-col items-center min-h-full">
      {/* Dark header band */}
      <div className="w-full bg-[#181D27] h-28 rounded-t-2xl" />

      <div className="flex flex-col items-center px-6 pb-10 -mt-14 w-full">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4"
        >
          <Image
            src={expert.avatar}
            alt={expert.name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-1 mb-2"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 16 16"
              className="w-6 h-6"
              fill={i < expert.rating ? "#F59E0B" : "#E5E7EB"}
            >
              <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
            </svg>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="font-rozha text-2xl text-[#181D27] text-center"
        >
          {expert.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="font-work-sans text-sm text-[#9CA3AF] mt-0.5"
        >
          {expert.handle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="font-work-sans text-sm text-[#6B7280] mt-0.5"
        >
          {expert.profession}
        </motion.p>

        {/* Icons row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="flex items-center gap-3 mt-4 mb-6"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <Image src="/svg/crown.svg" alt="Crown" width={20} height={20} className="object-contain" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#181D27">
              <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
            </svg>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/client/transact`)}
            className={btnDark}
          >
            Transact
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/client/discover/${id}/services`)}
            className={btnDark}
          >
            Services
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/client/discover/${id}/ratings`)}
            className={btnDark}
          >
            Ratings
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/client/messages?spId=${id}`)}
            className={btnOutline}
          >
            Message
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

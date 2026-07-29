"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const REVIEWS = [
  {
    id: 1,
    name: "John D.",
    avatar: "/images/user/user_avatar.png",
    rating: 5,
    comment: "Excellent service, very professional and responsive.",
  },
  {
    id: 2,
    name: "Sarah M.",
    avatar: "/images/user/user_avatar.png",
    rating: 4,
    comment: "Great experience overall. Would recommend.",
  },
  {
    id: 3,
    name: "Carlos B.",
    avatar: "/images/user/user_avatar.png",
    rating: 5,
    comment: "Outstanding expertise and communication.",
  },
  {
    id: 4,
    name: "Linda K.",
    avatar: "/images/user/user_avatar.png",
    rating: 4,
    comment: "Very knowledgeable and easy to work with.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" as const },
  },
};

export default function RatingsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        Ratings
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {REVIEWS.map((r) => (
          <motion.div
            key={r.id}
            variants={cardVariants}
            className="bg-[#F9F9F9] rounded-xl px-6 py-4 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={r.avatar}
                alt={r.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-work-sans text-sm font-semibold text-[#181D27]">
                {r.name}
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 16 16"
                    className="w-3.5 h-3.5"
                    fill={i < r.rating ? "#F59E0B" : "#E5E7EB"}
                  >
                    <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
                  </svg>
                ))}
              </div>
              <p className="font-work-sans text-sm text-[#414651]">
                {r.comment}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex justify-center mt-8"
      >
        <button
          onClick={() => router.push(`/client/discover/${id}`)}
          className="font-work-sans text-sm text-[#414651] underline underline-offset-2 cursor-pointer"
        >
          Back
        </button>
      </motion.div>
    </div>
  );
}

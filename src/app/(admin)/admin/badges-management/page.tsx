"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { AddBadgeModal } from "./_components/add-badge-modal";

interface Badge {
  id: number;
  image: string;
  title: string;
  description: string;
}

const MOCK: Badge[] = [
  {
    id: 1,
    image: "/images/seal.png",
    title: "The seal is now yours to bear.",
    description: "No more shadows—your name carries weight.",
  },
  {
    id: 2,
    image: "/images/hand.png",
    title: "The Fine Print Club",
    description:
      "A contract sent, a standard set. Welcome to The Fine Print Club — where the details are respected.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function BadgesManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-3xl text-[#181D27]"
      >
        Badges Management
      </motion.h2>

      <AddBadgeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left — badge cards list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {MOCK.map((badge) => (
            <motion.div
              key={badge.id}
              variants={cardVariants}
              className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-gray-100 shadow-sm"
            >
              <div className="flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="text-[#414651] hover:text-[#181D27] transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal size={18} />
                </motion.button>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={badge.image}
                    alt={badge.title}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-rozha text-base text-[#181D27] leading-snug">
                    {badge.title}
                  </p>
                  <p className="font-work-sans text-sm text-[#414651] leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <button className="self-start font-work-sans text-sm text-[#181D27] underline underline-offset-2 hover:opacity-70 transition-opacity">
                Edit
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Right — add new card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          onClick={() => setModalOpen(true)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-[#6B7280] flex items-center justify-center text-white shadow-md"
          >
            <Plus size={28} strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

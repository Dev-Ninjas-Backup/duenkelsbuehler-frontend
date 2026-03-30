"use client";

import Image from "next/image";
import { MoreHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Badge {
  id: number;
  image: string;
  title: string;
  description: string;
  trigger: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

interface Props {
  badge: Badge;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMenuClose: () => void;
}

export function BadgeCard({ badge, isMenuOpen, onMenuToggle, onEdit, onDelete, onMenuClose }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
    >
      {/* Top row: image + title/description + menu */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <Image src={badge.image} alt={badge.title} width={56} height={56} className="object-cover w-full h-full" />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-rozha text-base text-[#181D27] leading-snug">{badge.title}</p>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onMenuToggle}
              className="text-[#414651] hover:text-[#181D27] transition-colors shrink-0"
              aria-label="More options"
            >
              <MoreHorizontal size={18} />
            </motion.button>
          </div>
          <p className="font-work-sans text-sm text-[#414651] leading-relaxed">{badge.description}</p>

          {/* Unlock condition */}
          <p className="font-work-sans text-xs text-[#414651] mt-1">
            <span className="font-semibold">Unlock condition —</span> {badge.trigger}
          </p>

          {/* Edit/Delete */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 pt-2 overflow-hidden"
              >
                <button
                  onClick={onEdit}
                  className="font-work-sans text-sm text-[#181D27] underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="font-work-sans text-sm text-red-500 underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                  Delete
                </button>
                <button onClick={onMenuClose} aria-label="Close" className="ml-auto text-gray-400 hover:text-[#181D27]">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

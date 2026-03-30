"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { AddBadgeModal } from "./_components/add-badge-modal";
import { BadgeCard, type Badge } from "./_components/badge-card";

const INITIAL: Badge[] = [
  {
    id: 1,
    image: "/images/seal.png",
    title: "The seal is now yours to bear.",
    description: "No more shadows—your name carries weight.",
    trigger: "Verified account",
  },
  {
    id: 2,
    image: "/images/hand.png",
    title: "The Fine Print Club",
    description: "A contract sent, a standard set. Welcome to The Fine Print Club — where the details are respected.",
    trigger: "Attached a contract",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function BadgesManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [badges, setBadges] = useState<Badge[]>(INITIAL);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

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
      <AddBadgeModal
        isOpen={!!editingBadge}
        onClose={() => setEditingBadge(null)}
        initialData={editingBadge ? { title: editingBadge.title, description: editingBadge.description, trigger: editingBadge.trigger } : undefined}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
          {badges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              isMenuOpen={menuOpenId === badge.id}
              onMenuToggle={() => setMenuOpenId(menuOpenId === badge.id ? null : badge.id)}
              onEdit={() => { setEditingBadge(badge); setMenuOpenId(null); }}
              onDelete={() => { setBadges((p) => p.filter((b) => b.id !== badge.id)); setMenuOpenId(null); }}
              onMenuClose={() => setMenuOpenId(null)}
            />
          ))}
        </motion.div>

        {/* Add new */}
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

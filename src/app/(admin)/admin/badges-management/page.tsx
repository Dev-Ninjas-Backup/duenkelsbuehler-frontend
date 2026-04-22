"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { AddBadgeModal } from "./_components/add-badge-modal";
import { BadgeCard } from "./_components/badge-card";
import { useBadges, useDeleteBadge } from "@/hooks/admin/use-admin";
import type { Badge } from "@/types/admin";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function BadgesManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const { data: badges = [], isLoading } = useBadges();
  const { mutate: deleteBadge } = useDeleteBadge();

  return (
    <div className="flex flex-col gap-6">
      <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="font-rozha text-3xl text-[#181D27]">
        Badges Management
      </motion.h2>

      <AddBadgeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <AddBadgeModal
        isOpen={!!editingBadge}
        onClose={() => setEditingBadge(null)}
        editingBadge={editingBadge}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="h-4 w-36 bg-gray-200 rounded-lg" />
                      <div className="w-5 h-5 rounded bg-gray-200" />
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-lg" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded-lg" />
                    <div className="h-3 w-24 bg-gray-200 rounded-lg mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center min-h-[200px] animate-pulse">
            <div className="w-14 h-14 rounded-full bg-gray-200" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isMenuOpen={menuOpenId === badge.id}
                onMenuToggle={() => setMenuOpenId(menuOpenId === badge.id ? null : badge.id)}
                onEdit={() => { setEditingBadge(badge); setMenuOpenId(null); }}
                onDelete={() => { deleteBadge(badge.id); setMenuOpenId(null); }}
                onMenuClose={() => setMenuOpenId(null)}
              />
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }}
            onClick={() => setModalOpen(true)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-50 transition-colors">
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-[#6B7280] flex items-center justify-center text-white shadow-md">
              <Plus size={28} strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

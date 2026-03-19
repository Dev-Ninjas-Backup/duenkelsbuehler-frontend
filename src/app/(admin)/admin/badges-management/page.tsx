"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Plus, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddBadgeModal } from "./_components/add-badge-modal";

const TRIGGER_OPTIONS = [
  "Left a rating",
  "Completed a transaction",
  "Attached a contract",
  "Subscribed to AristoAccess+",
  "Verified account",
  "Sent a proposal",
];

interface Badge {
  id: number;
  image: string;
  title: string;
  description: string;
  trigger: string;
}

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

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function TriggerSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 font-work-sans text-sm text-[#181D27] bg-white hover:border-[#181D27] transition-colors"
      >
        <span>{value || "Select trigger..."}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          >
            {TRIGGER_OPTIONS.map((opt) => (
              <li key={opt} role="none">
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 font-work-sans text-sm transition-colors hover:bg-gray-50 ${value === opt ? "text-[#16A34A] font-semibold" : "text-[#181D27]"}`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BadgesManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [badges, setBadges] = useState<Badge[]>(INITIAL);
  const [editingId, setEditingId] = useState<number | null>(null);

  const updateTrigger = (id: number, trigger: string) => {
    setBadges((prev) => prev.map((b) => (b.id === id ? { ...b, trigger } : b)));
  };

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
        {/* Badge cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={cardVariants}
              className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-gray-100 shadow-sm"
            >
              <div className="flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setEditingId(editingId === badge.id ? null : badge.id)}
                  className="text-[#414651] hover:text-[#181D27] transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal size={18} />
                </motion.button>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <Image src={badge.image} alt={badge.title} width={64} height={64} className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-rozha text-base text-[#181D27] leading-snug">{badge.title}</p>
                  <p className="font-work-sans text-sm text-[#414651] leading-relaxed">{badge.description}</p>
                </div>
              </div>

              {/* Trigger condition */}
              <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
                <p className="font-work-sans text-xs font-semibold text-[#414651]">
                  Unlock condition — <span className="text-[#181D27]">IF</span>
                </p>
                <TriggerSelect value={badge.trigger} onChange={(v) => updateTrigger(badge.id, v)} />
              </div>

              <AnimatePresence>
                {editingId === badge.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 pt-1 border-t border-gray-100 overflow-hidden"
                  >
                    <button className="font-work-sans text-sm text-[#181D27] underline underline-offset-2 hover:opacity-70 transition-opacity">
                      Edit
                    </button>
                    <button
                      onClick={() => { setBadges((p) => p.filter((b) => b.id !== badge.id)); setEditingId(null); }}
                      className="font-work-sans text-sm text-red-500 underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                      Delete
                    </button>
                    <button onClick={() => setEditingId(null)} aria-label="Close" className="ml-auto text-gray-400 hover:text-[#181D27]">
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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

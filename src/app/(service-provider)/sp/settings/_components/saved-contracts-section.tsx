"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, Bookmark } from "lucide-react";
import { useSavedContracts } from "@/store/saved-contracts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export function SavedContractsSection() {
  const { contracts, removeContract } = useSavedContracts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto w-full mt-8 pt-8 border-t border-gray-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <Bookmark size={16} className="fill-[#181D27] text-[#181D27]" />
        <h3 className="font-work-sans text-sm font-bold text-[#181D27]">Saved Contracts</h3>
      </div>

      {contracts.length === 0 ? (
        <p className="font-work-sans text-sm text-[#9CA3AF] text-center py-6">
          No saved contracts yet. Save a contract during a transaction to reuse it later.
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3"
        >
          <AnimatePresence>
            {contracts.map((c) => (
              <motion.div
                key={c.id}
                variants={rowVariants}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 bg-[#F9F9F9] rounded-xl px-4 py-3"
              >
                <FileText size={20} className="text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-work-sans text-sm font-semibold text-[#181D27] truncate">{c.fileName}</p>
                  <p className="font-work-sans text-xs text-[#9CA3AF]">Saved {c.savedAt}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => removeContract(c.id)}
                  className="text-[#9CA3AF] hover:text-red-500 transition-colors shrink-0"
                  aria-label="Remove saved contract"
                >
                  <Trash2 size={15} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

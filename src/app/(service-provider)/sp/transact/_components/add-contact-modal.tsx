"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { Contact } from "./types";
import { ALL_CONTACTS } from "./data";

interface Props {
  isOpen: boolean;
  existingIds: number[];
  onAdd: (contact: Contact) => void;
  onClose: () => void;
}

export function AddContactModal({ isOpen, existingIds, onAdd, onClose }: Props) {
  const [selectedId, setSelectedId] = useState<number | "">("");

  const available = ALL_CONTACTS.filter((c) => !existingIds.includes(c.id));
  const selected = ALL_CONTACTS.find((c) => c.id === selectedId) ?? null;

  const handleAdd = () => {
    if (!selected) return;
    onAdd(selected);
    setSelectedId("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-rozha text-2xl text-[#181D27]">Add a Contact</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#414651] hover:bg-gray-200 transition-colors"
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="font-work-sans text-sm font-bold text-[#181D27]">
                Select Contact
              </label>
              <div className="relative">
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(Number(e.target.value))}
                  title="Select a contact"
                  className="w-full h-12 border border-gray-200 rounded-xl px-4 pr-10 font-work-sans text-sm text-[#181D27] bg-white focus:outline-none focus:border-[#181D27] appearance-none cursor-pointer transition-colors"
                >
                  <option value="">— Choose a contact —</option>
                  {available.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            {/* Preview */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 bg-[#F5F5F5] rounded-2xl px-4 py-3"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    <Image src={selected.avatar} alt={selected.name} width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="font-work-sans text-sm font-bold text-[#181D27]">{selected.name}</p>
                    {selected.badge === "gold" ? (
                      <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A]">
                        <Image src="/svg/crown.svg" alt="Verified" width={12} height={12} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-work-sans text-xs text-red-500">
                        <ShieldAlert size={12} /> Unverified
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-full border border-gray-200 font-work-sans text-sm font-semibold text-[#414651] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                disabled={!selected}
                className="flex-1 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Add Contact
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

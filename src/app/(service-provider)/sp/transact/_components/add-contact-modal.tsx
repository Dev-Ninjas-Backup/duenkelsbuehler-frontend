"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import Image from "next/image";
import { Contact } from "./types";
import { useClients } from "@/hooks/users/use-users";

interface Props {
  isOpen: boolean;
  existingIds: number[];
  onAdd: (contact: Contact) => void;
  onClose: () => void;
}

export function AddContactModal({ isOpen, existingIds, onAdd, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  const { data: clients = [], isLoading } = useClients();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (!isOpen) setSearch(""); }, [isOpen]);

  const available = clients
    .filter((c) => !existingIds.includes(c.id))
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );

  const handleAdd = (client: typeof clients[0]) => {
    const contact: Contact = {
      id: client.id,
      name: client.name,
      avatar: "",
      badge: client.isIdentityVerified ? "gold" : "warning",
      trustapUserId: client.trustapUserId ?? null,
    };
    console.log("Adding contact:", contact);
    onAdd(contact);
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-rozha text-2xl text-[#181D27]">Add a Contact</h2>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#414651] hover:bg-gray-200 transition-colors">
                <X size={15} />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-xl pl-9 pr-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors"
              />
            </div>

            {/* Client List */}
            <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3 w-24 bg-gray-200 rounded-full" />
                        <div className="h-2.5 w-32 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : available.length === 0 ? (
                <p className="font-work-sans text-sm text-[#9CA3AF] text-center py-6">
                  {search ? "No clients found" : "No clients available"}
                </p>
              ) : (
                available.map((client) => (
                  <motion.button
                    key={client.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAdd(client)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F9F9F9] transition-colors text-left w-full"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
                      <span className="font-work-sans text-sm font-bold text-white">
                        {client.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-work-sans text-sm font-bold text-[#181D27] truncate">{client.name}</span>
                      <span className="font-work-sans text-xs text-[#9CA3AF] truncate">{client.email}</span>
                    </div>
                    {client.isIdentityVerified ? (
                      <span className="flex items-center gap-1 font-work-sans text-[10px] text-[#16A34A] bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                        <Image src="/svg/crown.svg" alt="Verified" width={10} height={10} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-work-sans text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
                        <AiFillWarning className="w-3 h-3" /> Unverified
                      </span>
                    )}
                  </motion.button>
                ))
              )}
            </div>

            <button onClick={onClose}
              className="w-full h-11 rounded-full border border-gray-200 font-work-sans text-sm font-semibold text-[#414651] hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

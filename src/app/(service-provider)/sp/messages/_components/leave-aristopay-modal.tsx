"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface LeaveAristoPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => void;
}

export function LeaveAristoPayModal({ isOpen, onClose, onLeave }: LeaveAristoPayModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl p-8 flex flex-col gap-5 shadow-xl mx-4 text-center"
          >
            <div className="text-4xl">⚠️</div>
            <h2 className="font-rozha text-2xl text-[#181D27] leading-snug">
              Sharing External Link
            </h2>

            <p className="font-work-sans text-sm text-[#414651] px-4 leading-relaxed">
              You&apos;re about to share an external link. Sharing links outside AristoPay may put your transaction at risk. Do you want to continue?
            </p>

            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-full border-2 border-gray-200 text-[#414651] font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onLeave}
                className="w-full py-3.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Send Anyway
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

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
            className="relative z-10 w-full max-w-md bg-white rounded-2xl p-8 flex flex-col gap-5 shadow-xl mx-4"
          >
            <h2 className="font-rozha text-2xl text-[#181D27] text-center leading-snug">
              You are about to leave<br />AristoPay
            </h2>

            <p className="font-work-sans text-sm text-[#414651] text-center">
              The link is taking you to an external site.
            </p>

            <ul className="flex flex-col gap-2 pl-1">
              {[
                "Be careful about sharing personal and banking information externally.",
                "AristoPay will not be able to help if you have issues with a service provider or client on another site.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-work-sans text-sm text-[#414651]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#414651] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 mt-1">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-full border-2 border-[#181D27] text-[#181D27] font-work-sans text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={onLeave}
                className="w-full py-3.5 rounded-full bg-red-600 text-white font-work-sans text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Leave AristoPay
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

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useModalSound } from "@/hooks/use-modal-sound";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DealMakerModal({ isOpen, onClose }: Props) {
  useModalSound(isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDone = () => {
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center gap-4 mx-4"
          >
            <h2 className="font-rozha text-3xl text-[#181D27]">Deal Maker</h2>
            <p className="font-work-sans text-sm text-[#414651]">
              A professional step forward—your work, formally valued.
            </p>

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, type: "spring" }}
            >
              <svg viewBox="0 0 80 80" className="w-20 h-20">
                <text x="40" y="58" textAnchor="middle" fontSize="56" fill="#16A34A" fontWeight="bold" fontFamily="serif">$</text>
              </svg>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDone}
              className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
            >
              Done
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

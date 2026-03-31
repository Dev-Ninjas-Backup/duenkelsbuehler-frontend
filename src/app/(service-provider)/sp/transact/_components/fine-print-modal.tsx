import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useModalSound } from "@/hooks/use-modal-sound";

interface Props {
  isOpen: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export function FinePrintModal({ isOpen, onNext, onSkip }: Props) {
  useModalSound(isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <Image src="/svg/black_crown.svg" alt="Crown" width={64} height={48} className="object-contain" />
            <p className="font-work-sans font-bold text-base text-[#181D27]">
              AristoAccess<span className="text-[#16A34A]">+</span>
            </p>

            <h2 className="font-rozha text-3xl text-[#181D27]">The Fine Print Club</h2>
            <p className="font-work-sans text-sm text-[#414651]">
              A contract sent, a standard set. Welcome to The Fine Print Club — where the details are respected.
            </p>

            <div className="my-2">
              <Image src="/images/hand.png" alt="Fine Print Club" width={128} height={96} className="object-contain" />
            </div>

            <div className="flex items-center gap-3 w-full justify-center mt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
                className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

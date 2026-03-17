import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CrownSVG } from "./shared";

interface Props {
  isOpen: boolean;
  onDone: () => void;
}

export function SuccessModal({ isOpen, onDone }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center"
          >
            <CrownSVG className="w-20 h-14 mb-2" />
            <p className="font-work-sans font-bold text-lg text-[#181D27] mb-4">
              AristoAccess<span className="text-[#16A34A]">+</span>
            </p>

            <h2 className="font-rozha text-3xl text-[#181D27] mb-3">
              The seal is now yours to bear.
            </h2>
            <p className="font-work-sans text-sm text-[#414651] mb-8">
              No more shadows—your name carries weight
            </p>

            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="mb-8"
            >
              <Image src="/images/seal.png" alt="Seal" width={144} height={160} className="object-contain" />
            </motion.div>

            <Button
              onClick={onDone}
              className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
            >
              Done
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

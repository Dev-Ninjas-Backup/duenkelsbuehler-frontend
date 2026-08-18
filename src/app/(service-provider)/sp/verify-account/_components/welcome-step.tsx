import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-lg mx-auto w-full flex flex-col items-center text-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-rozha text-4xl text-[#181D27] mb-4 leading-tight"
      >
        Welcome to the ruling class of payments
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="font-work-sans text-sm text-[#414651] mb-2"
      >
        Enjoy priority benefits, exclusive tools, and the confidence of being in the inner circle.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="font-work-sans text-sm text-[#414651] mb-10"
      >
        Let&apos;s elevate every transaction—together.
      </motion.p>

      <Button
        onClick={onNext}
        className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
      >
        Done
      </Button>
    </div>
  );
}

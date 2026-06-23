"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";

const landingFeatures = [
  "Verify your account",
  "Send proposals to Service Providers",
  "Unlock an exclusive badge to attract clients / service providers",
  "Access to the Aristocrat's Circle",
  "Send agreements to clients before transacting with them",
  "Save your most used contacts to your profile",
  "(NDA's, service contracts, etc.)",
];

export function LandingStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-xl mx-auto w-full flex flex-col items-center">
      {/* Crown Icon */}
      <CrownSVG className="w-20 h-14" />

      {/* Brand Title */}
      <BrandLabel />
      <div className="mb-6" /> {/* Spacing */}

      {/* Feature List */}
      <motion.ul 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md flex flex-col gap-3.5 mb-8"
      >
        {landingFeatures.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 font-work-sans text-sm text-[#414651]">
            <span className="text-gray-400 shrink-0 mt-1">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </motion.ul>

      {/* Subscribe Button */}
      <Button
        onClick={onNext}
        className="w-full max-w-md h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 text-white font-work-sans font-semibold text-base transition-colors"
      >
        Subscribe
      </Button>
    </div>
  );
}

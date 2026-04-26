"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-12 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 space-y-6 z-10"
        >
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-black">
            Business Held to a <br />
            <span className="text-[#00D05A]">Higher Standard</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
            The internet's first and most advanced B2B payments and protection escrow system.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              href="/signup" 
              className="px-8 py-3.5 bg-[#00D05A] text-white font-bold tracking-wide rounded hover:bg-[#00b34d] transition-colors inline-block"
            >
              GET STARTED FREE
            </Link>
            <Link 
              href="/how-it-works" 
              className="px-8 py-3.5 border-2 border-gray-200 text-gray-800 font-bold tracking-wide rounded hover:border-gray-300 transition-colors inline-block"
            >
              SEE HOW IT WORKS
            </Link>
          </div>
        </motion.div>

        {/* Right Content - Visual */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex-1 relative w-full max-w-[500px] lg:max-w-none"
        >
          {/* Black background block */}
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: -2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="w-full aspect-[4/3] bg-black relative"
          >
            {/* White overlapping card */}
            <motion.div 
              initial={{ rotate: 0, opacity: 0, scale: 0.9 }}
              animate={{ rotate: 4, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] bg-white p-8 shadow-2xl flex flex-col gap-4"
            >
              <p className="text-[#00D05A] font-bold text-sm tracking-widest uppercase">
                TARGET AREAS - BRAND CONSULTING
              </p>
              <h2 className="text-5xl font-bold tracking-tight text-black">
                $3,200
              </h2>
              <div className="h-[1px] w-full bg-gray-200 my-2" />
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00D05A] mt-0.5" />
                  <span className="text-sm text-gray-500 font-medium">Funds Secured</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-500 font-medium">Escrow Agreement Issued - Awaiting Rep</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

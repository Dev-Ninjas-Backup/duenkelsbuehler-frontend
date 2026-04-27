"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-12 lg:py-24 bg-[#FAFAFA] overflow-hidden min-h-[calc(100vh-112px)] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 space-y-8 z-10 w-full"
        >
          <motion.h1 
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-[#181D27] font-rozha flex flex-wrap"
          >
            {"Business Held to a".split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 120, damping: 14 }
                  }
                }}
                className="mr-3 lg:mr-4 inline-block"
              >
                {word}
              </motion.span>
            ))}
            <div className="w-full h-0 lg:h-1" /> {/* Line break equivalent for flex wrap */}
            {"Higher Standard".split(" ").map((word, i) => (
              <motion.span
                key={`green-${i}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 120, damping: 14 }
                  }
                }}
                className="text-[#00D05A] mr-3 lg:mr-4 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <p className="text-[#414651] text-lg md:text-xl max-w-2xl leading-relaxed font-work-sans">
            Send invoices, attach contracts, and get paid — <br className="hidden md:block" />
            with every transaction escrow-style protected from start to finish.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link 
              href="/signup" 
              className="px-8 py-3.5 bg-[#00D05A] text-white font-medium tracking-wide rounded-md hover:bg-[#00b34d] transition-colors inline-block"
            >
              GET STARTED FREE
            </Link>
            <Link 
              href="/how-it-works" 
              className="px-8 py-3.5 border border-[#181D27] text-[#181D27] font-medium tracking-wide rounded-md hover:bg-gray-50 transition-colors inline-block"
            >
              SEE HOW IT WORKS
            </Link>
          </div>
        </motion.div>

        {/* Empty Right Content to balance flex layout if needed, or just let it be empty as in screenshot */}
        <div className="flex-1 hidden lg:block"></div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function QuoteSection() {
  return (
    <div className="flex flex-col w-full">
      {/* Invoice Banner & Quote Combined Section */}
      <section className="bg-[#FAFAFA] relative overflow-hidden pt-16 md:pt-24">
        {/* Invoice Banner */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-center items-center relative">
          {/* The Black Stripe (80% height of the invoice, 100vw wide) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[10%] bottom-[10%] w-screen bg-black z-0" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-[400px] z-20"
          >
            {/* The rotated container for both cards */}
            <div className="relative w-full aspect-[1/1.15] transform rotate-[5deg] origin-center">
              {/* Green Shadow Card */}
              <motion.div
                initial={{ x: 0, y: 0 }}
                whileInView={{ x: 24, y: 24 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                className="absolute inset-0 bg-[#00D05A] shadow-2xl"
                style={{ zIndex: 0 }}
              />

              {/* White Invoice Card */}
              <div className="absolute inset-0 bg-white p-8 px-10 pt-10 shadow-sm flex flex-col z-10">
                <p className="text-[#00D05A] font-medium text-[14px] tracking-wide uppercase mb-4 leading-snug font-work-sans">
                  INVOICE #0042 - BRAND
                  <br />
                  CONSULTING
                </p>
                <h2 className="text-[64px] font-bold text-black font-rozha mb-4 leading-none tracking-tight">
                  $3,200
                </h2>
                <p className="text-[#181D27] text-[15px] mb-10 font-work-sans leading-relaxed">
                  Phase 1 delivery - Strategy & Visual
                  <br />
                  Identity
                </p>

                <div className="h-px w-full bg-gray-300 mb-5" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D05A]" />
                    <span className="text-[14px] text-[#00D05A] font-work-sans font-medium">
                      Funds secured
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <motion.span 
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: [0.8, 1.25, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-[14px] inline-block"
                    >
                      🔒
                    </motion.span>
                    <span className="text-[13px] text-[#A3A3A3] font-work-sans">
                      Escrow-style protected - AristoPay
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quote Section Area */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10 mt-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0">
            {/* Left Side - Mouth Graphic */}
            <motion.div
              initial={{ opacity: 0, x: -60, rotate: -5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
              className="shrink-0 w-[260px] md:w-[420px] lg:w-[520px]"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src="/images/mouth.png"
                  alt="Shouting Mouth Graphic"
                  fill
                  className="object-contain animate-float"
                />
              </div>
            </motion.div>

            {/* Right Side - Quotes */}
            <div className="flex-1 flex flex-col gap-12 md:gap-20 py-10">
              {/* 1st quote — right side */}
              <motion.h2
                initial={{ opacity: 0, x: 60, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                className="text-[24px] md:text-[32px] lg:text-[42px] font-black font-rozha text-black leading-[1.1] text-right ml-auto max-w-full md:max-w-[700px] lg:max-w-[850px] tracking-tight"
              >
                “Clients always seem to dissapear <br className="hidden md:block" />
                when I send the invoice”
              </motion.h2>

              {/* 2nd quote — slightly left of 1st */}
              <motion.h2
                initial={{ opacity: 0, x: -60, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.3 }}
                className="text-[24px] md:text-[32px] lg:text-[38px] font-black font-rozha text-black leading-[1.1] text-left mr-auto max-w-full md:max-w-[800px] lg:max-w-[950px] tracking-tight md:pl-10"
              >
                “The seller seemed trustworthy… Money  <br className="hidden md:block" />
               lost and no progress to show for it”
              </motion.h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

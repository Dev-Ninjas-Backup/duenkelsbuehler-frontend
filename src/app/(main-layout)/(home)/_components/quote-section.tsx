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
          <div className="absolute left-1/2 -translate-x-1/2 top-[10%] bottom-[10%] w-[100vw] bg-black z-0" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-[400px] z-20"
          >
            {/* The rotated container for both cards */}
            <div className="relative w-full aspect-[1/1.15] transform rotate-[5deg] origin-center">
              {/* Green Shadow Card */}
              <div 
                className="absolute inset-0 bg-[#00D05A] translate-x-6 translate-y-6 shadow-2xl"
                style={{ zIndex: 0 }}
              />
              
              {/* White Invoice Card */}
              <div 
                className="absolute inset-0 bg-white p-8 px-10 pt-10 shadow-sm flex flex-col z-10"
              >
                <p className="text-[#00D05A] font-medium text-[14px] tracking-wide uppercase mb-4 leading-snug font-work-sans">
                  INVOICE #0042 - BRAND<br />
                  CONSULTING
                </p>
                <h2 className="text-[64px] font-bold text-black font-rozha mb-4 leading-none tracking-tight">
                  $3,200
                </h2>
                <p className="text-[#181D27] text-[15px] mb-10 font-work-sans leading-relaxed">
                  Phase 1 delivery - Strategy & Visual<br />
                  Identity
                </p>
                
                <div className="h-[1px] w-full bg-gray-300 mb-5" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D05A]" />
                    <span className="text-[14px] text-[#00D05A] font-work-sans font-medium">Funds secured</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[14px]">🔒</span>
                    <span className="text-[13px] text-[#A3A3A3] font-work-sans">Escrow-style protected - AristoPay</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quote Section Area */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 md:py-24 relative z-10 mt-8">
          
          {/* Left Side - Mouth Graphic */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 relative w-full flex justify-center md:justify-end"
          >
            {/* Make sure user has mouth.png in their public/images folder. We'll use a standard img tag or Next Image */}
            <div className="relative w-full max-w-[400px] aspect-square">
              <Image 
                src="/images/mouth.png" 
                alt="Shouting Mouth Graphic" 
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Right Side - Quotes */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex-1 flex flex-col gap-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-rozha text-black leading-tight">
              “Clients always seem to disappear when I send the invoice”
            </h2>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-rozha text-black leading-tight">
              “The seller seemed trustworthy... Money lost and no progress to show for it”
            </h2>
          </motion.div>
          
        </div>
      </section>
    </div>
  );
}

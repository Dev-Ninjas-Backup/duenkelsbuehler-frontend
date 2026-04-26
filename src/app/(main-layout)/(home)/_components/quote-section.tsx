"use client";

import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export function QuoteSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center md:text-left">
        {/* Visual Graphic Representation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
            {/* Abstract mouth/speaker representation */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1/3 bg-white rounded-full mx-4 opacity-20 blur-md" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 border-y-8 border-white rounded-full mx-6 opacity-30" />
            
            {/* Lightning bolt coming out */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10"
            >
              <Zap className="w-24 h-24 text-[#00D05A] fill-[#00D05A] transform rotate-[15deg]" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold italic text-black leading-tight">
            "The seller seemed trustworthy... Money lost and no progress to show for it"
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

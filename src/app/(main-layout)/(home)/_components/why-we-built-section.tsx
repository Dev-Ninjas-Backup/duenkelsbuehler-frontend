"use client";

import { motion } from "framer-motion";

export function WhyWeBuiltSection() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-24 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto text-center md:text-left relative">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-bold tracking-widest uppercase mb-8 text-black opacity-80 text-center md:text-left"
        >
          - WHY WE BUILT ARISTOPAY -
        </motion.p>
        
        <div className="relative">
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.5, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="text-[#00D05A] text-6xl absolute -top-4 -left-8 md:-left-12 font-serif"
          >
            "
          </motion.span>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-4xl font-serif text-gray-700 leading-relaxed italic z-10 relative"
          >
            We paid in full for an apartment in Mexico. Discovered it had major civil code violations. The money was gone. The protection didn't exist. We built the protection we wish we'd had.
          </motion.p>
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.5, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
            className="text-[#00D05A] text-6xl absolute -bottom-8 -right-4 md:-right-8 font-serif rotate-180"
          >
            "
          </motion.span>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xl font-bold font-serif italic text-black"
        >
          - the AristoPay team
        </motion.p>
      </div>
    </section>
  );
}

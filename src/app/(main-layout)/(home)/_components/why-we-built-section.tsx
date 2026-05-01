"use client";

import { motion } from "framer-motion";

export function WhyWeBuiltSection() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-24 py-24 lg:py-32">
      <div className="max-w-[1300px] mx-auto text-left relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[18px] font-bold tracking-tight mb-12 text-black font-work-sans"
        >
          WHY WE BUILT ARISTOPAY -
        </motion.p>

        <div className="relative mb-12">
          {/* Top Quote Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[#00D05A] text-[64px] leading-none font-bold absolute -top-8 -left-10 select-none"
          >
            “
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[32px] md:text-[42px] lg:text-[48px] font-medium font-work-sans text-[#181D27] leading-[1.3] relative z-10"
          >
            We paid in full for an apartment in Mexico. Discovered it had major civil code violations. The money was gone. The protection didn't exist. We built the protection we wish we'd had.
          </motion.h2>

          {/* Bottom Quote Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#00D05A] text-[64px] leading-none font-bold absolute -bottom-10 -right-4 select-none"
          >
            ”
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-[28px] md:text-[36px] font-bold font-rozha text-black mt-16"
        >
          -The AristoPay Team
        </motion.p>
      </div>
    </section>
  );
}

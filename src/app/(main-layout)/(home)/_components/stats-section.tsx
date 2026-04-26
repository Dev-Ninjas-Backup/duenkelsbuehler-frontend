"use client";

import { motion } from "framer-motion";

export function StatsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, bounce: 0.4 } }
  };

  return (
    <section className="bg-[#00D05A] text-white px-6 md:px-12 lg:px-24 py-16">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/20"
      >
        {/* Stat 1 */}
        <motion.div variants={item} className="flex flex-col md:pr-12 pt-8 md:pt-0">
          <h3 className="text-6xl md:text-8xl font-black mb-4">8%</h3>
          <p className="text-sm font-medium opacity-90 leading-relaxed uppercase tracking-wider max-w-[200px]">
            Premium limited resources for ... to hidden danger
          </p>
        </motion.div>

        {/* Stat 2 */}
        <motion.div variants={item} className="flex flex-col md:px-12 pt-8 md:pt-0">
          <h3 className="text-6xl md:text-8xl font-black mb-4">$150</h3>
          <p className="text-sm font-medium opacity-90 leading-relaxed uppercase tracking-wider max-w-[200px]">
            Reduced annual loss to
          </p>
        </motion.div>

        {/* Stat 3 */}
        <motion.div variants={item} className="flex flex-col md:pl-12 pt-8 md:pt-0">
          <h3 className="text-6xl md:text-8xl font-black mb-4">4</h3>
          <p className="text-sm font-medium opacity-90 leading-relaxed uppercase tracking-wider max-w-[200px]">
            Supported currencies ... <br /> (USD, EUR, GBP, JPY)
          </p>
        </motion.div>

      </motion.div>
    </section>
  );
}

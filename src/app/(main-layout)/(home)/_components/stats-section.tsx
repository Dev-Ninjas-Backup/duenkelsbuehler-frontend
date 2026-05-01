"use client";

import { motion } from "framer-motion";

export function StatsSection() {
  return (
    <section className="bg-[#00D05A] text-white px-6 md:px-12 lg:px-24 py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col space-y-16">
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-b border-white/20 pb-12"
          >
            <h3 className="text-[72px] md:text-[100px] lg:text-[130px] font-normal font-rozha leading-none mb-6 tracking-tighter">8%</h3>
            <p className="text-[18px] md:text-[22px] font-medium font-work-sans tracking-tight text-white/90">
              Maximum blended transaction fee — no hidden charges
            </p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border-b border-white/20 pb-12"
          >
            <h3 className="text-[72px] md:text-[100px] lg:text-[130px] font-normal font-rozha leading-none mb-6 tracking-tighter">$150</h3>
            <p className="text-[18px] md:text-[22px] font-medium font-work-sans tracking-tight text-white/90">
              Minimum transaction size
            </p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-[72px] md:text-[100px] lg:text-[130px] font-normal font-rozha leading-none mb-6 tracking-tighter">4</h3>
            <p className="text-[18px] md:text-[22px] font-medium font-work-sans tracking-tight text-white/90">
              Supported currencies — USD, EUR, GBP, CHF
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

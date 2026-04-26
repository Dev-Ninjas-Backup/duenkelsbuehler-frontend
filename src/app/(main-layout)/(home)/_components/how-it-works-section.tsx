"use client";

import { motion } from "framer-motion";

export function HowItWorksSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="bg-[#00D05A] text-white px-6 md:px-12 lg:px-24 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-bold tracking-widest uppercase mb-4 opacity-90"
        >
          - HOW IT WORKS
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-bold leading-tight mb-16 tracking-tight max-w-2xl"
        >
          Three steps. <br />
          Zero surprises.
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Steps List */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 space-y-12"
          >
            {/* Step 1 */}
            <motion.div variants={item} className="flex gap-6 items-start">
              <span className="text-6xl font-black leading-none opacity-90">1</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Agree on terms</h3>
                <p className="text-green-50 opacity-90 leading-relaxed max-w-sm">
                  Set terms, attach your contract. Securely sign in with AristoPay.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={item} className="flex gap-6 items-start">
              <span className="text-6xl font-black leading-none opacity-90">2</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Fund the escrow</h3>
                <p className="text-green-50 opacity-90 leading-relaxed max-w-sm">
                  Fund the escrow safely to secure the services.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={item} className="flex gap-6 items-start">
              <span className="text-6xl font-black leading-none opacity-90">3</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Work delivered</h3>
                <p className="text-green-50 opacity-90 leading-relaxed max-w-sm">
                  Get paid once the job is finished. Release funds with one click. Both are protected.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-video bg-gray-200 rounded-t-xl rounded-b flex flex-col justify-end overflow-hidden shadow-2xl">
              {/* Screen Content */}
              <div className="absolute inset-2 top-4 bg-white rounded-t flex items-center justify-center">
                <div className="text-center">
                   <div className="w-24 h-24 mx-auto bg-black rounded flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">🤝</span>
                   </div>
                </div>
              </div>
              {/* Laptop base */}
              <div className="h-4 bg-gray-400 w-full rounded-b relative z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

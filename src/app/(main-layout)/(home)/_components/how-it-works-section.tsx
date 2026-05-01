"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  return (
    <section className="bg-[#00D05A] text-white px-6 md:px-12 lg:px-24 py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          {/* Left Side - Content */}
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[18px] font-bold tracking-tight mb-8 font-work-sans"
            >
              — HOW IT WORKS
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[52px] md:text-[68px] lg:text-[84px] font-light font-rozha leading-[1.05] mb-20 tracking-tighter"
            >
              Three steps.<br />
              Zero surprises.
            </motion.h2>

            <div className="space-y-14 text-base">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-8 items-start group "
              >
                <span className="text-[72px] md:text-[96px] font-bold font-rozha leading-none -mt-4">1</span>
                <p className="text-[18px] md:text-[20px] leading-[1.4] max-w-lg mt-3 font-light">
                  <span className="font-bold">Send a proposal.</span> Set a price. Attach your contract. Request a signature with AristoAccess+
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex gap-8 items-start group"
              >
                <span className="text-[72px] md:text-[96px] font-bold font-rozha leading-none -mt-4">2</span>
                <p className="text-[18px] md:text-[20px] leading-[1.4] max-w-lg mt-3">
                  <span className="font-bold">Funds are secured</span> until both parties confirm delivery.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex gap-8 items-start group"
              >
                <span className="text-[72px] md:text-[96px] font-bold font-rozha leading-none -mt-4">3</span>
                <p className="text-[18px] md:text-[20px] leading-[1.4] max-w-lg mt-3">
                  <span className="font-bold">Deal is done.</span> Get paid or recieve your product/service. Release funds with one click. Both sides protected.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Laptop Image */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full flex justify-center lg:justify-end items-center pt-20 lg:pt-40"
          >
            <div className="relative w-full max-w-[700px] aspect-[4/3]">
              <Image
                src="/images/laptop.png"
                alt="Laptop showing handshake"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

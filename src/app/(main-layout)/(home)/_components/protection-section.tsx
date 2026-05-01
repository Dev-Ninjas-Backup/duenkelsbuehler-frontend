"use client";

import Image from "next/image";
import { Handshake, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

export function ProtectionSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="bg-black text-white px-6 md:px-12 lg:px-24 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-[#00D05A] text-[16px] font-bold tracking-tight mb-8 font-work-sans">
            — BUILT ON EXPERIENCE
          </p>
          <h2 className="text-[48px] md:text-[64px] lg:text-[76px] font-base font-rozha leading-[1.1] mb-10 tracking-tighter">
            Every layer of <br />
            protection, <span className="text-[#00D05A]">in one place.</span>
          </h2>
          
          <p className="text-white/90 max-w-4xl text-[18px] md:text-[20px] mb-16 leading-relaxed font-work-sans">
            Most platforms shake your hand and wish you luck. We make sure both parties are who they say they are, the terms are signed, and the money doesn't move until the job is done.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8"
        >
          {/* Feature 1 */}
          <motion.div variants={item} className="flex flex-col items-center text-center">
            <div className="mb-6 relative w-12 h-12">
              <Image 
                src="/svg/crown.svg" 
                alt="Crown icon" 
                fill 
                className="object-contain" 
              />
            </div>
            <h3 className="text-[28px] md:text-[32px] font-bold font-rozha mb-4 tracking-tight">Verified Identities</h3>
            <p className="text-white/80 text-[16px] leading-relaxed max-w-[240px]">
              ID verification on every premium transaction.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={item} className="flex flex-col items-center text-center">
            <div className="mb-6">
              <Handshake className="w-12 h-12 text-[#00D05A]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[28px] md:text-[32px] font-bold font-rozha mb-4 tracking-tight">Signed Agreements</h3>
            <p className="text-white/80 text-[16px] leading-relaxed max-w-[240px]">
              DocuSign contracts built into premium proposals.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={item} className="flex flex-col items-center text-center">
            <div className="mb-6">
              <LockKeyhole className="w-12 h-12 text-[#00D05A]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[28px] md:text-[32px] font-bold font-rozha mb-4 tracking-tight">Protected Payments</h3>
            <p className="text-white/80 text-[16px] leading-relaxed max-w-[240px]">
              Escrow-style payment protection on every transaction.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { ShieldCheck, FileSignature, Lock } from "lucide-react";
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
    <section className="bg-black text-white px-6 md:px-12 lg:px-24 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#00D05A] text-sm font-bold tracking-widest uppercase mb-4">
            - BUILT ON EXPERIENCE
          </p>
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Every layer of <br className="hidden md:block" />
            protection, <span className="text-[#00D05A]">in one place.</span>
          </h2>
          
          <p className="text-gray-400 max-w-2xl text-lg mb-16 leading-relaxed">
            We play from the rules you set and help you back. We make sure both parties are who they say they are. Contracts are signed, and the money is secure until the job is done.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {/* Feature 1 */}
          <motion.div variants={item} className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-black transform rotate-[-5deg]">
              <ShieldCheck className="w-8 h-8 text-[#00D05A]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Verified Identities</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              ID verification process on secure connection.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={item} className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-[#00D05A] rounded-2xl flex items-center justify-center mb-6 text-white transform rotate-[3deg]">
              <FileSignature className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Signed Agreements</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Use your contract and have absolute proposals.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={item} className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-black transform rotate-[-2deg]">
              <Lock className="w-8 h-8 text-[#00D05A]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Protected Payments</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Securely store compensation on every transaction.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

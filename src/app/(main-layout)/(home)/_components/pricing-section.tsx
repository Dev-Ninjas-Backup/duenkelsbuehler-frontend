"use client";

import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function PricingSection() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-24 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-widest uppercase mb-4 opacity-80 text-black">
            - PRICING
          </p>
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight text-black">
            Transparent fees. <br />
            <span className="text-[#00D05A]">No surprises.</span>
          </h2>
          <p className="text-gray-500 mb-16 max-w-xl">
            Start for free to protect one transaction. Upgrade when you are ready to use our full tool set.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="border border-gray-200 rounded-xl p-8 lg:p-12 flex flex-col h-full hover:shadow-xl transition-shadow bg-white"
          >
            <h3 className="text-gray-500 font-bold tracking-widest uppercase text-sm mb-4">FREE</h3>
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-black mt-2">$</span>
              <span className="text-7xl font-black text-black">0</span>
            </div>
            <p className="text-gray-500 text-sm mb-8 pb-8 border-b border-gray-100">
              For essentially commitment
            </p>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['One completely protected transaction', 'Standard contract templates', 'Client and ID verification', 'Accept USD, GBP, JPY', 'Standard message-based support', '2% fee taken from platform'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D05A] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/signup" 
              className="w-full sm:w-auto inline-flex justify-center px-8 py-4 bg-black text-white font-bold rounded hover:bg-gray-800 transition-colors"
            >
              GET STARTED
            </Link>
          </motion.div>

          {/* Paid Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border border-gray-800 bg-black rounded-xl p-8 lg:p-12 flex flex-col h-full shadow-2xl relative overflow-hidden text-white transform md:translate-y-[-16px]"
          >
            <Crown className="absolute top-8 right-8 w-12 h-12 text-[#00D05A] opacity-20" />
            <h3 className="text-white font-bold tracking-widest uppercase text-sm mb-4">ARISTO SUCCESS</h3>
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-white mt-2">$</span>
              <span className="text-7xl font-black text-white">29</span>
            </div>
            <p className="text-gray-400 text-sm mb-8 pb-8 border-b border-gray-800">
              For steadily commitment
            </p>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['Everything in Free', 'Unlimited protected transactions', 'Upload custom contract drafts', 'White-labeled options', 'Dedicated Transaction Concierge', 'Discounted escrow dispute fees', 'Ability to use non-escrow mode'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D05A] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/signup" 
              className="w-full sm:w-auto inline-flex justify-center px-8 py-4 bg-[#00D05A] text-white font-bold rounded hover:bg-[#00b34d] transition-colors"
            >
              CHOOSE PLAN
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

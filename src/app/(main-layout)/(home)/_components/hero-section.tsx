"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  return (
    <section className="px-6 md:px-12 lg:px-24 py-12 lg:py-24 bg-[#FAFAFA] overflow-hidden min-h-[calc(100vh-112px)] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-8 z-10 w-full"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-[#181D27] font-rozha flex flex-wrap"
          >
            {"Business Held to a".split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 120, damping: 14 }
                  }
                }}
                className="mr-3 lg:mr-4 inline-block"
              >
                {word}
              </motion.span>
            ))}
            <div className="w-full h-0 lg:h-1" />
            {"Higher Standard".split(" ").map((word, i) => (
              <motion.span
                key={`green-${i}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 120, damping: 14 }
                  }
                }}
                className="text-[#00D05A] mr-3 lg:mr-4 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-[#414651] text-lg md:text-xl max-w-2xl leading-relaxed font-work-sans"
          >
            Send invoices, attach contracts, and get paid — <br className="hidden md:block" />
            with every transaction escrow-style protected from start to finish.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link 
              href="/sign-up" 
              className="px-8 py-3.5 bg-[#00D05A] text-white font-medium tracking-wide rounded-md hover:bg-[#00b34d] hover:shadow-lg hover:shadow-[#00D05A]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-block duration-200"
            >
              GET STARTED FREE
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-8 py-3.5 border border-[#181D27] text-[#181D27] font-medium tracking-wide rounded-md hover:bg-gray-50 hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-block duration-200"
            >
              SEE HOW IT WORKS
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Right Content - Interactive/Animated Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex-1 w-full relative flex items-center justify-center lg:justify-end min-h-[380px] lg:min-h-0"
        >
          {/* Main Dashboard Preview Card */}
          <div className="relative w-full max-w-[420px] bg-white border border-gray-200/80 shadow-2xl rounded-3xl p-6 md:p-8 overflow-hidden z-10">
            {/* Background decorative gradient */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#00D05A]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#181D27]/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-work-sans">Active Deal</p>
                <h4 className="font-work-sans text-[#181D27] text-base font-bold">Brand Design Project</h4>
              </div>
              <span className="px-2.5 py-0.5 bg-[#00D05A]/10 text-[#00D05A] text-xs font-bold rounded-full font-work-sans flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D05A] animate-ping" /> Escrow Secured
              </span>
            </div>

            {/* Price Badge */}
            <div className="flex items-baseline gap-1 mb-8">
              <span className="font-rozha text-xl text-gray-400">$</span>
              <span className="font-rozha text-4xl font-bold text-[#181D27] tracking-tight">3,200</span>
              <span className="text-gray-400 text-xs ml-1 font-work-sans">USD</span>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-6">
              {[
                { label: "1. Proposal & Agreement", desc: "Signed with DocuSign", status: "completed" },
                { label: "2. Escrow Deposit", desc: "Funds held securely by AristoPay", status: "completed" },
                { label: "3. Project Delivery", desc: "Reviewing work submissions", status: "active" },
                { label: "4. Fund Release", desc: "Direct payout to service provider", status: "pending" }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start relative">
                  {idx < 3 && (
                    <div className={`absolute left-3 top-7 w-[2px] h-[calc(100%-8px)] ${
                      idx < 2 ? "bg-[#00D05A]" : "bg-gray-200"
                    }`} />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 transition-colors duration-300 ${
                    step.status === "completed" 
                      ? "bg-[#00D05A] border-[#00D05A] text-white" 
                      : step.status === "active" 
                      ? "border-[#00D05A] bg-white text-[#00D05A]" 
                      : "border-gray-200 bg-white text-gray-300"
                  }`}>
                    {step.status === "completed" ? (
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold font-work-sans leading-none mb-1 ${
                      step.status === "pending" ? "text-gray-400" : "text-[#181D27]"
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400 font-work-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Glass Card 1 (top-left) */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [-2, 1, -2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-6 -left-4 bg-white/90 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-4 flex items-center gap-3 max-w-[180px] pointer-events-none z-20"
          >
            <div className="w-9 h-9 rounded-full bg-[#00D05A]/10 flex items-center justify-center text-[#00D05A]">
              <Check className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 leading-none mb-1 uppercase tracking-wider font-work-sans">Contract</p>
              <p className="text-xs font-bold text-[#181D27] font-work-sans leading-snug">Verified & Signed</p>
            </div>
          </motion.div>

          {/* Floating Glass Card 2 (bottom-right) */}
          <motion.div 
            animate={{ 
              y: [0, 10, 0],
              rotate: [3, -1, 3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -bottom-6 -right-4 bg-white/90 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-4 flex items-center gap-3 max-w-[180px] pointer-events-none z-20"
          >
            <div className="w-9 h-9 rounded-full bg-[#181D27] flex items-center justify-center text-white">
              <span className="text-sm">🔒</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 leading-none mb-1 uppercase tracking-wider font-work-sans">Security</p>
              <p className="text-xs font-bold text-[#181D27] font-work-sans leading-snug">Funds Protected</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function AboutSection() {
  return (
    <section id="about" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 flex flex-col items-center sm:items-start"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-work-sans text-sm text-muted-foreground uppercase tracking-wide text-center sm:text-left"
          >
            About
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-rozha text-4xl sm:text-4xl lg:text-5xl font-normal leading-tight text-center sm:text-left"
          >
            Transparent Marketplace for Securing Deals
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-work-sans text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            AristoPay is built for people who take work — and their money —
            seriously. With transparent profiles, accountable reviews, built-in
            contract signing and document sharing, and escrow-style payment
            protection — you're protected at every stage of the transaction. 🔒
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button 
              className="bg-[#181D27] hover:bg-[#181D27]/90 text-white rounded-full px-12! py-4 h-auto font-work-sans gap-3 hover:scale-105 transition-transform"
            >
              Get Started
              <ArrowRight className="h-10 w-10" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="relative"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative aspect-square w-full max-w-md mx-auto"
          >
            <Image
              src="/images/about/about.png"
              alt="Computer with handshake illustration"
              fill
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

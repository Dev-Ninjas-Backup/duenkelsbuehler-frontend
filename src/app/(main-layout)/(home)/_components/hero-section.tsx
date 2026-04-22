"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useBanners } from "@/hooks/admin/use-admin"

export function HeroSection() {
  const { data: banners = [] } = useBanners()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [banners.length])

  const bgImage = banners.length > 0 ? banners[current].imageUrl : "/images/hero/banner.png"

  return (
    <section id="home" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl max-w-7xl mx-auto"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div key={bgImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }} className="absolute inset-0">
              <Image src={bgImage} alt="Hero Background" fill className="object-cover" priority />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-rozha text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-6"
            >
              <p className="text-[#FDFDFD]">Business Held to a </p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-[#16A34A]"
              >
                Higher Standard
              </motion.p>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="font-work-sans text-base sm:text-lg text-[#FDFDFD] leading-relaxed"
            >
              Connect with transparent service providers and clients alike. Set and
              sign your standards. Every payment escrow-protected 🔒
            </motion.p>
          </div>
        </div>

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to banner ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-5" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}

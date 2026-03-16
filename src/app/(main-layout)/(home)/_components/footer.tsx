"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="bg-[#0A0D12] text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
        >
          {/* Left - Logo Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center"
          >
            <span className="font-rozha text-2xl sm:text-4xl font-normal text-white">
              AristoPay
            </span>
            <Image
              src="/images/logo/footer_logo.png"
              alt="AristoPay Logo"
              width={64}
              height={64}
              className="w-12 h-12 sm:w-12 sm:h-12"
            />
          </motion.div>

          {/* Right - Contact & Social */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="font-work-sans text-sm text-gray-400 mb-2">
                Contact Us
              </p>
              <Link 
                href="mailto:Support@aristopay.co" 
                className="font-work-sans text-white hover:text-[#16A34A] transition-colors"
              >
                Support@aristopay.co
              </Link>
            </motion.div>

            {/* Social Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="font-work-sans text-sm text-gray-400 mb-3">
                Follow Us
              </p>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-white hover:bg-white hover:text-[#0A0D12] transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

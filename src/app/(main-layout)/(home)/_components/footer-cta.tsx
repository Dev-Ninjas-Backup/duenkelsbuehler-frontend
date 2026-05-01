"use client";

import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FooterCTA() {
  return (
    <footer className="bg-black text-white px-6 md:px-12 lg:px-24">
      {/* CTA Section */}
      <div className="py-24 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[16px] md:text-[18px] font-medium mb-8 font-work-sans text-white/90"
        >
          Built by people who know.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[48px] md:text-[72px] lg:text-[100px] font-normal font-rozha leading-[1.0] mb-8 tracking-tighter"
        >
          <span className="text-[#00D05A]">There&apos;s a better way</span> to do business.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[18px] md:text-[22px] text-white/60 mb-12 max-w-3xl font-work-sans tracking-tight"
        >
          Join professionals who&apos;ve decided their work — and their money — deserves better.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <Link
            href="/sign-up"
            className="px-10 py-4 bg-[#00D05A] text-white font-bold rounded-md hover:bg-[#00b34d] transition-all transform hover:scale-105 uppercase tracking-wider text-[14px] font-work-sans"
          >
            CREATE FREE ACCOUNT
          </Link>
          <Link
            href="/pricing"
            className="text-white/60 hover:text-white flex items-center gap-2 text-[14px] font-bold uppercase tracking-widest transition-colors font-work-sans"
          >
            VIEW PRICING <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-white/10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="mb-12">
            <span className="text-[32px] md:text-[42px] font-bold font-rozha tracking-tight">AristoPay</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4 mb-20">
            {[
              { name: 'How It Works', href: '/how-it-works' },
              { name: 'Pricing', href: '/pricing' },
              { name: 'Terms', href: '/terms' },
              { name: 'Privacy', href: '/privacy' },
              { name: 'Support', href: '/support' }
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/60 hover:text-white text-[16px] md:text-[18px] font-medium transition-colors font-work-sans"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 text-white/40 text-[14px] font-work-sans">
            <p className="order-2 md:order-1">
              © {new Date().getFullYear()} AristoPay · Business Held to a Higher Standard
            </p>
            
            <div className="flex items-center gap-6 order-1 md:order-2">
              <span className="text-white/80 font-bold">Follow Us:</span>
              <div className="flex items-center gap-4">
                <Link href="https://instagram.com" target="_blank" className="hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </Link>
                <Link href="https://tiktok.com" target="_blank" className="hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

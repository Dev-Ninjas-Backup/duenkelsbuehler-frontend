"use client";

import Link from "next/link";
import { Hexagon, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FooterCTA() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12 lg:px-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto flex flex-col items-center text-center"
      >
        <p className="text-gray-400 font-medium mb-6 uppercase tracking-widest text-sm">
          built by people who know
        </p>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          There's a <span className="text-[#00D05A]">better way</span> <br />
          to do business.
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl">
          Join professionals who've decided their work — and their money — deserves better
        </p>
        
        <div className="flex flex-col items-center gap-4 w-full">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-10 py-4 bg-[#00D05A] text-white font-bold rounded hover:bg-[#00b34d] transition-colors"
          >
            GET STARTED FREE
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors group"
          >
            Talk to Sales <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-7xl mx-auto mt-32 border-t border-gray-800 pt-12 flex flex-col items-center"
      >
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Hexagon className="w-8 h-8 text-white fill-white/10" />
          <span className="text-2xl font-bold tracking-tight">AristoPay</span>
        </Link>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {['How it works', 'Pricing', 'Terms', 'Privacy', 'Support'].map((link) => (
            <Link key={link} href={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
              {link}
            </Link>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full text-gray-500 text-sm">
          <p>© 2024 AristoPay. Built to hold a higher standard</p>
          <div className="flex items-center gap-6 mt-6 md:mt-0">
            <span className="uppercase text-xs font-bold tracking-widest mr-2">Follow Us</span>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

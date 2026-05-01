"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { subscriptionService } from "@/services/subscription/subscription-service";
import { SubscriptionPlan } from "@/types/subscription";
import { useAuthStore } from "@/stores/auth/use-auth-store";

export function PricingSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, role } = useAuthStore();

  useEffect(() => {
    subscriptionService.getPlans()
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch plans:", err);
        setLoading(false);
      });
  }, []);

  const premiumPlan = plans.find(p => p.amount > 0 && p.isActive);
  
  const dashboardHref = role === "CLIENT" 
    ? "/client/discover" 
    : role === "SERVICE_PROVIDER" 
    ? "/sp/connect" 
    : "/admin/dashboard";

  const buttonHref = isAuthenticated ? dashboardHref : "/login";

  return (
    <section className="bg-white px-6 md:px-12 lg:px-24 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-[18px] font-bold tracking-tight mb-8 text-black font-work-sans">
            — PRICING
          </p>
          <h2 className="text-[52px] md:text-[68px] lg:text-[100px] font-normal font-rozha leading-[0.95] mb-6 tracking-tighter">
            Transparent fees.<br />
            <span className="text-[#00D05A]">No surprises.</span>
          </h2>
          <p className="text-[#181D27]/70 text-[18px] md:text-[22px] max-w-3xl leading-relaxed font-work-sans tracking-tight">
            One free tier for those getting started. One premium tier for those who mean business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl">
          {/* Free Plan - Kept as a separate card as requested */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-[1.5px] border-black rounded-none p-10 lg:p-14 flex flex-col h-full bg-white shadow-sm"
          >
            <h3 className="text-[#A3A3A3] font-bold tracking-widest uppercase text-[18px] mb-6 font-work-sans">FREE</h3>
            <div className="flex items-start mb-6">
              <span className="text-[32px] font-normal text-black mt-3 font-rozha mr-1">$</span>
              <span className="text-[84px] md:text-[110px] font-normal text-black leading-none font-rozha tracking-tighter">0</span>
            </div>
            <p className="text-[#A3A3A3] text-[18px] mb-10 pb-10 border-b border-gray-100 font-work-sans tracking-tight">
              No monthly commitment
            </p>
            
            <ul className="space-y-3 mb-16 flex-1">
              {[
                'Escrow-style payment protection',
                'Send and receive proposals',
                'Credit card & ACH payments',
                'USD - EUR - GBP - CHF',
                '5% seller - 3% buyer transaction fee',
                '$150 minimum transaction'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#00D05A] font-bold mt-0.5">✓</span>
                  <span className="text-[#414651] text-[16px] font-medium font-work-sans tracking-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={buttonHref}
              className="w-full sm:w-auto inline-flex justify-center px-10 py-4 bg-black text-white font-bold rounded-sm hover:bg-gray-900 transition-colors uppercase tracking-wider text-[14px] font-work-sans"
            >
              START FREE
            </Link>
          </motion.div>

          {/* Premium Plan - Dynamic from API */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black rounded-none p-10 lg:p-14 flex flex-col h-full shadow-2xl relative overflow-hidden text-white"
          >
            <div className="absolute top-10 right-10 w-16 h-16">
              <Image src="/svg/crown.svg" alt="Crown badge" fill className="object-contain" />
            </div>
            <h3 className="text-white font-bold tracking-widest uppercase text-[18px] mb-6 font-work-sans">
              {loading ? "LOADING..." : (premiumPlan?.name || "ARISTOACCESS+")}
            </h3>
            <div className="flex items-start mb-6">
              <span className="text-[32px] font-normal text-white mt-3 font-rozha mr-1">$</span>
              <span className="text-[84px] md:text-[110px] font-normal text-white leading-none font-rozha tracking-tighter">
                {loading ? "..." : (premiumPlan?.amount || "29")}
              </span>
            </div>
            <p className="text-[#A3A3A3] text-[18px] mb-10 pb-10 border-b border-gray-800 font-work-sans tracking-tight">
              No monthly commitment
            </p>
            
            <ul className="space-y-3 mb-16 flex-1">
              {[
                'Everything in Free',
                'Either party can send proposals',
                '5 DocuSign contracts monthly',
                'ID verification via Veriff',
                'Dedicated Transaction Concierge',
                'Priority email support within 24 hrs',
                'Additional contracts at $2 each'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#00D05A] font-bold mt-0.5">✓</span>
                  <span className="text-white/90 text-[16px] font-medium font-work-sans tracking-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={buttonHref}
              className="w-full sm:w-auto inline-flex justify-center px-10 py-4 bg-[#00D05A] text-white font-bold rounded-sm hover:bg-[#00b34d] transition-colors uppercase tracking-wider text-[14px]"
            >
              {loading ? "PLEASE WAIT" : "GO PREMIUM"}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

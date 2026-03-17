"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Step = "plan" | "payment" | "success";

const inputCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";

export default function SubscribePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("plan");

  return (
    <div className="flex flex-col h-full px-6 py-10 items-center justify-center">
      <AnimatePresence mode="wait">
        {step === "plan" && (
          <motion.div
            key="plan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center max-w-sm w-full gap-6"
          >
            <Image src="/svg/black_crown.svg" alt="Crown" width={56} height={40} className="object-contain" />
            <h1 className="font-rozha text-4xl text-[#181D27] text-center">AristoAccess+</h1>
            <p className="font-work-sans text-sm text-[#414651] text-center">
              Subscribe to unlock the ability to send proposals and transact with Service Providers.
            </p>

            <div className="w-full bg-[#F9F9F9] rounded-2xl px-6 py-5 flex flex-col gap-2">
              <p className="font-rozha text-2xl text-[#181D27]">$9.99 / month</p>
              <p className="font-work-sans text-xs text-[#9CA3AF]">Cancel anytime. No hidden fees.</p>
              <ul className="mt-3 flex flex-col gap-2">
                {["Send unlimited proposals", "Track all transactions", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-work-sans text-sm text-[#414651]">
                    <span className="w-4 h-4 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("payment")}
              className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
            >
              Subscribe Now
            </motion.button>
            <button onClick={() => router.back()} className="font-work-sans text-sm text-[#9CA3AF] underline underline-offset-2">
              Maybe later
            </button>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center max-w-sm w-full gap-5"
          >
            <h1 className="font-rozha text-4xl text-[#181D27] text-center mb-2">Payment</h1>

            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-work-sans text-sm font-medium text-[#181D27]">Card Number</label>
                <input placeholder="1234 5678 9012 3456" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-work-sans text-sm font-medium text-[#181D27]">Expiry</label>
                  <input placeholder="MM/YY" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-work-sans text-sm font-medium text-[#181D27]">CVV</label>
                  <input placeholder="123" className={inputCls} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-work-sans text-sm font-medium text-[#181D27]">Name on Card</label>
                <input placeholder="Full Name" className={inputCls} />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("success")}
              className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors mt-2"
            >
              Pay $9.99
            </motion.button>
            <button onClick={() => setStep("plan")} className="font-work-sans text-sm text-[#9CA3AF] underline underline-offset-2">
              Back
            </button>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center max-w-sm w-full gap-6 text-center"
          >
            {/* Gold seal */}
            <svg viewBox="0 0 80 80" className="w-24 h-24">
              <circle cx="40" cy="40" r="36" fill="#D97706" opacity="0.15" />
              <circle cx="40" cy="40" r="30" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="6 3" />
              <circle cx="40" cy="40" r="22" fill="#D97706" opacity="0.25" />
              <path d="M28 40l8 8 16-16" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="font-rozha text-4xl text-[#181D27]">You&apos;re In!</h1>
            <p className="font-work-sans text-sm text-[#414651] leading-relaxed">
              Welcome to AristoAccess+. You can now send proposals and transact with Service Providers.
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/client/transact?subscribed=true")}
              className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
            >
              Let&apos;s Go
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

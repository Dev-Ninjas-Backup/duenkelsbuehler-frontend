"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";

export default function SubscribePage() {
  const router = useRouter();
  const { data: plans = [], isLoading } = useSubscriptionPlans();
  const { mutate: createCheckout, isPending } = useCreateCheckoutSession();

  const handleSubscribe = (planId: number) => {
    createCheckout(
      {
        planId,
        successUrl: `${window.location.origin}/client/transact?subscribed=true`,
        cancelUrl: `${window.location.origin}/client/transact/subscribe`,
      },
      {
        onSuccess: (data) => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#181D27]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 py-10 items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="flex flex-col items-center max-w-sm w-full gap-6">

          <Image src="/svg/black_crown.svg" alt="Crown" width={56} height={40} className="object-contain" />
          <h1 className="font-rozha text-4xl text-[#181D27] text-center">AristoAccess+</h1>
          <p className="font-work-sans text-sm text-[#414651] text-center">
            Subscribe to unlock the ability to send proposals and transact with Service Providers.
          </p>

          {plans.length === 0 ? (
            /* Fallback if no plans in DB */
            <div className="w-full bg-[#F9F9F9] rounded-2xl px-6 py-5 flex flex-col gap-2">
              <p className="font-rozha text-2xl text-[#181D27]">$9.99 / month</p>
              <p className="font-work-sans text-xs text-[#9CA3AF]">Cancel anytime. No hidden fees.</p>
              <ul className="mt-3 flex flex-col gap-2">
                {["Send unlimited proposals", "Track all transactions", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-work-sans text-sm text-[#414651]">
                    <span className="w-4 h-4 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            /* Real plans from API */
            <div className="w-full flex flex-col gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="w-full bg-[#F9F9F9] rounded-2xl px-6 py-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-work-sans font-semibold text-[#181D27]">{plan.name}</p>
                    <p className="font-rozha text-xl text-[#181D27]">
                      {plan.currency} {plan.amount}
                      <span className="font-work-sans text-sm text-[#9CA3AF]">/{plan.interval === "MONTH" ? "mo" : "yr"}</span>
                    </p>
                  </div>
                  {plan.description && (
                    <p className="font-work-sans text-xs text-[#414651]">{plan.description}</p>
                  )}
                  <motion.button whileTap={{ scale: 0.95 }} disabled={isPending}
                    onClick={() => handleSubscribe(plan.id)}
                    className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-60">
                    {isPending ? "Redirecting..." : "Subscribe Now"}
                  </motion.button>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => router.back()} className="font-work-sans text-sm text-[#9CA3AF] underline underline-offset-2">
            Maybe later
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

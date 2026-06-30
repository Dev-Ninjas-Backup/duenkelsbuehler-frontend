"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";
import { Check } from "lucide-react";

function parseFeatures(description: string): string[] {
  if (!description) return [];
  return description
    .split(/✓|•|\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

const DEFAULT_PREMIUM_FEATURES = [
  "Everything in Free",
  "Either party can send proposals",
  "5 DocuSign contracts monthly",
  "ID verification via Veriff",
  "Dedicated Transaction Concierge",
  "Priority email support within 24 hrs",
  "Additional contracts at $2 each"
];

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
      <div className="flex flex-col h-full items-center justify-center bg-white">
        <svg className="animate-spin h-8 w-8 text-[#181D27]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const isMultiPlan = plans.length > 1;

  return (
    <div className="flex flex-col h-full w-full px-6 py-10 items-center overflow-y-auto bg-[#F8F9FA] min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key="plans"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col items-center w-full gap-8 ${isMultiPlan ? "max-w-4xl" : "max-w-md"}`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-12">
              <Image src="/svg/black_crown.svg" alt="Crown" fill className="object-contain" />
            </div>
            <h1 className="font-rozha text-4xl text-[#181D27] text-center">AristoAccess+</h1>
            <p className="font-work-sans text-sm text-[#414651] text-center max-w-sm">
              Subscribe to unlock the ability to send proposals and transact with Service Providers.
            </p>
          </div>

          {plans.length === 0 ? (
            /* Fallback if no plans in DB */
            <div className="w-full bg-[#181D27] text-white rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-xl relative border border-transparent">
              <div className="absolute top-6 right-6 w-8 h-8">
                <Image src="/svg/crown.svg" alt="Premium Plan" fill className="object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-work-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">PREMIUM</p>
                <div className="flex items-baseline gap-0.5 mt-2">
                  <span className="font-work-sans text-lg font-semibold">$</span>
                  <span className="font-rozha text-5xl leading-none">9.99</span>
                  <span className="font-work-sans text-sm text-gray-400 ml-0.5">/month</span>
                </div>
                <p className="font-work-sans text-xs text-gray-400 mt-1">No monthly commitment</p>
              </div>

              <div className="h-px bg-white/10 my-2" />

              <ul className="flex flex-col gap-3 flex-1">
                {[
                  "Send unlimited proposals",
                  "Track all transactions",
                  "Priority support",
                  "DocuSign contracts integration",
                  "ID verification via Veriff"
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 font-work-sans text-sm">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={isPending}
                onClick={() => handleSubscribe(1)}
                className="w-full h-12 rounded-full bg-[#00D05A] hover:bg-[#00b34d] text-white font-work-sans text-sm font-semibold transition-colors mt-4 shadow-lg shadow-[#00D05A]/25 disabled:opacity-60"
              >
                {isPending ? "Redirecting..." : "SUBSCRIBE NOW"}
              </motion.button>
            </div>
          ) : (
            /* Real plans from API styled with premium layout */
            <div className={`w-full ${isMultiPlan ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-4"}`}>
              {plans.map((plan) => {
                const isPremium = plan.name.toLowerCase().includes("access") || plan.amount > 0;
                const features = parseFeatures(plan.description);
                const displayFeatures = features.length > 0 ? features : DEFAULT_PREMIUM_FEATURES;

                return (
                  <div
                    key={plan.id}
                    className={`w-full rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all duration-300 relative border ${
                      isPremium
                        ? "bg-[#181D27] text-white border-transparent shadow-xl"
                        : "bg-white text-[#181D27] border-gray-200 shadow-sm"
                    }`}
                  >
                    {isPremium && (
                      <div className="absolute top-6 right-6 w-8 h-8">
                        <Image src="/svg/crown.svg" alt="Premium Plan" fill className="object-contain" />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <p className={`font-work-sans text-xs font-semibold uppercase tracking-wider ${isPremium ? "text-gray-400" : "text-[#9CA3AF]"}`}>
                        {isPremium ? "PREMIUM" : "BASIC"}
                      </p>
                      <p className="font-rozha text-2xl tracking-wide font-semibold mt-1">{plan.name}</p>
                      <div className="flex items-baseline gap-0.5 mt-3">
                        <span className="font-work-sans text-lg font-semibold">$</span>
                        <span className="font-rozha text-5xl leading-none">{plan.amount}</span>
                        <span className={`font-work-sans text-sm ml-0.5 ${isPremium ? "text-gray-400" : "text-gray-500"}`}>
                          /{plan.interval === "MONTH" ? "month" : "year"}
                        </span>
                      </div>
                      <p className={`font-work-sans text-xs mt-1.5 ${isPremium ? "text-gray-400" : "text-gray-500"}`}>
                        No monthly commitment
                      </p>
                    </div>

                    <div className={`h-px my-2 ${isPremium ? "bg-white/10" : "bg-gray-100"}`} />

                    <ul className="flex flex-col gap-3 flex-1">
                      {displayFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 font-work-sans text-sm">
                          <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span className={isPremium ? "text-gray-300" : "text-[#535862]"}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={isPending}
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full h-12 rounded-full font-work-sans font-semibold text-sm transition-colors mt-4 disabled:opacity-60 ${
                        isPremium
                          ? "bg-[#00D05A] hover:bg-[#00b34d] text-white shadow-lg shadow-[#00D05A]/25"
                          : "bg-[#181D27] hover:bg-[#181D27]/90 text-white"
                      }`}
                    >
                      {isPending ? "Redirecting..." : "SUBSCRIBE NOW"}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => router.back()}
            className="font-work-sans text-sm text-[#9CA3AF] hover:text-[#181D27] transition-colors underline underline-offset-4 cursor-pointer mt-2"
          >
            Maybe later
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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

const FREE_PLAN_OBJECT = {
  id: -99,
  name: "Free Tier",
  amount: 0,
  interval: "MONTH",
  description:
    "✓ Escrow-style payment protection\n✓ Send & receive proposals\n✓ Credit card & ACH payments\n✓ USD · EUR · GBP · CHF\n✓ 5% seller · 3% buyer transaction fee\n✓ $150 minimum transaction",
  isFree: true,
};

export default function SubscribePage() {
  const router = useRouter();
  const { data: plans = [], isLoading } = useSubscriptionPlans();
  const { mutate: createCheckout, isPending } = useCreateCheckoutSession();

  const displayPlans = [FREE_PLAN_OBJECT, ...plans];

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

  return (
    <div className="flex flex-col h-full w-full px-6 py-6 lg:py-8 items-center justify-center overflow-y-auto bg-[#F8F9FA] min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key="plans"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center w-full gap-4 lg:gap-6 max-w-4xl"
        >
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-12 h-9">
              <Image src="/svg/black_crown.svg" alt="Crown" fill className="object-contain" />
            </div>
            <h1 className="font-rozha text-2xl lg:text-3xl text-[#181D27] text-center leading-none">AristoAccess+</h1>
            <p className="font-work-sans text-xs lg:text-sm text-[#414651] text-center max-w-sm mt-1">
              Subscribe to unlock the ability to send proposals and transact with Service Providers.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {displayPlans.map((plan) => {
              const isFree = (plan as any).isFree;
              const isPremium = !isFree;
              const features = parseFeatures(plan.description);
              const displayFeatures = features.length > 0 ? features : DEFAULT_PREMIUM_FEATURES;

              return (
                <div
                  key={plan.id}
                  className={`w-full rounded-2xl p-5 lg:p-6 flex flex-col justify-between gap-4 transition-all duration-300 relative border ${
                    isPremium
                      ? "bg-[#181D27] text-white border-transparent shadow-xl"
                      : "bg-white text-[#181D27] border-gray-200 shadow-sm"
                  }`}
                >
                  {isPremium && (
                    <div className="absolute top-4 right-4 w-6 h-6">
                      <Image src="/svg/crown.svg" alt="Premium Plan" fill className="object-contain" />
                    </div>
                  )}

                  <div className="flex flex-col gap-0.5">
                    <p className={`font-work-sans text-[10px] font-semibold uppercase tracking-wider ${isPremium ? "text-gray-400" : "text-[#9CA3AF]"}`}>
                      {isPremium ? "PREMIUM" : "BASIC"}
                    </p>
                    <p className="font-rozha text-xl lg:text-2xl tracking-wide font-semibold mt-0.5 leading-none">{plan.name}</p>
                    <div className="flex items-baseline gap-0.5 mt-2">
                      <span className="font-work-sans text-sm font-semibold">$</span>
                      <span className="font-rozha text-3xl lg:text-4xl leading-none">{plan.amount}</span>
                      <span className={`font-work-sans text-xs ml-0.5 ${isPremium ? "text-gray-400" : "text-gray-500"}`}>
                        /{plan.interval === "MONTH" ? "month" : "year"}
                      </span>
                    </div>
                    <p className={`font-work-sans text-[10px] mt-1 ${isPremium ? "text-gray-400" : "text-gray-500"}`}>
                      No monthly commitment
                    </p>
                  </div>

                  <div className={`h-px ${isPremium ? "bg-white/10" : "bg-gray-100"}`} />

                  <ul className="flex flex-col gap-1.5 lg:gap-2 flex-1">
                    {displayFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2 font-work-sans text-xs lg:text-sm leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                        <span className={isPremium ? "text-gray-300" : "text-[#535862]"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={isPending}
                    onClick={() => {
                      if (isFree) {
                        router.push("/client/transact");
                      } else {
                        handleSubscribe(plan.id);
                      }
                    }}
                    className={`w-full h-10 lg:h-11 rounded-full font-work-sans font-semibold text-xs lg:text-sm transition-colors mt-2 disabled:opacity-60 cursor-pointer ${
                      isFree
                        ? "bg-gray-100 hover:bg-gray-200 text-[#181D27] border border-gray-300"
                        : "bg-[#00D05A] hover:bg-[#00b34d] text-white shadow-lg shadow-[#00D05A]/25"
                    }`}
                  >
                    {isPending && isPremium ? "Redirecting..." : isFree ? "CONTINUE WITH FREE" : "SUBSCRIBE NOW"}
                  </motion.button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.push("/client/transact")}
            className="font-work-sans text-xs text-[#9CA3AF] hover:text-[#535862] underline mt-2 cursor-pointer transition-colors"
          >
            Maybe later
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

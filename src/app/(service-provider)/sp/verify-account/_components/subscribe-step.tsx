"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";
import { useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";

const features = [
  "Verify your account",
  "Send proposals to Service Providers",
  "Unlock an exclusive badge to attract clients / service providers",
  "Access to the Aristocrat's Circle",
  "Send agreements to clients before transacting with them",
  "Save your most used contacts to your profile",
  "(NDA's, service contracts, etc.)",
];

export function SubscribeStep({ onNext }: { onNext: () => void }) {
  const { data: plans = [], isLoading } = useSubscriptionPlans();
  const { mutate: createCheckout, isPending } = useCreateCheckoutSession();

  const handleSubscribe = () => {
    const plan = plans[0];
    if (!plan) {
      // No plans in DB — proceed anyway
      onNext();
      return;
    }
    createCheckout(
      {
        planId: plan.id,
        successUrl: `${window.location.origin}/sp/verify-account`,
        cancelUrl: `${window.location.origin}/sp/verify-account`,
      },
      {
        onSuccess: (data) => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            // Already subscribed
            onNext();
          }
        },
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col items-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      {/* Plan info */}
      {!isLoading && plans.length > 0 && (
        <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
          <p className="font-work-sans font-semibold text-[#181D27]">{plans[0].name}</p>
          <p className="font-rozha text-xl text-[#181D27]">
            {plans[0].currency} {plans[0].amount}
            <span className="font-work-sans text-sm text-[#9CA3AF]">/{plans[0].interval === "MONTH" ? "mo" : "yr"}</span>
          </p>
        </div>
      )}

      <motion.ul initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        className="w-full space-y-3 mb-8">
        {features.map((f, i) => (
          <motion.li key={i}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
            className="flex items-start gap-3 font-work-sans text-sm text-[#414651]">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#414651] shrink-0" />
            {f}
          </motion.li>
        ))}
      </motion.ul>

      <Button onClick={handleSubscribe} disabled={isPending || isLoading}
        className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base disabled:opacity-60">
        {isPending ? "Redirecting to payment..." : "Subscribe"}
      </Button>
    </div>
  );
}

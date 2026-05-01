"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";
import { useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";
import { FreePlanCard } from "@/components/shared/free-plan-card";

const features = [
  "Verify your account",
  "Send proposals to Service Providers",
  "Unlock an exclusive badge to attract clients / service providers",
  "DocuSign contracts — 5 per month, $2 for each additional",
  "Send agreements to clients before transacting with them",
  "Save your most used contacts to your profile",
  "Dedicated Transaction Concierge — priority email support within 24 hours",
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
        successUrl: `${window.location.origin}/sp/verify-account?from=stripe`,
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
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      {/* Plans side by side */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Free Plan */}
        <FreePlanCard />

        {/* Premium Plan */}
        <div className="w-full bg-[#181D27] rounded-2xl p-6 flex flex-col gap-4">
          {!isLoading && plans.length > 0 && (
            <>
              <div>
                <p className="font-work-sans text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">{plans[0].name}</p>
                <div className="flex items-start gap-0.5">
                  <span className="font-work-sans text-lg font-semibold text-white mt-1">$</span>
                  <span className="font-rozha text-5xl text-white leading-none">{plans[0].amount}</span>
                </div>
                <p className="font-work-sans text-sm text-[#9CA3AF] mt-1">No monthly commitment</p>
              </div>
              <div className="h-px bg-white/10" />
              <ul className="flex flex-col gap-2 flex-1">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 font-work-sans text-sm text-[#D1D5DB]">
                    <span className="text-[#16A34A] mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={handleSubscribe} disabled={isPending || isLoading}
                className="w-full h-12 rounded-full bg-[#16A34A] hover:bg-[#16A34A]/90 font-work-sans font-semibold text-sm disabled:opacity-60 mt-2">
                {isPending ? "Redirecting..." : "GO PREMIUM"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

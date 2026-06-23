"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";
import { useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";
import { FreePlanCard } from "@/components/shared/free-plan-card";
import Image from "next/image";
import { Check } from "lucide-react";

function parseFeatures(description: string): string[] {
  if (!description) return [];
  return description
    .split(/✓|•|\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

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

  const premiumPlan = plans[0];
  const features = premiumPlan ? parseFeatures(premiumPlan.description) : [];

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      {/* Plans side by side with titles */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-2">
        {/* Left Column: Current Plan */}
        <div className="flex flex-col h-full">
          <h3 className="font-rozha text-base font-bold text-[#181D27] mb-2 self-start">Current Plan</h3>
          <div className="flex-1">
            <FreePlanCard compact />
          </div>
        </div>

        {/* Right Column: Subscribe to Premium */}
        <div className="flex flex-col h-full">
          <h3 className="font-rozha text-base font-bold text-[#181D27] mb-2 self-start">Subscribe to Premium</h3>
          <div className="flex-1 w-full bg-[#181D27] rounded-2xl p-4 lg:p-5 flex flex-col justify-between gap-3 text-white shadow-lg">
            {!isLoading && premiumPlan && (
              <div className="flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="font-work-sans text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                        {premiumPlan.name}
                      </p>
                      <div className="relative w-3.5 h-3.5 shrink-0">
                        <Image
                          src="/svg/crown.svg"
                          alt="Premium"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-work-sans text-base font-semibold text-white mt-0.5">$</span>
                      <span className="font-rozha text-4xl text-white leading-none">{premiumPlan.amount}</span>
                      <span className="font-work-sans text-xs text-gray-400 ml-0.5">
                        /{premiumPlan.interval === "MONTH" ? "month" : "year"}
                      </span>
                    </div>
                    <p className="font-work-sans text-xs text-[#9CA3AF] mt-0.5">No monthly commitment</p>
                  </div>

                  <div className="h-px bg-white/10" />

                  <ul className="flex flex-col gap-1.5">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 font-work-sans text-[13px] text-[#D1D5DB] leading-tight">
                        <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={handleSubscribe} 
                  disabled={isPending || isLoading}
                  className="w-full h-11 rounded-full bg-[#00D05A] hover:bg-[#00b34d] font-work-sans font-semibold text-sm text-white disabled:opacity-60 mt-1 shadow-lg shadow-[#00D05A]/25"
                >
                  {isPending ? "Redirecting..." : "Subscribe"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

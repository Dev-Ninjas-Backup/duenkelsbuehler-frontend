"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";
import Image from "next/image";
import { Check, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSubscribe = (planId: number) => {
    createCheckout(
      {
        planId,
        successUrl: `${window.location.origin}/client/verify-account?from=stripe`,
        cancelUrl: `${window.location.origin}/client/verify-account`,
      },
      {
        onSuccess: (data) => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            onNext();
          }
        },
      }
    );
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : plans.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < plans.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
      {/* Current Plan Summary Pill */}
      <div className="mb-2 w-full max-w-md bg-white border border-gray-200 shadow-xs rounded-2xl p-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#181D27] shrink-0 font-bold text-[10px]">
            FREE
          </div>
          <div className="flex flex-col">
            <span className="font-work-sans text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
              Current Plan
            </span>
            <span className="font-work-sans text-xs font-bold text-[#181D27]">
              Free Tier ($0/month)
            </span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider font-work-sans text-[#16A34A] bg-[#16A34A]/10 rounded-full shrink-0">
          Active
        </span>
      </div>

      {/* Plans Section */}
      {isLoading ? (
        <div className="w-full flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-[#181D27]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : plans.length === 0 ? (
        <div className="w-full max-w-md rounded-2xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center gap-2 bg-white">
          <p className="font-work-sans text-sm text-[#535862]">No subscription plans available at the moment.</p>
          <p className="font-work-sans text-xs text-[#9CA3AF]">Please check back later.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center relative">
          {/* Carousel Viewport Container */}
          <div className="w-full flex items-center justify-center relative h-[420px] sm:h-[445px] py-1 px-4 overflow-hidden">
            {/* Left Arrow Button */}
            {plans.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 lg:left-4 z-40 w-10 h-10 rounded-full bg-white border border-gray-200 text-[#181D27] flex items-center justify-center shadow-lg hover:bg-gray-50 hover:scale-110 transition-all cursor-pointer"
                aria-label="Previous Plan"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right Arrow Button - Fixed lg:right-4 */}
            {plans.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 lg:right-4 z-40 w-10 h-10 rounded-full bg-white border border-gray-200 text-[#181D27] flex items-center justify-center shadow-lg hover:bg-gray-50 hover:scale-110 transition-all cursor-pointer"
                aria-label="Next Plan"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* 3D Cards Container */}
            <div className="flex items-center justify-center w-full max-w-4xl h-[410px] sm:h-[435px] relative">
              {plans.map((plan, index) => {
                const features = parseFeatures(plan.description);
                const offset = index - activeIndex;
                const isActive = index === activeIndex;

                const isVisible = Math.abs(offset) <= 1 || (plans.length <= 3);

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={false}
                    animate={{
                      scale: isActive ? 1.02 : 0.88,
                      opacity: isActive ? 1 : 0.55,
                      x: offset * (typeof window !== "undefined" && window.innerWidth < 640 ? 210 : 280),
                      zIndex: isActive ? 30 : 10 - Math.abs(offset),
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    onClick={() => !isActive && setActiveIndex(index)}
                    className={`absolute w-[275px] sm:w-[315px] h-[380px] sm:h-[410px] rounded-2xl p-5 flex flex-col justify-between transition-shadow duration-300 border ${
                      isActive
                        ? "bg-[#181D27] text-white border-[#00D05A] shadow-2xl shadow-[#00D05A]/20"
                        : "bg-[#181D27]/90 text-white border-white/10 shadow-md cursor-pointer"
                    }`}
                  >
                    {/* Featured / Recommended Badge */}
                    {isActive && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#00D05A] text-white font-work-sans text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Recommended</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 flex-1 justify-between min-h-0">
                      <div className="flex flex-col gap-2.5 flex-1 min-h-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 shrink-0">
                          <div>
                            <p className="font-work-sans text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider truncate max-w-[190px]">
                              {plan.name}
                            </p>
                            <div className="flex items-baseline gap-0.5 mt-0.5">
                              <span className="font-work-sans text-sm font-semibold text-white">$</span>
                              <span className="font-rozha text-3xl lg:text-4xl text-white leading-none">
                                {plan.amount}
                              </span>
                              <span className="font-work-sans text-xs text-gray-400 ml-1">
                                /{plan.interval === "MONTH" ? "mo" : "yr"}
                              </span>
                            </div>
                            <p className="font-work-sans text-[10px] text-[#9CA3AF] mt-0.5">
                              No monthly commitment
                            </p>
                          </div>
                          <div className="w-5 h-5 shrink-0 relative mt-1">
                            <Image src="/svg/crown.svg" alt="Crown" fill className="object-contain" />
                          </div>
                        </div>

                        <div className="h-px bg-white/10 shrink-0" />

                        {/* Features with ample height & internal scroll */}
                        <ul
                          onWheel={(e) => e.stopPropagation()}
                          className="flex flex-col gap-1.5 flex-1 min-h-0 max-h-[185px] sm:max-h-[210px] overflow-y-auto pr-1 pointer-events-auto"
                        >
                          {features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 font-work-sans text-xs text-[#D1D5DB] leading-snug">
                              <Check className="w-3.5 h-3.5 text-[#00D05A] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Subscribe Button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribe(plan.id);
                        }}
                        disabled={isPending}
                        className={`w-full h-10 rounded-full font-work-sans font-semibold text-xs lg:text-sm transition-all duration-200 disabled:opacity-60 shrink-0 cursor-pointer ${
                          isActive
                            ? "bg-[#00D05A] hover:bg-[#00b34d] text-white shadow-lg shadow-[#00D05A]/30"
                            : "bg-[#181D27] text-white border border-white/20 hover:bg-[#181D27]/80"
                        }`}
                      >
                        {isPending ? "Redirecting..." : "Subscribe Now"}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Dots Pagination Indicator */}
          {plans.length > 1 && (
            <div className="flex items-center gap-2 mt-2">
              {plans.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex
                      ? "w-7 bg-[#00D05A]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

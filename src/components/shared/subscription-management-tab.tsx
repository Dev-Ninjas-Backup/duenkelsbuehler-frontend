"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMySubscriptions, useCancelSubscription, useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";
import { toast } from "sonner";
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

function ConfirmCancelModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm flex flex-col gap-5 shadow-xl">
        <div className="flex flex-col gap-2">
          <h3 className="font-rozha text-xl text-[#181D27]">Cancel Subscription?</h3>
          <p className="font-work-sans text-sm text-[#535862]">
            Your subscription will remain active until the end of the current billing period. After that, you will lose access to premium features.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-11 rounded-full border border-gray-200 font-work-sans text-sm font-semibold text-[#414651] hover:bg-gray-50 transition-colors">
            Keep Plan
          </button>
          <button onClick={onConfirm}
            className="flex-1 h-11 rounded-full bg-red-500 text-white font-work-sans text-sm font-semibold hover:bg-red-600 transition-colors">
            Yes, Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const statusColor: Record<string, string> = {
  ACTIVE: "text-[#16A34A] bg-[#16A34A]/10",
  TRIALING: "text-blue-600 bg-blue-50",
  PAST_DUE: "text-orange-500 bg-orange-50",
  CANCELED: "text-red-500 bg-red-50",
  PENDING: "text-[#414651] bg-gray-100",
};

export function SubscriptionManagementTab() {
  const { data: subscriptions = [], isLoading } = useMySubscriptions();
  const { data: plans = [] } = useSubscriptionPlans();
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription();
  const { mutate: createCheckout, isPending: isCheckingOut } = useCreateCheckoutSession();
  const [cancelId, setCancelId] = useState<number | null>(null);

  const activeSub = subscriptions.find((s) => s.status === "ACTIVE" || s.status === "TRIALING");
  const availablePlans = plans.filter((p) => p.isActive && p.id !== activeSub?.plan.id);

  const handleCancel = () => {
    if (!cancelId) return;
    cancelSubscription(cancelId, {
      onSuccess: () => {
        toast.success("Subscription cancelled. Access continues until end of billing period.");
        setCancelId(null);
      },
      onError: () => {
        toast.error("Failed to cancel subscription. Please try again.");
        setCancelId(null);
      },
    });
  };

  const handleUpgrade = (planId: number) => {
    createCheckout(
      {
        planId,
        successUrl: `${window.location.origin}/client/settings`,
        cancelUrl: window.location.href,
      },
      {
        onSuccess: (data) => {
          window.location.href = data.checkoutUrl;
        },
        onError: () => toast.error("Failed to start checkout. Please try again."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-4 max-w-lg mx-auto w-full">
        <div className="h-32 bg-gray-100 rounded-2xl" />
        <div className="h-20 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  const hasUpgrades = availablePlans.length > 0;

  return (
    <motion.div
      key="subscription"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className={`mx-auto w-full gap-8 ${
        hasUpgrades
          ? "max-w-4xl grid grid-cols-1 md:grid-cols-2 items-stretch"
          : "max-w-lg flex flex-col gap-6"
      }`}
    >
      {/* Current Plan */}
      <div className="flex flex-col gap-3 h-full">
        <h3 className="font-rozha text-xl text-[#181D27]">Current Plan</h3>

        {activeSub ? (
          (() => {
            const isPremium = activeSub.plan.name.toLowerCase().includes("access") || activeSub.plan.amount > 0;
            return (
              <div
                className={`flex-1 rounded-3xl p-6 flex flex-col justify-between gap-4 shadow-sm border transition-all duration-300 relative ${
                  isPremium
                    ? "bg-[#181D27] text-white border-transparent shadow-lg"
                    : "bg-white text-[#181D27] border-gray-100"
                }`}
              >
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-rozha text-xl tracking-wide font-semibold">
                          {activeSub.plan.name}
                        </p>
                        {isPremium && (
                          <div className="relative w-5 h-5 shrink-0">
                            <Image
                              src="/svg/crown.svg"
                              alt="Premium Plan"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-0.5 mt-1">
                        <span className="font-work-sans text-lg font-semibold">$</span>
                        <span className="font-rozha text-5xl leading-none">{activeSub.plan.amount}</span>
                        <span className={`font-work-sans text-sm ml-0.5 ${isPremium ? "text-gray-400" : "text-gray-400"}`}>
                          /{activeSub.plan.interval === "MONTH" ? "month" : "year"}
                        </span>
                      </div>
                      
                      {activeSub.currentPeriodEnd && (
                        <p className={`font-work-sans text-xs mt-1.5 ${isPremium ? "text-gray-400" : "text-slate-400"}`}>
                          {activeSub.status === "CANCELED"
                            ? `Access until: ${new Date(activeSub.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                            : `Renews: ${new Date(activeSub.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                          }
                        </p>
                      )}
                    </div>
                    
                    <span
                      className={`font-work-sans text-xs font-semibold px-3 py-1 rounded-full ${
                        isPremium
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : statusColor[activeSub.status] ?? "text-[#414651] bg-gray-100"
                      }`}
                    >
                      {activeSub.status}
                    </span>
                  </div>

                  <div className={`h-px ${isPremium ? "bg-white/10" : "bg-gray-100"}`} />

                  {/* Premium features reminder */}
                  <div className="flex flex-col gap-2">
                    <p className="font-work-sans text-xs font-bold">Your premium benefits:</p>
                    <ul className="flex flex-col gap-2">
                      {[
                        "Identity verification (Veriff)",
                        "Send & receive proposals",
                        "DocuSign contracts (5/month)",
                        "Dedicated Transaction Concierge — priority email support within 24 hours (Concierge@AristoPay.co)",
                      ].map((f) => (
                        <li key={f} className="font-work-sans text-xs flex items-start gap-1.5">
                          <span className="text-[#16A34A] shrink-0 mt-0.5">✓</span>
                          <span className={isPremium ? "text-gray-300" : "text-[#535862]"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {activeSub.status !== "CANCELED" && (
                  <button
                    onClick={() => setCancelId(activeSub.id)}
                    disabled={isCanceling}
                    className={`w-full h-11 rounded-full border font-work-sans text-sm font-semibold transition-colors mt-2 ${
                      isPremium
                        ? "border-white/20 hover:border-red-400 hover:text-red-400 text-gray-400"
                        : "border-red-200 text-red-500 hover:bg-red-50"
                    }`}
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            );
          })()
        ) : (
          <FreePlanCard />
        )}
      </div>

      {/* Upgrade Options */}
      {availablePlans.length > 0 && (
        <div className="flex flex-col gap-3 h-full">
          <h3 className="font-rozha text-xl text-[#181D27]">
            {activeSub ? "Upgrade Plan" : "Subscribe to Premium"}
          </h3>
          <div className="flex flex-col gap-6 flex-1">
            {availablePlans.map((plan) => {
              const isPremium = plan.name.toLowerCase().includes("access") || plan.amount > 0;
              const features = parseFeatures(plan.description);

              return (
                <div
                  key={plan.id}
                  className={`flex-1 rounded-3xl p-6 flex flex-col justify-between gap-4 shadow-sm border transition-all duration-300 relative ${
                    isPremium
                      ? "bg-[#181D27] text-white border-transparent shadow-lg"
                      : "bg-white text-[#181D27] border-gray-100"
                  }`}
                >
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-rozha text-xl tracking-wide font-semibold">{plan.name}</p>
                          {isPremium && (
                            <div className="relative w-5 h-5 shrink-0">
                              <Image
                                src="/svg/crown.svg"
                                alt="Premium Plan"
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-baseline gap-0.5 mt-1">
                          <span className="font-work-sans text-lg font-semibold">$</span>
                          <span className="font-rozha text-5xl leading-none">{plan.amount}</span>
                          <span className={`font-work-sans text-sm ml-0.5 ${isPremium ? "text-gray-400" : "text-gray-400"}`}>
                            /{plan.interval === "MONTH" ? "month" : "year"}
                          </span>
                        </div>
                        <p className={`font-work-sans text-xs mt-1.5 ${isPremium ? "text-gray-400" : "text-gray-400"}`}>
                          No monthly commitment
                        </p>
                      </div>
                    </div>

                    <div className={`h-px ${isPremium ? "bg-white/10" : "bg-gray-100"}`} />

                    <ul className="flex flex-col gap-2 flex-1">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 font-work-sans text-sm">
                          <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span className={isPremium ? "text-gray-300" : "text-[#535862]"}>{f}</span>
                        </li>
                      ))}
                      {features.length === 0 && plan.description && (
                        <li className="font-work-sans text-sm text-gray-400">{plan.description}</li>
                      )}
                    </ul>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCheckingOut}
                    className={`w-full h-12 rounded-full font-work-sans font-semibold text-sm transition-colors mt-2 ${
                      isPremium
                        ? "bg-[#00D05A] hover:bg-[#00b34d] text-white shadow-lg shadow-[#00D05A]/25"
                        : "bg-[#181D27] hover:bg-[#181D27]/90 text-white"
                    }`}
                  >
                    {isCheckingOut ? "..." : activeSub ? "UPGRADE" : "Subscribe"}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancel Confirm Modal */}
      <AnimatePresence>
        {cancelId && (
          <ConfirmCancelModal
            onConfirm={handleCancel}
            onClose={() => setCancelId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

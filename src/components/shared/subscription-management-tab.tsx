"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMySubscriptions, useCancelSubscription, useSubscriptionPlans, useCreateCheckoutSession } from "@/hooks/subscription/use-subscription";
import { toast } from "sonner";

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

  return (
    <motion.div key="subscription" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
      className="max-w-lg mx-auto w-full flex flex-col gap-6">

      {/* Current Plan */}
      <div className="bg-[#F9F9F9] rounded-2xl p-6 flex flex-col gap-4">
        <h3 className="font-rozha text-xl text-[#181D27]">Current Plan</h3>

        {activeSub ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-work-sans text-base font-bold text-[#181D27]">{activeSub.plan.name}</p>
                <p className="font-work-sans text-sm text-[#535862]">
                  {activeSub.plan.currency} {activeSub.plan.amount}/{activeSub.plan.interval === "MONTH" ? "month" : "year"}
                </p>
              </div>
              <span className={`font-work-sans text-xs font-semibold px-3 py-1 rounded-full ${statusColor[activeSub.status] ?? "text-[#414651] bg-gray-100"}`}>
                {activeSub.status}
              </span>
            </div>

            {activeSub.currentPeriodEnd && (
              <p className="font-work-sans text-xs text-[#9CA3AF]">
                {activeSub.status === "CANCELED"
                  ? `Access until: ${new Date(activeSub.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                  : `Renews: ${new Date(activeSub.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                }
              </p>
            )}

            {/* Premium features reminder */}
            <div className="bg-white rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
              <p className="font-work-sans text-xs font-bold text-[#181D27]">Your premium benefits:</p>
              <ul className="flex flex-col gap-1">
                {[
                  "Identity verification (Veriff)",
                  "Send & receive proposals",
                  "DocuSign contracts (5/month)",
                  "Dedicated Transaction Concierge — priority email support within 24 hours (Concierge@AristoPay.co)",
                ].map((f) => (
                  <li key={f} className="font-work-sans text-xs text-[#535862] flex items-start gap-1.5">
                    <span className="text-[#16A34A] mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {activeSub.status !== "CANCELED" && (
              <button
                onClick={() => setCancelId(activeSub.id)}
                disabled={isCanceling}
                className="w-full h-11 rounded-full border-2 border-red-200 text-red-500 font-work-sans text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40 mt-1"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-work-sans text-sm text-[#535862]">You are currently on the <span className="font-semibold text-[#181D27]">Free</span> plan.</p>
            <ul className="flex flex-col gap-1">
              {[
                "Messaging — free for all users",
                "Browse & post services",
                "Send proposals (SP only)",
              ].map((f) => (
                <li key={f} className="font-work-sans text-xs text-[#535862] flex items-start gap-1.5">
                  <span className="text-[#16A34A] mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Upgrade Options */}
      {availablePlans.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-rozha text-xl text-[#181D27]">
            {activeSub ? "Upgrade Plan" : "Subscribe to Premium"}
          </h3>
          {availablePlans.map((plan) => (
            <div key={plan.id} className="bg-[#F9F9F9] rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-work-sans text-base font-bold text-[#181D27]">{plan.name}</p>
                <p className="font-work-sans text-sm text-[#535862]">
                  {plan.currency} {plan.amount}/{plan.interval === "MONTH" ? "month" : "year"}
                </p>
                {plan.description && (
                  <p className="font-work-sans text-xs text-[#9CA3AF] mt-0.5">{plan.description}</p>
                )}
              </div>
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCheckingOut}
                className="shrink-0 px-5 h-10 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40">
                {isCheckingOut ? "..." : activeSub ? "Upgrade" : "Subscribe"}
              </motion.button>
            </div>
          ))}
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

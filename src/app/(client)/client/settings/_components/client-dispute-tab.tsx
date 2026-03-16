"use client";

import { motion } from "framer-motion";

export function ClientDisputeTab() {
  return (
    <motion.div
      key="dispute"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-6 py-4"
    >
      <h2 className="font-rozha text-2xl text-[#181D27]">Dispute Resolution</h2>

      <p className="font-work-sans text-sm text-[#414651] text-center max-w-sm leading-relaxed">
        For payment processing issues, please contact Stripe directly. If dissatisfied with
        a Service Provider or Client, leave a rating. To ensure the security of your funds, use a
        manual payout plan powered by Stripe.
      </p>

      <span className="font-work-sans text-sm text-[#414651]">Contact:</span>
    </motion.div>
  );
}

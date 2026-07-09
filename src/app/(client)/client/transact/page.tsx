"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchStep } from "./_components/search-step";
import { SelectServicesStep } from "./_components/select-services-step";
import { ProposalDetailsStep } from "./_components/proposal-details-step";
import { FinalRemarksStep } from "./_components/final-remarks-step";
import { ReadyStep } from "./_components/ready-step";
import { TrackStep } from "./_components/track-step";
import { useMySubscriptions } from "@/hooks/subscription/use-subscription";
import { useTransactStore } from "@/stores/transact/use-transact-store";

function CrownSVG() {
  return <Image src="/svg/black_crown.svg" alt="Crown" width={56} height={40} className="object-contain" />;
}

function TransactContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { data: subscriptions = [], isLoading: isSubLoading } = useMySubscriptions();
  const hasActiveSubscription = subscriptions.some((s) => s.status === "ACTIVE" || s.status === "TRIALING");
  const subscribed = hasActiveSubscription || searchParams.get("subscribed") === "true";

  const { step, setStep, data } = useTransactStore();

  const btnDark = "w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors";
  const btnGreen = "w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold transition-colors hover:text-[#16A34A]";

  if (isSubLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#181D27]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // ── Unsubscribed landing ──
  if (!subscribed && step === null) {
    return (
      <div className="flex flex-col h-full px-6 py-10 items-center justify-center gap-6">
        <motion.h1
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center"
        >
          Let&apos;s Get to Business
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center gap-1"
        >
          <CrownSVG />
          <p className="font-work-sans text-sm font-semibold text-[#181D27]">AristoAccess+</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center gap-3 w-full max-w-sm"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/client/transact/subscribe")}
            className="w-full h-12 rounded-full bg-[#F59E0B] text-white font-work-sans text-sm font-semibold hover:bg-[#D97706] transition-colors"
          >
            Send a Proposal
          </motion.button>
          <p className="font-work-sans text-xs text-[#9CA3AF]">Subscribe &amp; show them you mean business.</p>

          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/client/review-proposals")} className={btnDark}>
            Review Proposals
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("track")} className={btnDark}>
            Track
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Subscribed landing ──
  if (subscribed && step === null) {
    return (
      <div className="flex flex-col h-full px-6 py-10 items-center justify-center gap-6">
        <motion.h1
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center"
        >
          Let&apos;s Get to Business
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center gap-1"
        >
          <CrownSVG />
          <p className="font-work-sans text-sm font-semibold text-[#181D27]">AristoAccess+</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center gap-3 w-full max-w-sm"
        >
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("search")} className={btnGreen}>
            Send a Proposal
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/client/review-proposals")} className={btnGreen}>
            Review Proposals
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("track")} className={btnGreen}>
            Track
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Steps ──
  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8 overflow-y-auto">
      <AnimatePresence mode="wait">
        {step === "track" && (
          <TrackStep key="track" />
        )}
        {step === "search" && (
          <SearchStep key="search" />
        )}
        {step === "select-services" && data.sp && (
          <SelectServicesStep key="select-services" />
        )}
        {step === "proposal-details" && (
          <ProposalDetailsStep key="proposal-details" />
        )}
        {step === "final-remarks" && (
          <FinalRemarksStep key="final-remarks" />
        )}
        {step === "ready" && data.sp && (
          <ReadyStep key="ready" />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ClientTransactPage() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <TransactContentWithKey />
    </Suspense>
  );
}

function TransactContentWithKey() {
  const searchParams = useSearchParams();
  const t = searchParams.get("t") ?? "0";
  return <TransactContent key={t} />;
}

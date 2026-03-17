"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchStep } from "./_components/search-step";
import { ContractStep } from "./_components/contract-step";
import { ConfirmStep } from "./_components/confirm-step";
import { ProposalDetailsStep } from "./_components/proposal-details-step";
import { FinalRemarksStep } from "./_components/final-remarks-step";
import { ReadyStep } from "./_components/ready-step";
import { TrackStep } from "./_components/track-step";
import { SP, SubStep, ProposalData } from "./_components/types";

function CrownSVG() {
  return <Image src="/svg/black_crown.svg" alt="Crown" width={56} height={40} className="object-contain" />;
}

const EMPTY_DATA: ProposalData = {
  sp: null, contractFile: null, docuSign: false,
  title: "", issueDate: "", dueDate: "", price: "",
  notes: "", terms: "", confirmSP: false, confirmUnverified: false,
};

function TransactContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscribed] = useState(() => searchParams.get("subscribed") === "true");
  const [step, setStep] = useState<SubStep | null>(null);
  const [data, setData] = useState<ProposalData>(EMPTY_DATA);

  const btnDark = "w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors";
  const btnGreen = "w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold transition-colors hover:text-[#16A34A]";

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
          <TrackStep key="track" onBack={() => setStep(null)} />
        )}
        {step === "search" && (
          <SearchStep
            key="search"
            onSelect={(sp: SP) => { setData((d) => ({ ...d, sp })); setStep("contract"); }}
          />
        )}
        {step === "contract" && data.sp && (
          <ContractStep
            key="contract"
            sp={data.sp}
            onNext={(file) => { setData((d) => ({ ...d, contractFile: file })); setStep("confirm"); }}
            onSkip={() => { setData((d) => ({ ...d, contractFile: null })); setStep("confirm"); }}
          />
        )}
        {step === "confirm" && data.sp && (
          <ConfirmStep
            key="confirm"
            sp={data.sp}
            contractFile={data.contractFile}
            onNext={(docuSign) => { setData((d) => ({ ...d, docuSign })); setStep("proposal-details"); }}
            onRemoveFile={() => setData((d) => ({ ...d, contractFile: null }))}
          />
        )}
        {step === "proposal-details" && (
          <ProposalDetailsStep
            key="proposal-details"
            onNext={(pd) => { setData((d) => ({ ...d, ...pd })); setStep("final-remarks"); }}
          />
        )}
        {step === "final-remarks" && (
          <FinalRemarksStep
            key="final-remarks"
            onNext={(rd) => { setData((d) => ({ ...d, ...rd })); setStep("ready"); }}
            onSkip={() => setStep("ready")}
          />
        )}
        {step === "ready" && data.sp && (
          <ReadyStep
            key="ready"
            sp={data.sp}
            onDone={() => { setData(EMPTY_DATA); setStep(null); }}
          />
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

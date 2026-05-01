"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SubscribeStep } from "./_components/subscribe-step";
import { WelcomeStep }   from "./_components/welcome-step";
import { UploadStep }    from "./_components/upload-step";
import { SuccessModal }  from "./_components/success-modal";
import { useMySubscriptions } from "@/hooks/subscription/use-subscription";
import { useGetMe } from "@/hooks/auth/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

type Step = "subscribe" | "welcome" | "upload" | "success";

const STEPS: Step[] = ["subscribe", "welcome", "upload", "success"];

const slideVariants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  40 : -40 }),
  center:              () => ({ opacity: 1, x: 0 }),
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 :  40 }),
};

function VerifyAccountContent() {
  const [step, setStep]           = useState<Step>("subscribe");
  const [direction, setDirection] = useState(1);
  const [ready, setReady]         = useState(false);
  const [retrying, setRetrying]   = useState(false);
  const retryCount                = useRef(0);
  const router  = useRouter();
  const params  = useSearchParams();
  const qc      = useQueryClient();

  const fromStripe = params.get("from") === "stripe";

  const { data: subscriptions = [], isLoading: subsLoading } = useMySubscriptions();
  const { data: me, isLoading: meLoading } = useGetMe();

  // Stripe থেকে ফিরলে max 6 বার retry করব (3 সেকেন্ড পর পর)
  useEffect(() => {
    if (!fromStripe) return;
    if (subsLoading || meLoading) return;

    const activeSub = subscriptions.find(
      (s) => s.status === "ACTIVE" || s.status === "TRIALING"
    );

    if (activeSub || me?.isIdentityVerified) return;

    if (retryCount.current < 6) {
      setRetrying(true);
      const timer = setTimeout(() => {
        retryCount.current += 1;
        qc.invalidateQueries({ queryKey: ["my-subscriptions"] });
        qc.invalidateQueries({ queryKey: ["auth", "me"] });
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setRetrying(false);
    }
  }, [fromStripe, subscriptions, me, subsLoading, meLoading, qc]);

  useEffect(() => {
    if (subsLoading || meLoading) return;

    const activeSub = subscriptions.find(
      (s) => s.status === "ACTIVE" || s.status === "TRIALING"
    );

    if (me?.isIdentityVerified) {
      setStep("success");
    } else if (activeSub) {
      setStep("upload");
    } else if (!fromStripe || retryCount.current >= 6) {
      // TODO: change "upload" back to "subscribe" when webhook is fixed
      setStep("upload");
    }

    if (!retrying) setReady(true);
  }, [subsLoading, meLoading, subscriptions, me, fromStripe, retrying]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (next: Step) => {
    setDirection(STEPS.indexOf(next) > STEPS.indexOf(step) ? 1 : -1);
    setStep(next);
  };

  const goNext = () => goTo(STEPS[STEPS.indexOf(step) + 1]);
  const goBack = () => goTo(STEPS[STEPS.indexOf(step) - 1]);

  const showBack = step !== "subscribe" && step !== "success" && step !== "upload";

  if (!ready || retrying) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#181D27] border-t-transparent animate-spin" />
        {retrying && (
          <p className="font-work-sans text-sm text-[#9CA3AF]">
            Confirming your subscription...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-2"
      >
        Verify Account
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-sm text-[#414651] text-center mb-8"
      >
        For verifying your identity you will have to subscribe to AristoAccess +
      </motion.p>

      <AnimatePresence>
        {showBack && (
          <motion.button
            key="back"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={goBack}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mb-6 self-start"
          >
            <ChevronLeft size={16} /> Back
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 overflow-y-auto pb-6"
        >
          {step === "subscribe" && <SubscribeStep onNext={goNext} />}
          {step === "welcome"   && <WelcomeStep   onNext={goNext} />}
          {step === "upload"    && <UploadStep    onNext={goNext} />}
        </motion.div>
      </AnimatePresence>

      <SuccessModal
        isOpen={step === "success"}
        onDone={() => router.push("/sp/transact")}
      />
    </div>
  );
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#181D27] border-t-transparent animate-spin" />
      </div>
    }>
      <VerifyAccountContent />
    </Suspense>
  );
}

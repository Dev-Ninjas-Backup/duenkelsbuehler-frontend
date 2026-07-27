"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, AlertCircle, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { LandingStep }   from "./_components/landing-step";
import { SubscribeStep } from "./_components/subscribe-step";
import { UploadStep }    from "./_components/upload-step";
import { SuccessModal }  from "./_components/success-modal";
import { CrownSVG }      from "./_components/shared";
import { useMySubscriptions } from "@/hooks/subscription/use-subscription";
import { useGetMe } from "@/hooks/auth/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

type Step = "landing" | "subscribe" | "upload" | "success" | "submitted" | "declined" | "resubmit";

const STEPS: Step[] = ["landing", "subscribe", "upload", "success", "submitted", "declined", "resubmit"];

const slideVariants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  40 : -40 }),
  center:              () => ({ opacity: 1, x: 0 }),
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 :  40 }),
};

function VerifyAccountContent() {
  const [step, setStep]           = useState<Step>("landing");
  const [direction, setDirection] = useState(1);
  const [retryOverride, setRetryOverride] = useState(false);
  const [ready, setReady]         = useState(false);
  const [retrying, setRetrying]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalShownRef             = useRef(false);
  const retryCount                = useRef(0);
  const router  = useRouter();
  const params  = useSearchParams();
  const qc      = useQueryClient();

  const fromStripe = params.get("from") === "stripe";

  const { data: subscriptions = [], isLoading: subsLoading } = useMySubscriptions();
  const { data: me, isLoading: meLoading } = useGetMe();

  // Show celebratory modal once if returning from Stripe checkout
  useEffect(() => {
    if ((me?.isIdentityVerified || me?.verifIdentityVerificationStatus === "APPROVED") && fromStripe && !modalShownRef.current) {
      setShowModal(true);
      modalShownRef.current = true;
    }
  }, [me, fromStripe]);

  // Stripe থেকে ফিরলে max 6 বার retry করব (3 সেকেন্ড পর পর)
  useEffect(() => {
    if (!fromStripe) return;
    if (subsLoading || meLoading) return;

    const activeSub = subscriptions.find(
      (s) => s.status === "ACTIVE" || s.status === "TRIALING"
    );

    if (activeSub || me?.isIdentityVerified) {
      setRetrying(false);
      return;
    }

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

    const status = me?.verifIdentityVerificationStatus;

    if (me?.isIdentityVerified || status === "APPROVED") {
      setStep("success");
    } else if (!retryOverride && (status === "SUBMITTED" || status === "REVIEW")) {
      setStep("submitted");
    } else if (!retryOverride && (status === "DECLINED" || status === "EXPIRED" || status === "ABANDONED")) {
      setStep("declined");
    } else if (!retryOverride && status === "RESUBMISSION_REQUESTED") {
      setStep("resubmit");
    } else if (activeSub) {
      setStep("upload");
    } else {
      // If there is no active subscription, we default to "landing"
      // but we shouldn't force them back to "landing" if they are currently in the middle of "subscribe" (plans selection)
      setStep((prev) => {
        if (
          prev === "upload" ||
          prev === "success" ||
          prev === "submitted" ||
          prev === "declined" ||
          prev === "resubmit"
        ) {
          return "landing";
        }
        return prev;
      });
    }

    if (!retrying) setReady(true);
  }, [subsLoading, meLoading, subscriptions, me, fromStripe, retrying, retryOverride]);

  const goTo = (next: Step) => {
    setDirection(STEPS.indexOf(next) > STEPS.indexOf(step) ? 1 : -1);
    setStep(next);
  };

  const goNext = () => goTo(STEPS[STEPS.indexOf(step) + 1]);
  const goBack = () => goTo(STEPS[STEPS.indexOf(step) - 1]);

  const showBack = step !== "landing" && step !== "success" && step !== "upload" && step !== "submitted" && step !== "declined" && step !== "resubmit";

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
    <div className="flex flex-col h-full px-2 py-2 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-3xl lg:text-4xl text-[#181D27] text-center mb-1 mt-8"
      >
        Verify Account
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-sm text-[#414651] text-center mb-4"
      >
        {step === "success"
          ? "Your account identity is verified with AristoAccess+"
          : "For verifying your identity you will have to subscribe to AristoAccess +"}
      </motion.p>

      <AnimatePresence>
        {showBack && (
          <motion.button
            key="back"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={goBack}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mb-3 self-start"
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
          {step === "landing"   && <LandingStep   onNext={goNext} />}
          {step === "subscribe" && <SubscribeStep onNext={goNext} />}
          {step === "upload"    && <UploadStep    onNext={goNext} />}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center mt-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle2 size={36} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-700 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Identity Verified
              </div>

              <CrownSVG className="w-16 h-12 mb-2" />
              <h2 className="font-rozha text-2xl lg:text-3xl text-[#181D27] mb-2">
                AristoAccess<span className="text-[#16A34A]">+</span> Active
              </h2>

              <p className="font-work-sans text-sm text-[#414651] leading-relaxed mb-6">
                Your identity has been verified. The seal is yours to bear—your account has full access to all premium platform features.
              </p>

              <div className="mb-6">
                <Image src="/images/seal.png" alt="Seal" width={120} height={134} className="object-contain" />
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <button
                  onClick={() => router.push("/sp/transact")}
                  className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
                >
                  Start Transacting
                </button>
                <button
                  onClick={() => router.push("/sp/settings")}
                  className="w-full h-10 rounded-full bg-gray-50 border border-gray-200 text-[#414651] font-work-sans text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Profile & Settings
                </button>
              </div>
            </motion.div>
          )}
          {step === "submitted" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center mt-6"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-6 animate-pulse">
                <Clock size={32} />
              </div>
              <h2 className="font-rozha text-2xl text-[#181D27] mb-3">Verification Under Review</h2>
              <p className="font-work-sans text-sm text-[#414651] leading-relaxed mb-8">
                Thank you! We have received your identity verification documents. Veriff is currently reviewing your submission. This usually takes a few minutes, but can take up to 24 hours. We will notify you once done.
              </p>
              <button
                onClick={() => router.push("/sp/settings")}
                className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
          {step === "declined" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center mt-6"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="font-rozha text-2xl text-[#181D27] mb-3">Verification Failed</h2>
              <p className="font-work-sans text-sm text-[#414651] leading-relaxed mb-8">
                Your identity verification session was declined, expired, or abandoned. Please ensure your documents are valid and clearly visible, then try again.
              </p>
              <button
                onClick={() => setRetryOverride(true)}
                className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} /> Try Again
              </button>
            </motion.div>
          )}
          {step === "resubmit" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center mt-6"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="font-rozha text-2xl text-[#181D27] mb-3">Resubmission Requested</h2>
              <p className="font-work-sans text-sm text-[#414651] leading-relaxed mb-8">
                The verification service has requested a resubmission of your documents. This could be due to glare, blur, or incomplete information on your ID.
              </p>
              <button
                onClick={() => setRetryOverride(true)}
                className="w-full h-12 rounded-full bg-[#181D27] text-[#FFFFFF] font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} /> Resubmit Documents
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <SuccessModal
        isOpen={showModal}
        onDone={() => setShowModal(false)}
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

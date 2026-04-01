"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubscribeStep } from "./_components/subscribe-step";
import { PaymentStep }   from "./_components/payment-step";
import { WelcomeStep }   from "./_components/welcome-step";
import { UploadStep }    from "./_components/upload-step";
import { SuccessModal }  from "./_components/success-modal";

type Step = "subscribe" | "payment" | "welcome" | "upload" | "success";

const STEPS: Step[] = ["subscribe", "payment", "welcome", "upload", "success"];

const slideVariants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  40 : -40 }),
  center:              () => ({ opacity: 1, x: 0 }),
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 :  40 }),
};

export default function VerifyAccountPage() {
  const [step, setStep]           = useState<Step>("subscribe");
  const [direction, setDirection] = useState(1);
  const router = useRouter();

  const goTo = (next: Step) => {
    setDirection(STEPS.indexOf(next) > STEPS.indexOf(step) ? 1 : -1);
    setStep(next);
  };

  const goNext = () => goTo(STEPS[STEPS.indexOf(step) + 1]);
  const goBack = () => goTo(STEPS[STEPS.indexOf(step) - 1]);

  const showBack = step !== "subscribe" && step !== "success";

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
        >
          {step === "subscribe" && <SubscribeStep onNext={goNext} />}
          {step === "payment"   && <PaymentStep   onNext={goNext} />}
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

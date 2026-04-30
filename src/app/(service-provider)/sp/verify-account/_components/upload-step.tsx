"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";
import { useCreateVerifSession } from "@/hooks/verif/use-verif";
import { useMySubscriptions } from "@/hooks/subscription/use-subscription";

export function UploadStep({ onNext }: { onNext: () => void }) {
  const { mutate: createSession, isPending, error } = useCreateVerifSession();
  const { data: subscriptions = [] } = useMySubscriptions();

  const activeSub = subscriptions.find(
    (s) => s.status === "ACTIVE" || s.status === "TRIALING"
  );

  const handleStart = () => {
    createSession(undefined, {
      onSuccess: (data) => {
        // Redirect to Veriff verification URL
        window.location.href = data.sessionUrl;
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col items-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-[#F9F9F9] rounded-2xl p-6 flex flex-col gap-4 mb-6 text-center"
      >
        <p className="font-work-sans text-sm text-[#414651]">
          You will be redirected to our identity verification partner{" "}
          <span className="font-semibold text-[#181D27]">Veriff</span> to
          complete your KYC verification.
        </p>
        <ul className="flex flex-col gap-2 text-left">
          {[
            "Have your government-issued ID ready",
            "Make sure you are in a well-lit area",
            "The process takes approximately 2-3 minutes",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-work-sans text-sm text-[#414651]"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {!activeSub && (
          <p className="font-work-sans text-xs text-red-500 mt-2">
            ⚠️ You need an active premium subscription to verify your identity.
          </p>
        )}
      </motion.div>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
          <p className="font-work-sans text-sm text-red-600">
            {(error as Error).message}
          </p>
        </div>
      )}

      <Button
        onClick={handleStart}
        disabled={isPending || !activeSub}
        className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base disabled:opacity-60"
      >
        {isPending ? "Starting verification..." : "Start Verification"}
      </Button>

      <button
        onClick={onNext}
        className="mt-4 font-work-sans text-sm text-[#9CA3AF] underline underline-offset-2"
      >
        I have already verified — skip
      </button>
    </div>
  );
}

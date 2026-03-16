"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Step = "subscribe" | "upload" | "success";

const features = [
  "Verify your account",
  "Send proposals to Service Providers",
  "Unlock an exclusive badge to attract clients / service providers",
  "Access to the Aristocrat's Circle",
  "Send agreements to clients before transacting with them",
  "Save your most used contacts to your profile",
  "(NDA's, service contracts, etc.)",
];

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function CrownSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={className} fill="none">
      <path d="M40 8 L10 32 L18 48 H62 L70 32 Z" fill="#181D27" stroke="#181D27" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="6" r="5" fill="#181D27" />
      <circle cx="8" cy="32" r="5" fill="#181D27" />
      <circle cx="72" cy="32" r="5" fill="#181D27" />
      <rect x="14" y="48" width="52" height="7" rx="3.5" fill="#181D27" />
    </svg>
  );
}

function BrandLabel() {
  return (
    <p className="font-work-sans font-bold text-lg text-[#181D27] mt-2 mb-6">
      AristoAccess<span className="text-[#16A34A]">+</span>
    </p>
  );
}

export default function VerifyAccountPage() {
  const [step, setStep] = useState<Step>("subscribe");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-4"
      >
        Verify Account
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-sm text-[#414651] text-center mb-10"
      >
        For verifying your identity you will have to subscribe to AristoAccess +
      </motion.p>

      <AnimatePresence mode="wait">

        {/* ── Step 1: Subscribe ── */}
        {step === "subscribe" && (
          <motion.div
            key="subscribe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="max-w-lg mx-auto w-full flex flex-col items-center"
          >
            <CrownSVG className="w-20 h-14" />
            <BrandLabel />

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
              className="w-full space-y-3 mb-8"
            >
              {features.map((feature, i) => (
                <motion.li key={i} variants={itemVariants} className="flex items-start gap-3 font-work-sans text-sm text-[#414651]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#414651] shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            <Button
              onClick={() => setStep("upload")}
              className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
            >
              Subscribe
            </Button>
          </motion.div>
        )}

        {/* ── Step 2: Upload ID ── */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="max-w-lg mx-auto w-full flex flex-col items-center"
          >
            <CrownSVG className="w-20 h-14" />
            <BrandLabel />

            <p className="font-work-sans text-sm text-[#414651] text-center mb-6">
              Place your ID within the borders. Then press the green button to capture the image. You will recieve notification of sucess.
            </p>

            {/* ID Preview / Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors mb-6 aspect-[1.6/1] flex items-center justify-center"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="ID preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-work-sans text-sm">Tap to upload your ID</span>
                </div>
              )}
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              onClick={() => setStep("success")}
              className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
            >
              Upload
            </Button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Step 3: Success Modal ── */}
      <AnimatePresence>
        {step === "success" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.35, ease: "easeOut" as const }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center"
            >
              <CrownSVG className="w-20 h-14 mb-2" />

              <p className="font-work-sans font-bold text-lg text-[#181D27] mb-6">
                AristoAccess<span className="text-[#16A34A]">+</span>
              </p>

              <h2 className="font-rozha text-3xl text-[#181D27] mb-3">
                The seal is now yours to bear.
              </h2>

              <p className="font-work-sans text-sm text-[#414651] mb-8">
                No more shadows—your name carries weight
              </p>

              {/* Gold Seal SVG */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                className="mb-8"
              >
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <circle cx="60" cy="60" r="52" fill="#D97706" opacity="0.15" />
                  <circle cx="60" cy="60" r="46" fill="#F59E0B" opacity="0.2" />
                  <circle cx="60" cy="60" r="40" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="8 4" />
                  <circle cx="60" cy="60" r="32" fill="#F59E0B" opacity="0.3" />
                  {/* Laurel left */}
                  <path d="M28 60 Q32 50 38 55 Q34 62 28 60Z" fill="#D97706" opacity="0.7" />
                  <path d="M26 65 Q30 55 36 60 Q32 67 26 65Z" fill="#D97706" opacity="0.6" />
                  {/* Laurel right */}
                  <path d="M92 60 Q88 50 82 55 Q86 62 92 60Z" fill="#D97706" opacity="0.7" />
                  <path d="M94 65 Q90 55 84 60 Q88 67 94 65Z" fill="#D97706" opacity="0.6" />
                  {/* S letter */}
                  <text x="60" y="68" textAnchor="middle" fontSize="28" fill="#92400E" fontWeight="bold" fontFamily="serif">S</text>
                  {/* Bottom drop */}
                  <ellipse cx="60" cy="114" rx="8" ry="5" fill="#D97706" opacity="0.5" />
                  <line x1="60" y1="108" x2="60" y2="114" stroke="#D97706" strokeWidth="3" opacity="0.5" />
                </svg>
              </motion.div>

              <Button
                onClick={() => router.push("/sp/my-services")}
                className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
              >
                Done
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

const MOCK_SPS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "First Name, Last Name",
  avatar: "/images/user/user_avatar.png",
  verified: i % 3 === 0,
}));

const STEPS = ["Contract Sent", "Payment Made", "Finalized"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" as const },
  },
};

export function TrackStep({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const activeStep = 0;

  return (
    <motion.div
      key="track"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-2"
      >
        Track
      </motion.h1>

      {selected === null ? (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-work-sans text-sm text-[#414651] text-center mb-8"
          >
            Choose a Service Provider with whom you have either received or sent
            invoices.
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-4"
          >
            {MOCK_SPS.map((sp) => (
              <motion.div
                key={sp.id}
                variants={cardVariants}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(sp.id)}
                className="bg-[#F9F9F9] rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={sp.avatar}
                      alt={sp.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow">
                    {sp.verified ? (
                      <Image src="/svg/crown.svg" alt="Verified" width={13} height={13} className="text-[#16A34A]" />
                    ) : (
                      <ShieldAlert size={13} className="text-red-500" />
                    )}
                  </div>
                </div>
                <p className="font-rozha text-base text-[#181D27] text-center">
                  {sp.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          <div className="bg-[#F9F9F9] rounded-2xl px-6 py-8">
            <div className="flex items-start justify-between relative">
              <div className="absolute top-4 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 bg-gray-300 z-0" />
              {STEPS.map((label, i) => {
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 z-10 flex-1"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-work-sans text-sm font-bold ${isActive ? "bg-[#181D27] text-white" : isDone ? "bg-[#16A34A] text-white" : "bg-gray-300 text-white"}`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`font-work-sans text-xs font-medium text-center ${isActive ? "text-[#16A34A]" : "text-[#414651]"}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setSelected(null)}
              className="font-work-sans text-sm text-[#414651] underline underline-offset-2"
            >
              Back
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

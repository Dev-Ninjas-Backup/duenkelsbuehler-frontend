"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Contact } from "./types";
import { ContactCard } from "./contact-card";
import { MOCK_CONTACTS } from "./data";

const TRACK_CONTACTS: Contact[] = [
  ...MOCK_CONTACTS,
  {
    id: 3,
    name: "First Name, Last Name",
    avatar: "/images/user/user_avatar.png",
    badge: "warning",
  },
  {
    id: 4,
    name: "First Name, Last Name",
    avatar: "/images/user/user_avatar.png",
    badge: "gold",
  },
  {
    id: 5,
    name: "First Name, Last Name",
    avatar: "/images/user/user_avatar.png",
    badge: "warning",
  },
  {
    id: 6,
    name: "First Name, Last Name",
    avatar: "/images/user/user_avatar.png",
    badge: "warning",
  },
];

const STEPS = [
  { label: "Contract Sent" },
  { label: "Payment Made" },
  { label: "Finalized" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

// Mock: contact 1 is at step 1 (Contract Sent), others at step 0
function getActiveStep(contactId: number) {
  return contactId === 1 ? 1 : 0;
}

export function TrackTab() {
  const [selected, setSelected] = useState<Contact | null>(null);

  const activeStep = selected ? getActiveStep(selected.id) : 0;

  return (
    <div>
      {/* Back button */}
      <AnimatePresence>
        {selected && (
          <motion.button
            key="back"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mb-5"
          >
            <ChevronLeft size={16} /> Back
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selected ? (
          /* ── Contact grid ── */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center mb-6">
              <p className="font-rozha text-2xl text-[#181D27]">
                Payment Tracking
              </p>
              <p className="font-work-sans text-sm text-[#414651] mt-1">
                Choose a client with whom you have either sent contracts to or
                invoiced.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              {TRACK_CONTACTS.map((contact) => (
                <motion.div key={contact.id} variants={cardVariants}>
                  <ContactCard contact={contact} onClick={setSelected} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          /* ── Progress tracker ── */
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto"
          >
            <p className="font-rozha text-2xl text-[#181D27] text-center mb-8">
              Payment Tracking
            </p>

            <div className="bg-[#F5F5F5] rounded-2xl px-8 py-6">
              <div className="flex items-start justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 bg-gray-300 z-0" />

                {STEPS.map((step, i) => {
                  const isDone = i < activeStep;
                  const isActive = i === activeStep - 1;
                  const isPending = i >= activeStep;

                  return (
                    <div
                      key={step.label}
                      className="flex flex-col items-center gap-2 z-10 flex-1"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-work-sans text-sm font-bold transition-colors ${
                          isDone || isActive
                            ? "bg-[#181D27] text-white"
                            : "bg-[#181D27] text-white"
                        }`}
                      >
                        {i + 1}
                      </motion.div>
                      <span
                        className={`font-work-sans text-xs font-medium text-center ${
                          isActive
                            ? "text-[#16A34A]"
                            : isPending && !isDone
                              ? "text-[#414651]"
                              : "text-[#414651]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

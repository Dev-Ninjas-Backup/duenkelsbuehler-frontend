"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { RatingModal } from "./_components/rating-modal";

interface Proposal {
  id: number;
  name: string;
  amount: string;
  avatar: string;
  verified: boolean;
  description: string;
}

const MOCK: Proposal[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "First Name, Last Name",
  amount: "$54.724",
  avatar: "/images/user/user_avatar.png",
  verified: i % 3 === 0,
  description:
    "Provides legal counsel and advocacy for individuals, businesses, and government organizations. Their duties typically include educating and defending clients regarding their rights, communicating with courts and other lawyers, and managing their clients' legal proceedings.",
}));

type View = "grid" | "detail" | "accepted" | "finalized";

/* ── Unverified Warning Modal ── */
function UnverifiedModal({
  onContinue,
  onReturn,
}: {
  onContinue: () => void;
  onReturn: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.22 }}
        className="bg-white rounded-2xl px-8 py-8 max-w-sm w-full flex flex-col gap-4"
      >
        <h2 className="font-rozha text-2xl text-[#181D27] text-center">
          Unverified user!
        </h2>
        <p className="font-work-sans text-sm text-[#414651] text-center">
          You are about to accept an invoice with an unverified user.
        </p>
        <ul className="list-disc pl-5">
          <li className="font-work-sans text-sm text-[#414651]">
            Be careful about exchanging information or accepting projects from
            unverified users.
          </li>
        </ul>
        <button
          onClick={onContinue}
          className="w-full h-12 rounded-full border border-gray-300 font-work-sans text-sm font-semibold text-[#181D27] hover:bg-gray-50 transition-colors"
        >
          Continue
        </button>
        <button
          onClick={onReturn}
          className="w-full h-12 rounded-full bg-red-500 text-white font-work-sans text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          Return
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Ka-Ching Modal ── */
function KaChingModal({
  text,
  btnLabel,
  onAction,
}: {
  text: string;
  btnLabel: string;
  onAction: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.22 }}
        className="bg-white rounded-2xl px-8 py-8 max-w-sm w-full flex flex-col items-center gap-4 text-center"
      >
        <h2 className="font-rozha text-3xl text-[#181D27]">Ka-Ching</h2>
        <p className="font-work-sans text-sm text-[#414651]">{text}</p>
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          <text
            x="50%"
            y="58%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="52"
            fill="#16A34A"
          >
            $
          </text>
        </svg>
        <button
          onClick={onAction}
          className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          {btnLabel}
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── SP Card (reused across views) ── */
function SPCard({ proposal }: { proposal: Proposal }) {
  return (
    <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
        <Image
          src={proposal.avatar}
          alt={proposal.name}
          width={48}
          height={48}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <p className="font-rozha text-lg text-[#181D27]">
          {proposal.name} (
          <span className="text-[#16A34A]">{proposal.amount}</span>)
        </p>
        {proposal.verified ? (
          <span className="inline-flex items-center gap-1 font-work-sans text-xs text-[#16A34A]">
            <Image src="/svg/crown.svg" alt="Verified" width={11} height={11} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-work-sans text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-0.5">
            <ShieldAlert size={11} /> Unverified
          </span>
        )}
      </div>
    </div>
  );
}

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

export default function ReviewProposalsPage() {
  const [view, setView] = useState<View>("grid");
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [showUnverified, setShowUnverified] = useState(false);
  const [showKaChing, setShowKaChing] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [kaChingPhase, setKaChingPhase] = useState<"finalize" | "done">("finalize");

  const handleAccept = () => {
    if (selected && !selected.verified) {
      setShowUnverified(true);
    } else {
      setView("accepted");
    }
  };

  const handleDecline = () => {
    setSelected(null);
    setView("grid");
  };

  const handleComplete = () => {
    setKaChingPhase("finalize");
    setShowKaChing(true);
  };

  const handleFinalize = () => {
    setShowKaChing(false);
    setView("finalized");
  };

  const handleFinalComplete = () => {
    setShowRating(true);
  };

  const handleRatingDone = () => {
    setShowRating(false);
    setSelected(null);
    setView("grid");
  };

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8 overflow-y-auto">
      <AnimatePresence mode="wait">
        {/* ── Grid ── */}
        {view === "grid" && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
            >
              Review Proposals
            </motion.h1>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-4"
            >
              {MOCK.map((p) => (
                <motion.div
                  key={p.id}
                  variants={cardVariants}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelected(p);
                    setView("detail");
                  }}
                  className="bg-[#F9F9F9] rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={p.avatar}
                        alt={p.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* badge icon */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow">
                      {p.verified ? (
                        <Image src="/svg/crown.svg" alt="Verified" width={13} height={13} className="text-[#16A34A]" />
                      ) : (
                        <ShieldAlert size={13} className="text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="font-rozha text-base text-[#181D27] text-center">
                    {p.name}
                  </p>
                  <p className="font-work-sans text-sm font-semibold text-[#16A34A]">
                    {p.amount}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── Detail ── */}
        {view === "detail" && selected && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col max-w-lg mx-auto w-full gap-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center"
            >
              Review Proposals
            </motion.h1>

            <SPCard proposal={selected} />

            <p className="font-work-sans text-sm text-[#414651] leading-relaxed">
              {selected.description}
            </p>

            <div>
              <p className="font-work-sans text-sm font-bold text-[#181D27] mb-1">
                Total Amount
              </p>
              <p className="font-work-sans text-lg font-semibold text-[#16A34A]">
                {selected.amount}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
                className="px-8 h-12 rounded-full border border-gray-300 font-work-sans text-sm font-semibold text-[#181D27] hover:bg-gray-50 transition-colors"
              >
                Accept
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDecline}
                className="px-8 h-12 rounded-full bg-red-500 text-white font-work-sans text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Decline
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Accepted ── */}
        {view === "accepted" && selected && (
          <motion.div
            key="accepted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col max-w-lg mx-auto w-full gap-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center"
            >
              Review Proposals
            </motion.h1>
            <p className="font-work-sans text-sm text-[#414651] text-center">
              You&apos;ve accepted an invoice from:
            </p>

            <SPCard proposal={selected} />

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Complete
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Finalized ── */}
        {view === "finalized" && selected && (
          <motion.div
            key="finalized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col max-w-lg mx-auto w-full gap-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center"
            >
              Review Proposals
            </motion.h1>
            <p className="font-work-sans text-sm text-[#414651] text-center">
              You&apos;ve accepted an invoice from:
            </p>

            <SPCard proposal={selected} />

            <p className="font-work-sans text-sm text-[#414651]">
              They will be notified shortly.
            </p>

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFinalComplete}
                className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Complete
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showUnverified && (
          <UnverifiedModal
            onContinue={() => {
              setShowUnverified(false);
              setView("accepted");
            }}
            onReturn={() => setShowUnverified(false)}
          />
        )}
        {showKaChing && (
          <KaChingModal
            text="Thanks to clients like you, Service Providers get to continue their work worry-free. That's what AristoPay is all about."
            btnLabel="Finalize"
            onAction={handleFinalize}
          />
        )}
        {showRating && selected && (
          <RatingModal
            isOpen={showRating}
            name={selected.name}
            onSubmit={handleRatingDone}
            onSkip={handleRatingDone}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

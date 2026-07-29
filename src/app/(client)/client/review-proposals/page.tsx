"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillWarning } from "react-icons/ai";
import { Send, AlertCircle, FileText } from "lucide-react";
import { RatingModal } from "./_components/rating-modal";
import {
  useClientReceivedProposals,
  useAcceptProposal,
  useDeclineProposal,
  useClientAcceptSPProposal,
  useClientDeclineSPProposal,
  useDocusignRequests,
  useDocusignSignUrl,
} from "@/hooks/sp/use-sp";
import { toast } from "sonner";

interface Provider {
  id: number;
  name: string;
  email: string;
  role: string[];
  avatar?: string;
  isIdentityVerified?: boolean;
}

interface Proposal {
  id: number;
  serviceItemId?: number | null;
  proposalTitle: string;
  serviceDescription: string | null;
  issueDate: string;
  dueDate: string;
  proposedPrice: number;
  currency: string;
  paymentMethod: string;
  notes: string | null;
  terms: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  provider: Provider;
}

type View = "grid" | "detail" | "accepted" | "finalized";

/* ── Unverified Warning Modal ── */
function UnverifiedModal({
  onContinue,
  onReturn,
}: {
  onContinue: () => void;
  onReturn: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-6"
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
          You are about to accept an invoice or proposal with an unverified user.
        </p>
        <ul className="list-disc pl-5">
          <li className="font-work-sans text-sm text-[#414651]">
            Be careful about exchanging information or accepting projects from unverified users.
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

  if (!mounted) return null;
  return createPortal(content, document.body);
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-6"
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

  if (!mounted) return null;
  return createPortal(content, document.body);
}

function getPartyInfo(proposal: any) {
  const party = proposal.provider || proposal.client || {};
  let avatar = party.avatar || party.imageUrl || party.image || "";

  if (avatar && !avatar.startsWith("http") && !avatar.startsWith("/")) {
    avatar = `/${avatar}`;
  }
  if (!avatar) {
    avatar = "";
  }

  return {
    id: party.id || 0,
    name: party.name || party.email || "Service Provider",
    avatar,
    isVerified: party.isIdentityVerified || party.verified || false,
  };
}

/* ── SP Card (reused across views) ── */
function SPCard({ proposal }: { proposal: Proposal }) {
  const party = getPartyInfo(proposal);
  const [imgSrc, setImgSrc] = useState(party.avatar);

  return (
    <div className="w-full bg-[#F9F9F9] rounded-[20px] px-5 py-4 flex items-center gap-4 border border-gray-100/80">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 bg-[#181D27] flex items-center justify-center text-white">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={party.name}
            width={56}
            height={56}
            className="object-cover w-full h-full"
            onError={() => setImgSrc("")}
          />
        ) : (
          <span className="font-rozha text-xl text-white">
            {party.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-rozha text-base sm:text-lg text-[#181D27] truncate">
          {party.name}{" "}
          <span className="text-[#16A34A]">({proposal.proposedPrice} {proposal.currency || "USD"})</span>
        </p>
        <div className="mt-1">
          {party.isVerified ? (
            <span className="inline-flex items-center gap-1 font-work-sans text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <Image src="/svg/crown.svg" alt="Verified" width={12} height={12} /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-work-sans text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              <AiFillWarning className="w-3 h-3" /> Unverified
            </span>
          )}
        </div>
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

  // Queries & Mutations
  const { data: rawProposals = [], isLoading, error } = useClientReceivedProposals();
  const { data: docusignDocs = [] } = useDocusignRequests();
  const acceptMutationGeneric = useAcceptProposal();
  const acceptMutationSP = useClientAcceptSPProposal();
  const declineMutationGeneric = useDeclineProposal();
  const declineMutationSP = useClientDeclineSPProposal();
  const signUrlMutation = useDocusignSignUrl();

  const isAccepting = acceptMutationGeneric.isPending || acceptMutationSP.isPending;
  const isDeclining = declineMutationGeneric.isPending || declineMutationSP.isPending;

  const proposals = (rawProposals as Proposal[]).filter(
    (p) => p && (p.provider || (p as any).client) && p.status === "PENDING"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get("event");
      if (eventParam === "signing_complete") {
        setShowKaChing(true);
        toast.success("DocuSign contract successfully signed!");
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (!showKaChing) return;
    const audio = new Audio("/sounds/modal_open_sound.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }, [showKaChing]);

  const executeAcceptFlow = async () => {
    if (!selected) return;

    try {
      try {
        await acceptMutationSP.mutateAsync(selected.id);
      } catch (err: any) {
        if (err?.message?.toLowerCase().includes("already accepted")) {
          // Already accepted, proceed seamlessly
        } else {
          await acceptMutationGeneric.mutateAsync(selected.id);
        }
      }
      toast.success("Proposal accepted successfully!");

      const matchedDoc = docusignDocs.find((doc: any) => doc.proposalId === selected.id);
      if (matchedDoc && matchedDoc.dbId && matchedDoc.senderStatus === "SIGNED" && matchedDoc.status !== "SIGNED") {
        try {
          const signRes = await signUrlMutation.mutateAsync(matchedDoc.dbId);
          if (signRes?.url) {
            window.location.href = signRes.url;
            return;
          }
        } catch {
          toast.info("Proposal accepted. Please sign contract to finalize.");
        }
      }

      setView("accepted");
    } catch (e: any) {
      if (e?.message?.toLowerCase().includes("already accepted")) {
        setView("accepted");
        return;
      }
      toast.error(e?.message || "Failed to accept proposal");
    }
  };

  const handleAccept = () => {
    if (!selected) return;
    const party = getPartyInfo(selected);
    if (!party.isVerified) {
      setShowUnverified(false); // allow proceeding directly or showing prompt
      executeAcceptFlow();
    } else {
      executeAcceptFlow();
    }
  };

  const handleDecline = async () => {
    if (!selected) return;
    try {
      try {
        await declineMutationSP.mutateAsync(selected.id);
      } catch {
        await declineMutationGeneric.mutateAsync(selected.id);
      }
      toast.success("Proposal declined successfully!");
      setSelected(null);
      setView("grid");
    } catch (e: any) {
      toast.error(e?.message || "Failed to decline proposal");
    }
  };

  const handleComplete = () => {
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
    <div className="flex flex-col h-full px-4 py-8 lg:px-12 overflow-y-auto">
      <AnimatePresence mode="wait">
        {/* ── Grid ── */}
        {view === "grid" && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-6 shrink-0"
            >
              Review Proposals
            </motion.h1>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <svg className="animate-spin h-8 w-8 text-[#181D27] mb-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="font-work-sans text-sm text-[#535862]">Loading received proposals...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 bg-red-50/50 rounded-3xl border border-red-100 p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                <h3 className="font-rozha text-lg text-[#181D27] mb-1">Failed to load proposals</h3>
                <p className="font-work-sans text-sm text-red-600">{(error as any)?.message || "Network error."}</p>
              </div>
            ) : proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-[#F9F9F9] rounded-[24px] border border-gray-100 p-8 text-center max-w-lg mx-auto">
                <Send className="w-10 h-10 text-gray-300 mb-3" />
                <h3 className="font-rozha text-xl text-[#181D27] mb-1.5">No proposals to review</h3>
                <p className="font-work-sans text-sm text-[#535862] max-w-sm">
                  You don&apos;t have any pending received proposals from Service Providers at the moment.
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {proposals.map((p) => {
                  const matchedDoc = docusignDocs.find((doc: any) => doc.proposalId === p.id);
                  const party = getPartyInfo(p);

                  return (
                    <motion.div
                      key={p.id}
                      variants={cardVariants}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelected(p);
                        setView("detail");
                      }}
                      className="bg-[#F9F9F9] rounded-[20px] p-5 flex flex-col items-center gap-3 cursor-pointer hover:bg-[#EFEFEF] transition-colors border border-gray-100/80"
                    >
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-[#181D27] flex items-center justify-center text-white font-rozha text-2xl">
                          {party.avatar ? (
                            <Image
                              src={party.avatar}
                              alt={party.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/user/user_avatar.png";
                              }}
                            />
                          ) : (
                            <span>{party.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                          {party.isVerified ? (
                            <Image src="/svg/crown.svg" alt="Verified" width={13} height={13} />
                          ) : (
                            <AiFillWarning className="text-red-500 w-[13px] h-[13px]" />
                          )}
                        </div>
                      </div>
                      <p className="font-rozha text-base text-[#181D27] text-center">
                        {party.name}
                      </p>
                      <p className="font-work-sans text-sm font-semibold text-[#16A34A]">
                        {p.proposedPrice} {p.currency || "USD"}
                      </p>

                      {matchedDoc && (
                        <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1 rounded-xl">
                          <FileText size={11} className="text-gray-400" />
                          <span className="font-work-sans text-[10px] text-gray-500">Contract:</span>
                          <span className={`font-work-sans text-[10px] font-bold ${
                            matchedDoc.status === "SIGNED" ? "text-emerald-600" : "text-amber-600"
                          }`}>{matchedDoc.status}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
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
            className="flex flex-col max-w-lg mx-auto w-full gap-5 px-2"
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3"
            >
              Review Proposal
            </motion.h1>

            <SPCard proposal={selected} />

            <div className="bg-[#F9F9F9] rounded-2xl p-4 border border-gray-100 flex flex-col gap-2">
              <h3 className="font-rozha text-lg text-[#181D27]">{selected.proposalTitle}</h3>
              <p className="font-work-sans text-sm text-[#414651] leading-relaxed">
                {selected.serviceDescription || "No description provided."}
              </p>
            </div>

            <div>
              <p className="font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Total Amount
              </p>
              <p className="font-rozha text-xl font-semibold text-[#16A34A]">
                {selected.proposedPrice} {selected.currency}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => {
                  setSelected(null);
                  setView("grid");
                }}
                className="w-full sm:w-auto px-6 h-12 rounded-full border border-gray-200 font-work-sans text-sm text-[#535862] hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={isAccepting || isDeclining}
                onClick={handleAccept}
                className="w-full sm:w-auto px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-50"
              >
                {isAccepting ? "Accepting..." : "Accept Proposal"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={isAccepting || isDeclining}
                onClick={handleDecline}
                className="w-full sm:w-auto px-8 h-12 rounded-full bg-red-500 text-white font-work-sans text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeclining ? "Declining..." : "Decline"}
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
            className="flex flex-col max-w-lg mx-auto w-full gap-5 px-2"
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3"
            >
              Proposal Accepted
            </motion.h1>
            <p className="font-work-sans text-sm text-[#414651] text-center">
              You&apos;ve accepted a proposal from:
            </p>

            <SPCard proposal={selected} />

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Complete &amp; Review
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
            className="flex flex-col max-w-lg mx-auto w-full gap-5 px-2"
          >
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3"
            >
              Finalized
            </motion.h1>
            <p className="font-work-sans text-sm text-[#414651] text-center">
              Transaction finalized for:
            </p>

            <SPCard proposal={selected} />

            <p className="font-work-sans text-sm text-[#414651] text-center">
              They will be notified shortly. Please take a moment to leave feedback.
            </p>

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFinalComplete}
                className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Rate Service Provider
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
              executeAcceptFlow();
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
        {showRating && (
          <RatingModal
            isOpen={showRating}
            name={selected ? getPartyInfo(selected).name : (rawProposals?.[0] ? getPartyInfo(rawProposals[0]).name : "Service Provider")}
            serviceId={selected?.serviceItemId || (rawProposals?.[0] as any)?.serviceItemId || 1}
            revieweeId={selected ? getPartyInfo(selected).id : (rawProposals?.[0] ? getPartyInfo(rawProposals[0]).id : 1)}
            onSubmit={handleRatingDone}
            onSkip={handleRatingDone}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

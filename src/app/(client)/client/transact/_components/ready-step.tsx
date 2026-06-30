"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillWarning } from "react-icons/ai";
import { useTransactStore } from "@/stores/transact/use-transact-store";
import { useSendDirectProposal } from "@/hooks/sp/use-sp";
import { toast } from "sonner";

function KaChingModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl px-8 py-10 max-w-sm w-full text-center"
      >
        <h2 className="font-rozha text-3xl text-[#181D27] mb-3">Ka-Ching</h2>
        <p className="font-work-sans text-sm text-[#414651] mb-6">You just made someone&apos;s day.</p>
        <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto">
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="48" fill="#16A34A">$</text>
        </svg>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}

function toIsoDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  if (dateStr.includes("T")) return dateStr;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(Date.UTC(year, month, day, 10, 0, 0)).toISOString();
    }
  }
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }
  return new Date().toISOString();
}

export function ReadyStep() {
  const { data, updateData, resetTransact, setStep } = useTransactStore();
  const sp = data.sp!;

  const [confirmSP, setConfirmSP] = useState(data.confirmSP);
  const [confirmUnverified, setConfirmUnverified] = useState(data.confirmUnverified);
  const [showModal, setShowModal] = useState(false);

  const { mutate: sendProposal, isPending } = useSendDirectProposal();

  useEffect(() => {
    if (!showModal) return;
    const audio = new Audio("/sounds/modal_open_sound.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }, [showModal]);

  const canSubmit = confirmSP && (!sp.verified ? confirmUnverified : true);

  const handleSubmit = () => {
    const isoIssueDate = toIsoDate(data.issueDate);
    const isoDueDate = toIsoDate(data.dueDate);
    const numericPrice = Number(data.price);

    sendProposal(
      {
        providerId: sp.id,
        data: {
          proposalTitle: data.title,
          serviceDescription: data.serviceDescription,
          issueDate: isoIssueDate,
          dueDate: isoDueDate,
          proposedPrice: numericPrice,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          notes: data.notes || undefined,
          terms: data.terms || undefined,
        },
      },
      {
        onSuccess: () => {
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            resetTransact();
          }, 2500);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to send proposal. Please try again.");
        },
      }
    );
  };

  return (
    <>
      <motion.div
        key="ready"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center max-w-lg mx-auto w-full"
      >
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
        >
          Ready
        </motion.h1>

        {/* SP Card */}
        <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative">
            <Image src={sp.avatar} alt={sp.name} fill className="object-cover" />
          </div>
          <div>
            <p className="font-rozha text-lg text-[#181D27]">{sp.name}</p>
            {!sp.verified && (
              <span className="inline-flex items-center gap-1 font-work-sans text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-0.5">
                <AiFillWarning className="w-[11px] h-[11px]" /> Unverified
              </span>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-4 w-full mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmSP}
              onChange={(e) => {
                setConfirmSP(e.target.checked);
                updateData({ confirmSP: e.target.checked });
              }}
              className="w-4 h-4 mt-0.5 accent-[#181D27]"
            />
            <span className="font-work-sans text-sm text-[#414651]">Click this box to confirm you are requesting the correct S.P</span>
          </label>
          {!sp.verified && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmUnverified}
                onChange={(e) => {
                  setConfirmUnverified(e.target.checked);
                  updateData({ confirmUnverified: e.target.checked });
                }}
                className="w-4 h-4 mt-0.5 accent-[#181D27]"
              />
              <span className="font-work-sans text-sm text-[#414651]">By clicking here you acknowledge that you are making a transaction with an unverified user.</span>
            </label>
          )}
        </div>

        <div className="flex justify-center items-center gap-6 mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              updateData({ confirmSP, confirmUnverified });
              setStep("final-remarks");
            }}
            disabled={isPending}
            className="w-36 h-12 rounded-full border border-gray-200 font-work-sans text-sm text-[#414651] font-medium hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            ← Back
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white animate-infinite" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && <KaChingModal onClose={() => { setShowModal(false); resetTransact(); }} />}
      </AnimatePresence>
    </>
  );
}

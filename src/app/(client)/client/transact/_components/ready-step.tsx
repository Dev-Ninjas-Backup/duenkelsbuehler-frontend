"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillWarning } from "react-icons/ai";
import { SP } from "./types";

function KaChingModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6"
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
}

export function ReadyStep({ sp, onDone }: { sp: SP; onDone: () => void }) {
  const [confirmSP, setConfirmSP] = useState(false);
  const [confirmUnverified, setConfirmUnverified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const audio = new Audio("/sounds/modal_open_sound.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }, [showModal]);

  const canSubmit = confirmSP && (!sp.verified ? confirmUnverified : true);

  const handleSubmit = () => {
    setShowModal(true);
    setTimeout(() => { setShowModal(false); onDone(); }, 2500);
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
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image src={sp.avatar} alt={sp.name} width={48} height={48} className="object-cover w-full h-full" />
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
            <input type="checkbox" checked={confirmSP} onChange={(e) => setConfirmSP(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#181D27]" />
            <span className="font-work-sans text-sm text-[#414651]">Click this box to confirm you are requesting the correct S.P</span>
          </label>
          {!sp.verified && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={confirmUnverified} onChange={(e) => setConfirmUnverified(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#181D27]" />
              <span className="font-work-sans text-sm text-[#414651]">By clicking here you acknowledge that you are making a transaction with an unverified user.</span>
            </label>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showModal && <KaChingModal onClose={() => { setShowModal(false); onDone(); }} />}
      </AnimatePresence>
    </>
  );
}

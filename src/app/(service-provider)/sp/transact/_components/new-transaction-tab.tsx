"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Client, SubStep, SPProposalData } from "./types";
import { ClientSearchStep } from "./client-search-step";
import { SPProposalDetailsStep } from "./proposal-details-step";
import { SPFinalRemarksStep } from "./final-remarks-step";
import { ReadyStep } from "./ready-step";
import { KaChingModal } from "./kaching-modal";
import { DealMakerModal } from "./deal-maker-modal";
import { RatingModal } from "./rating-modal";
import { useSendSPProposal } from "@/hooks/sp/use-sp";

const STEP_ORDER: SubStep[] = ["client-search", "proposal-details", "final-remarks", "ready"];

const EMPTY_DATA: SPProposalData = {
  client: null,
  title: "",
  serviceDescription: "",
  issueDate: "",
  dueDate: "",
  price: "",
  currency: "USD",
  paymentMethod: "CARD",
  notes: "",
  terms: "",
  confirmClient: false,
  confirmUnverified: false,
};

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

interface Props {
  onDone: () => void;
}

export function NewTransactionTab({ onDone }: Props) {
  const [subStep, setSubStep]     = useState<SubStep>("client-search");
  const [direction, setDirection] = useState(1);
  const [data, setData]           = useState<SPProposalData>(EMPTY_DATA);
  const [showKaChing, setShowKaChing]     = useState(false);
  const [showDealMaker, setShowDealMaker] = useState(false);
  const [showRating, setShowRating]       = useState(false);
  const [txError, setTxError]             = useState<string | null>(null);

  const { mutate: sendProposal, isPending: isSendingProposal } = useSendSPProposal();

  const goTo = (next: SubStep, dir: number) => {
    setDirection(dir);
    setSubStep(next);
  };

  const goNext = () => {
    const idx = STEP_ORDER.indexOf(subStep);
    if (idx < STEP_ORDER.length - 1) goTo(STEP_ORDER[idx + 1], 1);
  };

  const goBack = () => {
    const idx = STEP_ORDER.indexOf(subStep);
    if (idx > 0) goTo(STEP_ORDER[idx - 1], -1);
  };

  const set = <K extends keyof SPProposalData>(key: K, val: SPProposalData[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const handleSelectClient = (client: Client) => {
    set("client", client);
    goTo("proposal-details", 1);
  };

  const handleSubmit = () => {
    if (!data.client) return;

    setTxError(null);
    sendProposal(
      {
        clientId: data.client.id,
        data: {
          proposalTitle: data.title,
          serviceDescription: data.serviceDescription,
          issueDate: toIsoDate(data.issueDate),
          dueDate: toIsoDate(data.dueDate),
          proposedPrice: Number(data.price),
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          notes: data.notes || undefined,
          terms: data.terms || undefined,
        },
      },
      {
        onSuccess: () => {
          setShowKaChing(true);
        },
        onError: (err) => {
          setTxError((err as Error).message);
        },
      }
    );
  };

  const handleFinalize = () => {
    setShowKaChing(false);
    setShowRating(true);
  };

  const showBack = subStep !== "client-search";

  const fadeUpVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div>
      {/* Back button */}
      <AnimatePresence>
        {showBack && (
          <motion.button
            key="back"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={goBack}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mb-5"
          >
            <ChevronLeft size={16} /> Back
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={subStep}
          variants={fadeUpVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: "easeInOut" }}
        >
          {/* Step 1 — Client Search */}
          {subStep === "client-search" && (
            <ClientSearchStep onSelect={handleSelectClient} />
          )}

          {/* Step 2 — Proposal Details */}
          {subStep === "proposal-details" && (
            <SPProposalDetailsStep
              initialData={{
                title: data.title,
                serviceDescription: data.serviceDescription,
                price: data.price,
                currency: data.currency,
                paymentMethod: data.paymentMethod,
              }}
              onNext={(stepData) => {
                setData((prev) => ({ ...prev, ...stepData }));
                goNext();
              }}
            />
          )}

          {/* Step 3 — Final Remarks */}
          {subStep === "final-remarks" && (
            <SPFinalRemarksStep
              initialData={{
                issueDate: data.issueDate,
                dueDate: data.dueDate,
                notes: data.notes,
                terms: data.terms,
              }}
              onNext={(stepData) => {
                setData((prev) => ({ ...prev, ...stepData }));
                goNext();
              }}
            />
          )}

          {/* Step 4 — Ready */}
          {subStep === "ready" && data.client && (
            <ReadyStep
              client={data.client}
              title={data.title}
              serviceDescription={data.serviceDescription}
              price={data.price}
              currency={data.currency}
              paymentMethod={data.paymentMethod}
              confirmClient={data.confirmClient}
              confirmUnverified={data.confirmUnverified}
              onConfirmClientChange={(v) => set("confirmClient", v)}
              onConfirmUnverifiedChange={(v) => set("confirmUnverified", v)}
              onSubmit={handleSubmit}
              isPending={isSendingProposal}
              error={txError}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <KaChingModal isOpen={showKaChing} onFinalize={handleFinalize} />
      <RatingModal
        isOpen={showRating}
        name={data.client?.name ?? ""}
        onSubmit={() => {
          setShowRating(false);
          setShowDealMaker(true);
        }}
        onSkip={() => {
          setShowRating(false);
          setShowDealMaker(true);
        }}
      />
      <DealMakerModal isOpen={showDealMaker} onClose={onDone} />
    </div>
  );
}

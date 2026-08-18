"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Upload, X, FileText } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { Client, SubStep, SPProposalData } from "./types";
import { ClientSearchStep } from "./client-search-step";
import { SPProposalDetailsStep } from "./proposal-details-step";
import { SPFinalRemarksStep } from "./final-remarks-step";
import { ReadyStep } from "./ready-step";
import { KaChingModal } from "./kaching-modal";
import { DealMakerModal } from "./deal-maker-modal";
import { RatingModal } from "./rating-modal";
import { ContractStep } from "./contract-step";
import { useSendSPProposal, useUploadAndSendDocusign, useDocusignSignUrl } from "@/hooks/sp/use-sp";
import { toast } from "sonner";

const STEP_ORDER: SubStep[] = ["client-search", "contract", "confirm", "proposal-details", "final-remarks", "ready"];

const EMPTY_DATA: SPProposalData = {
  client: null,
  contractFile: null,
  docuSign: false,
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

  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: sendProposal, isPending: isSendingProposal } = useSendSPProposal();
  const uploadDocusignMutation = useUploadAndSendDocusign();
  const signUrlMutation = useDocusignSignUrl();

  const isPending = isSendingProposal || uploadDocusignMutation.isPending || signUrlMutation.isPending;

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
    goTo("contract", 1);
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
        onSuccess: async (createdProposal: any) => {
          if (data.contractFile && createdProposal?.id) {
            try {
              const formData = new FormData();
              formData.append("file", data.contractFile);
              formData.append("title", data.title || "Service Agreement");
              formData.append("clientId", String(data.client!.id));
              formData.append("proposalId", String(createdProposal.id));

              const docRes = await uploadDocusignMutation.mutateAsync(formData);

              // If sender (SP) needs to sign first via embedded URL
              if (docRes?.dbId) {
                try {
                  const signRes = await signUrlMutation.mutateAsync(docRes.dbId);
                  if (signRes?.url) {
                    window.location.href = signRes.url;
                    return;
                  }
                } catch {
                  // Fallback to KaChing modal
                }
              }
            } catch (err: any) {
              toast.error(err?.message || "Proposal created, but contract upload failed.");
            }
          }

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
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mb-5 cursor-pointer"
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

          {/* Step 2 — Get it in Writing (Contract) */}
          {subStep === "contract" && data.client && (
            <ContractStep
              contact={{
                id: data.client.id,
                name: data.client.name,
                badge: data.client.verified ? "gold" : "warning",
                avatar: data.client.avatar,
              }}
              contractFile={data.contractFile}
              docuSign={data.docuSign}
              onFileChange={(file) => {
                set("contractFile", file);
                if (file) set("docuSign", true);
              }}
              onDocuSignChange={(val) => set("docuSign", val)}
              onNext={() => goTo("confirm", 1)}
              onSkip={() => {
                set("contractFile", null);
                goTo("confirm", 1);
              }}
            />
          )}

          {/* Step 3 — Confirm */}
          {subStep === "confirm" && data.client && (
            <div className="flex flex-col items-center max-w-lg mx-auto w-full pt-2 pb-6">
              <h2 className="font-rozha text-3xl lg:text-4xl text-[#181D27] text-center mb-6">
                Confirm
              </h2>

              {/* Selected Client Card */}
              <div className="w-full bg-[#F9F9F9] rounded-2xl px-6 py-4 flex items-center justify-start gap-4 mb-4 border border-gray-100/80">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-gray-200 flex items-center justify-center">
                  {data.client.avatar ? (
                    <Image src={data.client.avatar} alt={data.client.name} fill className="object-cover" />
                  ) : (
                    <span className="font-rozha text-lg text-[#181D27]">{data.client.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-rozha text-lg text-[#181D27] leading-snug">{data.client.name}</p>
                  {!data.client.verified && (
                    <span className="inline-flex items-center gap-1 font-work-sans text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-0.5">
                      <AiFillWarning className="w-[11px] h-[11px]" /> Unverified
                    </span>
                  )}
                </div>
              </div>

              {/* File Card if attached */}
              {data.contractFile && (
                <div className="w-full bg-[#F9F9F9] rounded-2xl px-5 py-4 flex items-center gap-4 mb-6 border border-gray-100/80">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0 text-white">
                    <FileText size={20} />
                  </div>
                  <p className="font-rozha text-base text-[#181D27] flex-1 truncate">
                    {data.contractFile.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      set("contractFile", null);
                      set("docuSign", false);
                    }}
                    className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer"
                    aria-label="Remove attached file"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* DocuSign Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer mb-8 self-center">
                <input
                  type="checkbox"
                  checked={data.docuSign}
                  onChange={(e) => set("docuSign", e.target.checked)}
                  className="w-4 h-4 accent-[#181D27] rounded border-gray-300"
                />
                <span className="font-work-sans text-xs text-[#414651]">
                  Click this box to require a DocuSign signature before invoicing
                </span>
              </label>

              {/* Nav Buttons */}
              <div className="flex items-center justify-center gap-6 w-full">
                <button
                  onClick={() => goTo("contract", -1)}
                  className="font-work-sans text-sm text-[#535862] hover:text-[#181D27] transition-colors cursor-pointer"
                >
                  Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goTo("proposal-details", 1)}
                  className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors cursor-pointer"
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 4 — Proposal Details */}
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

          {/* Step 5 — Final Remarks */}
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

          {/* Step 6 — Ready */}
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
              isPending={isPending}
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

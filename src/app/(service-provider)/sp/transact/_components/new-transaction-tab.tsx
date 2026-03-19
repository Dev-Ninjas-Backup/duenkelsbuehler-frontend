"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus } from "lucide-react";
import { Contact, SubStep, TransactionData } from "./types";
import { ContactCard } from "./contact-card";
import { AmountStep } from "./amount-step";
import { PaymentMethodStep } from "./payment-method-step";
import { ContractStep } from "./contract-step";
import { InvoiceStep } from "./invoice-step";
import { FinalDetailsStep } from "./final-details-step";
import { ReadyStep } from "./ready-step";
import { KaChingModal } from "./kaching-modal";
import { DealMakerModal } from "./deal-maker-modal";
import { RatingModal } from "./rating-modal";
import { MOCK_CONTACTS } from "./data";
import { useSavedContracts } from "@/store/saved-contracts";
import { AddContactModal } from "./add-contact-modal";

const STEP_ORDER: SubStep[] = ["contacts", "amount", "payment-method", "contract", "invoice", "final-details", "ready"];

const slideVariants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  40 : -40 }),
  center:              () => ({ opacity: 1, x: 0 }),
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 :  40 }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const EMPTY_DATA: TransactionData = {
  contact: null, amountRange: null, paymentMethod: null,
  contractFile: null, docuSign: false,
  invoiceTitle: "", issueDate: "", dueDate: "", price: "", tax: "",
  notes: "", terms: "",
  confirmClient: false, confirmUnverified: false,
};

interface Props {
  onDone: () => void;
}

export function NewTransactionTab({ onDone }: Props) {
  const [subStep, setSubStep]     = useState<SubStep>("contacts");
  const [direction, setDirection] = useState(1);
  const [data, setData]           = useState<TransactionData>(EMPTY_DATA);
  const [showKaChing, setShowKaChing]     = useState(false);
  const [showDealMaker, setShowDealMaker] = useState(false);
  const [showRating, setShowRating]       = useState(false);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [contacts, setContacts]           = useState(MOCK_CONTACTS);

  const { saveContract } = useSavedContracts();

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

  const set = <K extends keyof TransactionData>(key: K, val: TransactionData[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const handleSelectContact = (contact: Contact) => {
    set("contact", contact);
    set("amountRange", null);
    goTo("amount", 1);
  };

  const handleSubmit = () => setShowKaChing(true);
  const handleFinalize = () => { setShowKaChing(false); setShowRating(true); };

  const showBack = subStep !== "contacts";

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

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={subStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: "easeInOut" }}
        >
          {/* Step 1 — Contacts */}
          {subStep === "contacts" && (
            <div>
              <p className="font-rozha text-2xl text-[#181D27] text-center mb-6">Choose a Contact</p>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {contacts.map((contact) => (
                  <motion.div key={contact.id} variants={cardVariants}>
                    <ContactCard contact={contact} onClick={handleSelectContact} />
                  </motion.div>
                ))}
                <motion.button
                  variants={cardVariants}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#F5F5F5] rounded-2xl p-5 flex items-center justify-center min-h-[160px] hover:bg-gray-100 transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 rounded-full bg-[#6B7280] flex items-center justify-center text-white shadow-md">
                    <Plus size={26} strokeWidth={2.5} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          )}

          {/* Step 2 — Amount */}
          {subStep === "amount" && data.contact && (
            <AmountStep
              contact={data.contact}
              selected={data.amountRange}
              onSelect={(v) => set("amountRange", v)}
              onNext={goNext}
            />
          )}

          {/* Step 3 — Payment Method */}
          {subStep === "payment-method" && data.contact && (
            <PaymentMethodStep
              contact={data.contact}
              selected={data.paymentMethod}
              onSelect={(v) => set("paymentMethod", v)}
              onNext={goNext}
            />
          )}

          {/* Step 4 — Contract */}
          {subStep === "contract" && data.contact && (
            <ContractStep
              contact={data.contact}
              contractFile={data.contractFile}
              docuSign={data.docuSign}
              onFileChange={(f) => set("contractFile", f)}
              onDocuSignChange={(v) => set("docuSign", v)}
              onNext={(shouldSave) => {
                if (shouldSave && data.contractFile) {
                  saveContract({
                    file: data.contractFile,
                    clientName: data.contact?.name ?? "",
                    amount: data.amountRange ?? "",
                    invoiceTitle: data.invoiceTitle || "Untitled Invoice",
                  });
                }
                goNext();
              }}
              onSkip={goNext}
            />
          )}

          {/* Step 5 — Invoice */}
          {subStep === "invoice" && (
            <InvoiceStep
              data={{ invoiceTitle: data.invoiceTitle, issueDate: data.issueDate, dueDate: data.dueDate, price: data.price, tax: data.tax }}
              onChange={(field, val) => set(field, val)}
              onNext={goNext}
            />
          )}

          {/* Step 6 — Final Details */}
          {subStep === "final-details" && (
            <FinalDetailsStep
              notes={data.notes}
              terms={data.terms}
              onNotesChange={(v) => set("notes", v)}
              onTermsChange={(v) => set("terms", v)}
              onNext={goNext}
            />
          )}

          {/* Step 7 — Ready */}
          {subStep === "ready" && (
            <ReadyStep
              confirmClient={data.confirmClient}
              confirmUnverified={data.confirmUnverified}
              onConfirmClientChange={(v) => set("confirmClient", v)}
              onConfirmUnverifiedChange={(v) => set("confirmUnverified", v)}
              onSubmit={handleSubmit}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <AddContactModal
        isOpen={showAddModal}
        existingIds={contacts.map((c) => c.id)}
        onAdd={(contact) => setContacts((prev) => [...prev, contact])}
        onClose={() => setShowAddModal(false)}
      />
      <KaChingModal isOpen={showKaChing} onFinalize={handleFinalize} />
      <RatingModal
        isOpen={showRating}
        name={data.contact?.name ?? ""}
        onSubmit={() => { setShowRating(false); setShowDealMaker(true); }}
        onSkip={() => { setShowRating(false); setShowDealMaker(true); }}
      />
      <DealMakerModal isOpen={showDealMaker} onClose={onDone} />
    </div>
  );
}

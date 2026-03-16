"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

type PaymentMethod = "card" | "googlepay" | "bank";

// ─── Card ────────────────────────────────────────────────────────────────────

const cardSchema = z.object({
  cardNumber: z.string().min(19, "Enter a valid card number"),
  expiryDate: z.string().min(5, "Enter a valid expiry date"),
  cvc: z.string().min(3, "Enter a valid CVC"),
});
type CardFormData = z.infer<typeof cardSchema>;

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

function CardForm() {
  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardNumber: "", expiryDate: "", cvc: "" },
  });
  const onSubmit = (data: CardFormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field label="Card Number" error={errors.cardNumber?.message}>
        <input
          placeholder="1234 1234 2321 12312"
          maxLength={19}
          onChange={(e) => setValue("cardNumber", formatCardNumber(e.target.value), { shouldValidate: true })}
          value={watch("cardNumber")}
          className={inputCls}
        />
      </Field>
      <Field label="Expiry Date" error={errors.expiryDate?.message}>
        <input
          placeholder="09/25"
          maxLength={5}
          onChange={(e) => setValue("expiryDate", formatExpiry(e.target.value), { shouldValidate: true })}
          value={watch("expiryDate")}
          className={inputCls}
        />
      </Field>
      <Field label="CVC" error={errors.cvc?.message}>
        <input
          placeholder="123"
          maxLength={4}
          onChange={(e) => setValue("cvc", e.target.value.replace(/\D/g, "").slice(0, 4), { shouldValidate: true })}
          value={watch("cvc")}
          className={inputCls}
        />
      </Field>
      <SubmitRow />
    </form>
  );
}

// ─── Google Pay ───────────────────────────────────────────────────────────────

const gpaySchema = z.object({ email: z.string().email("Enter a valid Gmail address") });
type GPayFormData = z.infer<typeof gpaySchema>;

function GooglePayForm() {
  const [linked, setLinked] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<GPayFormData>({
    resolver: zodResolver(gpaySchema),
  });
  const onSubmit = (_: GPayFormData) => setLinked(true);

  if (linked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-10"
      >
        {/* Google Pay logo mark */}
        <div className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
          <svg viewBox="0 0 48 48" className="w-9 h-9">
            <path fill="#4285F4" d="M23.49 12.27c0-.93-.08-1.82-.23-2.68H12v5.07h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.02z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.07.72-2.44 1.14-4.05 1.14-3.12 0-5.76-2.1-6.7-4.93H1.3v3.09A11.99 11.99 0 0 0 12 24z"/>
            <path fill="#FBBC05" d="M5.3 14.3A7.19 7.19 0 0 1 4.93 12c0-.8.14-1.58.37-2.3V6.61H1.3A11.99 11.99 0 0 0 0 12c0 1.93.46 3.76 1.3 5.39l4-3.09z"/>
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.95 11.95 0 0 0 12 0 11.99 11.99 0 0 0 1.3 6.61l4 3.09C6.24 6.87 8.88 4.77 12 4.77z"/>
          </svg>
        </div>
        <p className="font-work-sans text-sm font-semibold text-[#181D27]">Google Pay linked successfully!</p>
        <p className="font-work-sans text-xs text-[#9CA3AF]">Your Google account is now connected for payments.</p>
        <button
          onClick={() => setLinked(false)}
          className="mt-2 px-6 py-2.5 rounded-full border-2 border-[#181D27] text-[#181D27] font-work-sans text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Unlink Account
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z"/>
        </svg>
        <p className="font-work-sans text-xs text-blue-700 leading-relaxed">
          Link your Google account to enable fast, secure payments via Google Pay. Your Gmail address must be associated with an active Google Pay account.
        </p>
      </div>

      <Field label="Gmail Address" error={errors.email?.message}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg viewBox="0 0 48 48" className="w-4 h-4">
              <path fill="#4285F4" d="M23.49 12.27c0-.93-.08-1.82-.23-2.68H12v5.07h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.02z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.07.72-2.44 1.14-4.05 1.14-3.12 0-5.76-2.1-6.7-4.93H1.3v3.09A11.99 11.99 0 0 0 12 24z"/>
              <path fill="#FBBC05" d="M5.3 14.3A7.19 7.19 0 0 1 4.93 12c0-.8.14-1.58.37-2.3V6.61H1.3A11.99 11.99 0 0 0 0 12c0 1.93.46 3.76 1.3 5.39l4-3.09z"/>
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.95 11.95 0 0 0 12 0 11.99 11.99 0 0 0 1.3 6.61l4 3.09C6.24 6.87 8.88 4.77 12 4.77z"/>
            </svg>
          </span>
          <input
            {...register("email")}
            placeholder="yourname@gmail.com"
            className={`${inputCls} pl-10`}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-medium hover:bg-[#2d3748] transition-colors flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 48 48" className="w-4 h-4">
            <path fill="#fff" d="M23.49 12.27c0-.93-.08-1.82-.23-2.68H12v5.07h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.02z"/>
          </svg>
          Link Google Pay Account
        </button>
        <p className="text-center font-work-sans text-xs text-[#9CA3AF]">
          You&apos;ll be redirected to Google to authorize the connection.
        </p>
      </div>
    </form>
  );
}

// ─── Bank ─────────────────────────────────────────────────────────────────────

const bankSchema = z.object({
  accountHolder: z.string().min(2, "Enter account holder name"),
  bankName: z.string().min(2, "Enter bank name"),
  accountNumber: z.string().min(8, "Enter a valid account number"),
  routingNumber: z.string().min(9, "Enter a valid routing number").max(9, "Routing number must be 9 digits"),
});
type BankFormData = z.infer<typeof bankSchema>;

function BankForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
  });
  const onSubmit = (data: BankFormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        </svg>
        <p className="font-work-sans text-xs text-amber-700 leading-relaxed">
          Bank transfers may take 1–3 business days to process. Ensure your details are accurate to avoid delays.
        </p>
      </div>

      <Field label="Account Holder Name" error={errors.accountHolder?.message}>
        <input {...register("accountHolder")} placeholder="John Doe" className={inputCls} />
      </Field>

      <Field label="Bank Name" error={errors.bankName?.message}>
        <input {...register("bankName")} placeholder="e.g. Chase, Bank of America" className={inputCls} />
      </Field>

      <Field label="Account Number" error={errors.accountNumber?.message}>
        <input
          {...register("accountNumber")}
          placeholder="••••••••1234"
          type="password"
          className={inputCls}
        />
      </Field>

      <Field label="Routing Number" error={errors.routingNumber?.message}>
        <input
          {...register("routingNumber")}
          placeholder="9-digit routing number"
          maxLength={9}
          className={inputCls}
        />
      </Field>

      <SubmitRow />
    </form>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const inputCls =
  "w-full border border-gray-200 rounded-lg px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-work-sans text-sm font-medium text-[#181D27]">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SubmitRow() {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-medium hover:bg-[#2d3748] transition-colors"
      >
        Submit
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const methodTabs: { key: PaymentMethod; label: string }[] = [
  { key: "card", label: "Card" },
  { key: "googlepay", label: "Google Pay" },
  { key: "bank", label: "Bank" },
];

export function PaymentSetupTab() {
  const [method, setMethod] = useState<PaymentMethod>("card");

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center"
    >
      <h2 className="font-rozha text-2xl text-[#181D27] mb-6">Payment Information</h2>

      {/* Method tabs */}
      <div className="flex w-full max-w-lg border-b border-gray-200 mb-8">
        {methodTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMethod(key)}
            className={`flex-1 pb-3 font-work-sans text-sm font-medium transition-colors relative ${
              method === key ? "text-[#181D27]" : "text-[#9CA3AF] hover:text-[#414651]"
            }`}
          >
            {label}
            {method === key && (
              <motion.div
                layoutId="payment-method-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#181D27]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {method === "card" && (
            <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <CardForm />
            </motion.div>
          )}
          {method === "googlepay" && (
            <motion.div key="googlepay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <GooglePayForm />
            </motion.div>
          )}
          {method === "bank" && (
            <motion.div key="bank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <BankForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

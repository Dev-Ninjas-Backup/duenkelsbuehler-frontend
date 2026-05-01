"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";
import { useCreateVerifSession } from "@/hooks/verif/use-verif";
import { useGetMe } from "@/hooks/auth/use-auth";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white";
const labelCls = "font-work-sans text-xs font-medium text-[#414651]";

export function UploadStep({ onNext }: { onNext: () => void }) {
  const { mutate: createSession, isPending, error } = useCreateVerifSession();
  const { data: me } = useGetMe();

  const nameParts = me?.name?.split(" ") ?? [];
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") ?? "");
  const [email, setEmail] = useState(me?.email ?? "");
  const [idNumber, setIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("M");
  const [docNumber, setDocNumber] = useState("");
  const [docType, setDocType] = useState<"PASSPORT" | "ID_CARD" | "DRIVERS_LICENSE" | "RESIDENCE_PERMIT">("PASSPORT");
  const [country, setCountry] = useState("");

  const canSubmit = firstName && lastName && email && idNumber && dateOfBirth && docNumber && country;

  const handleStart = () => {
    createSession(
      {
        verification: {
          callback: `${window.location.origin}/sp/verify-account`,
          person: { firstName, lastName, email, idNumber, dateOfBirth, gender },
          document: { number: docNumber, type: docType, country },
        },
      },
      {
        onSuccess: (data) => {
          if (data?.url) {
            window.location.href = data.url;
          }
        },
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col items-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      <p className="font-work-sans text-sm text-[#414651] text-center mb-6">
        Please fill in your details to start identity verification with{" "}
        <span className="font-semibold text-[#181D27]">Veriff</span>.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col gap-4 mb-6"
      >
        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>First Name *</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Last Name *</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className={inputCls} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>ID Number *</label>
            <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="123456789" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Date of Birth *</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} title="Date of Birth" className={inputCls} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Gender *</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} aria-label="Gender" className={inputCls}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {/* Document Info */}
        <div className="h-px bg-gray-100" />
        <p className="font-work-sans text-xs font-bold text-[#181D27]">Document Information</p>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Document Type *</label>
          <select value={docType} onChange={(e) => setDocType(e.target.value as any)} aria-label="Document type" className={inputCls}>
            <option value="PASSPORT">Passport</option>
            <option value="ID_CARD">ID Card</option>
            <option value="DRIVERS_LICENSE">Driver's License</option>
            <option value="RESIDENCE_PERMIT">Residence Permit</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Document Number *</label>
            <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="A1234567" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Country Code *</label>
            <input value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} placeholder="US" maxLength={2} className={inputCls} />
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
          <p className="font-work-sans text-sm text-red-600">{(error as Error).message}</p>
        </div>
      )}

      <Button
        onClick={handleStart}
        disabled={isPending || !canSubmit}
        className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base disabled:opacity-60"
      >
        {isPending ? "Starting verification..." : "Start Verification"}
      </Button>

      <button onClick={onNext} className="mt-4 font-work-sans text-sm text-[#9CA3AF] underline underline-offset-2">
        I have already verified — skip
      </button>
    </div>
  );
}

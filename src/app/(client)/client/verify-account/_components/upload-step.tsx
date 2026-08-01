"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";
import { useCreateVerifSession } from "@/hooks/verif/use-verif";
import { useGetMe } from "@/hooks/auth/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white cursor-pointer";
const labelCls = "font-work-sans text-xs font-medium text-[#414651]";

const verifSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name should contain only letters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name should contain only letters"),
  email: z.string().trim().email("Enter a valid email address"),
  idNumber: z
    .string()
    .trim()
    .min(4, "ID number must be at least 4 characters")
    .max(30, "ID number is too long")
    .regex(/^[a-zA-Z0-9-]+$/, "ID number may contain only letters, numbers A-Z, 0-9 and hyphens (no spaces)"),
  dateOfBirth: z
    .string()
    .min(1, "Date of Birth is required")
    .refine((dateStr) => {
      const birth = new Date(dateStr);
      if (isNaN(birth.getTime())) return false;
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age >= 18;
    }, "You must be at least 18 years old to verify your account"),
  gender: z.enum(["M", "F"]),
  docType: z.enum(["PASSPORT", "ID_CARD", "DRIVERS_LICENSE", "RESIDENCE_PERMIT"]),
  docNumber: z
    .string()
    .trim()
    .min(4, "Document number must be at least 4 characters")
    .max(30, "Document number is too long")
    .regex(/^[a-zA-Z0-9]+$/, "Document number may contain only letters and numbers A-Z, 0-9 (no spaces)"),
  country: z
    .string()
    .trim()
    .length(2, "Country code must be 2 letters (e.g. US, GB, BD, CA)")
    .regex(/^[A-Z]{2}$/, "Country code must contain 2 uppercase letters"),
});

export type VerifFormData = z.infer<typeof verifSchema>;

export function UploadStep({ onNext }: { onNext: () => void }) {
  const { mutate: createSession, isPending, error } = useCreateVerifSession();
  const { data: me } = useGetMe();

  const nameParts = me?.name?.split(" ") ?? [];
  const defaultFirstName = nameParts[0] ?? "";
  const defaultLastName = nameParts.slice(1).join(" ") ?? "";
  const defaultEmail = me?.email ?? "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifFormData>({
    resolver: zodResolver(verifSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      email: defaultEmail,
      idNumber: "",
      dateOfBirth: "",
      gender: "M",
      docType: "PASSPORT",
      docNumber: "",
      country: "",
    },
  });

  const { onChange: onDocNumberChange, ...docNumberRegister } = register("docNumber");
  const { onChange: onCountryChange, ...countryRegister } = register("country");

  useEffect(() => {
    if (me) {
      const parts = me.name?.split(" ") ?? [];
      reset({
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" ") ?? "",
        email: me.email ?? "",
        idNumber: "",
        dateOfBirth: "",
        gender: "M",
        docType: "PASSPORT",
        docNumber: "",
        country: "",
      });
    }
  }, [me, reset]);

  const handleFormSubmit = (data: VerifFormData) => {
    createSession(
      {
        verification: {
          person: {
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            email: data.email.trim(),
            idNumber: data.idNumber.trim(),
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
          },
          document: {
            number: data.docNumber.trim().toUpperCase(),
            type: data.docType,
            country: data.country.trim().toUpperCase(),
          },
        },
      },
      {
        onSuccess: (resData) => {
          const url = resData?.verification?.url;
          if (url) {
            window.location.href = url;
          } else {
            toast.error("Failed to obtain verification URL");
          }
        },
        onError: (err: any) => {
          toast.error(err?.message || "Verification creation failed");
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

      <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full flex flex-col gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col gap-4"
        >
          {/* Personal Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>First Name *</label>
              <input
                {...register("firstName")}
                placeholder="John"
                className={inputCls}
              />
              {errors.firstName && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.firstName.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Last Name *</label>
              <input
                {...register("lastName")}
                placeholder="Doe"
                className={inputCls}
              />
              {errors.lastName && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.lastName.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Email *</label>
            <input
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className={inputCls}
            />
            {errors.email && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>ID Number *</label>
              <input
                {...register("idNumber")}
                placeholder="123456789"
                className={inputCls}
              />
              {errors.idNumber && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.idNumber.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Date of Birth *</label>
              <input
                type="date"
                {...register("dateOfBirth")}
                title="Date of Birth"
                className={inputCls}
              />
              {errors.dateOfBirth && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.dateOfBirth.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Gender *</label>
            <select {...register("gender")} aria-label="Gender" className={inputCls}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            {errors.gender && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.gender.message}</p>}
          </div>

          {/* Document Info */}
          <div className="h-px bg-gray-100" />
          <p className="font-work-sans text-xs font-bold text-[#181D27]">Document Information</p>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Document Type *</label>
            <select {...register("docType")} aria-label="Document type" className={inputCls}>
              <option value="PASSPORT">Passport</option>
              <option value="ID_CARD">ID Card</option>
              <option value="DRIVERS_LICENSE">Driver's License</option>
              <option value="RESIDENCE_PERMIT">Residence Permit</option>
            </select>
            {errors.docType && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.docType.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Document Number *</label>
              <input
                {...docNumberRegister}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  onDocNumberChange(e);
                }}
                placeholder="A1234567"
                className={inputCls}
              />
              {errors.docNumber && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.docNumber.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Country Code *</label>
              <input
                {...countryRegister}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  onCountryChange(e);
                }}
                placeholder="US"
                maxLength={2}
                className={inputCls}
              />
              {errors.country && <p className="font-work-sans text-xs text-red-500 font-medium">● {errors.country.message}</p>}
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 mt-2">
            <p className="font-work-sans text-xs text-red-600 font-medium">{(error as Error).message}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base disabled:opacity-60 cursor-pointer mt-2"
        >
          {isPending ? "Starting verification..." : "Start Verification"}
        </Button>
      </form>

      <button onClick={onNext} className="mt-2 font-work-sans text-sm text-[#9CA3AF] underline underline-offset-2 cursor-pointer">
        I have already verified — skip
      </button>
    </div>
  );
}

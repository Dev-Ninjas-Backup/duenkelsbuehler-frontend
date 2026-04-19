"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { OTPInput } from "@/components/ui/otp-input";
import {
  useSendForgotPasswordOtp,
  useVerifyForgotPasswordOtp,
  useResetPasswordWithOtp,
} from "@/hooks/auth/use-auth";

const step1Schema = z.object({ email: z.string().email("Invalid email address") });
const step2Schema = z.object({ otp: z.string().length(6, "OTP must be 6 digits") });
const step3Schema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { mutate: sendOtp, isPending: isSending, error: sendError } = useSendForgotPasswordOtp();
  const { mutate: verifyOtp, isPending: isVerifying, error: verifyError } = useVerifyForgotPasswordOtp();
  const { mutate: resetPassword, isPending: isResetting, error: resetError } = useResetPasswordWithOtp();

  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const step2Form = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });
  const step3Form = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  const onStep1Submit = (data: Step1Data) => {
    sendOtp({ email: data.email }, {
      onSuccess: () => {
        setEmail(data.email);
        setStep(2);
      },
    });
  };

  const onStep2Submit = (data: Step2Data) => {
    verifyOtp({ email, otp: data.otp }, {
      onSuccess: () => {
        setOtp(data.otp);
        setStep(3);
      },
    });
  };

  const onStep3Submit = (data: Step3Data) => {
    resetPassword({ email, otp, newPassword: data.newPassword });
  };

  const stepTitles = { 1: "Forgot Password", 2: "Verify OTP", 3: "New Password" };
  const stepSubtitles = {
    1: "Enter your email to receive an OTP",
    2: `Enter the OTP sent to ${email}`,
    3: "Set your new password",
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-[400px] max-w-full">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="font-rozha text-5xl sm:text-6xl font-normal text-[#181D27] mb-3">
          {stepTitles[step]}
        </h1>
        <p className="font-work-sans text-sm text-[#414651]">{stepSubtitles[step]}</p>
      </motion.div>

      {/* Step 1 — Email */}
      {step === 1 && (
        <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-5">
          {sendError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">{sendError.message}</p>
            </div>
          )}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label className="font-work-sans font-bold text-sm text-[#181D27]">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              {...step1Form.register("email")}
              type="email"
              placeholder="Enter your email"
              className="h-12 rounded-xl border-gray-200 font-work-sans"
            />
            {step1Form.formState.errors.email && (
              <p className="font-work-sans text-xs text-red-500">● {step1Form.formState.errors.email.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isSending}
              className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
            >
              {isSending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center">
            <Link href="/login" className="font-work-sans text-sm text-[#414651] hover:underline">
              ← Back to Login
            </Link>
          </motion.div>
        </form>
      )}

      {/* Step 2 — OTP */}
      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
          {verifyError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">{verifyError.message}</p>
            </div>
          )}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label className="font-work-sans font-bold text-sm text-[#181D27]">
              Enter OTP <span className="text-red-500">*</span>
            </Label>
            <OTPInput length={6} onChange={(val) => step2Form.setValue("otp", val)} />
            {step2Form.formState.errors.otp && (
              <p className="font-work-sans text-xs text-red-500">● {step2Form.formState.errors.otp.message}</p>
            )}
          </motion.div>
          <Button
            type="submit"
            disabled={isVerifying}
            className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
          <button type="button" onClick={() => setStep(1)} className="w-full font-work-sans text-sm text-[#414651] hover:underline">
            ← Back
          </button>
        </form>
      )}

      {/* Step 3 — New Password */}
      {step === 3 && (
        <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-5">
          {resetError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">{resetError.message}</p>
            </div>
          )}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label className="font-work-sans font-bold text-sm text-[#181D27]">
              New Password <span className="text-red-500">*</span>
            </Label>
            <PasswordInput
              {...step3Form.register("newPassword")}
              placeholder="Enter new password"
              className="h-12 rounded-xl border-gray-200 font-work-sans"
            />
            {step3Form.formState.errors.newPassword && (
              <p className="font-work-sans text-xs text-red-500">● {step3Form.formState.errors.newPassword.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label className="font-work-sans font-bold text-sm text-[#181D27]">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <PasswordInput
              {...step3Form.register("confirmPassword")}
              placeholder="Confirm new password"
              className="h-12 rounded-xl border-gray-200 font-work-sans"
            />
            {step3Form.formState.errors.confirmPassword && (
              <p className="font-work-sans text-xs text-red-500">● {step3Form.formState.errors.confirmPassword.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isResetting}
              className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </motion.div>
        </form>
      )}
    </motion.div>
  );
}

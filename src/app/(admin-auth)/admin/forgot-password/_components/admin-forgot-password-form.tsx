"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
const inputCls =
  "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";

export function AdminForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [otpExpiry, setOtpExpiry] = useState(600); // 10 minutes

  const { mutate: sendOtp, isPending: isSending, error: sendError } = useSendForgotPasswordOtp();
  const { mutate: verifyOtp, isPending: isVerifying, error: verifyError } = useVerifyForgotPasswordOtp();
  const { mutate: resetPassword, isPending: isResetting, error: resetError } = useResetPasswordWithOtp("/admin/login");

  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const step2Form = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });
  const step3Form = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  useEffect(() => {
    if (step !== 2) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setOtpExpiry((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  const handleResendOtp = () => {
    if (resendCooldown > 0 || isSending) return;
    sendOtp(
      { email },
      {
        onSuccess: (res) => {
          setResendCooldown(60);
          setOtpExpiry(600);
          toast.success(res.message || "A new OTP has been sent to your email!");
        },
      }
    );
  };

  const onStep1Submit = (data: Step1Data) => {
    sendOtp(
      { email: data.email },
      {
        onSuccess: (res) => {
          setEmail(data.email);
          setResendCooldown(60);
          setOtpExpiry(600);
          setStep(2);
          toast.success(res.message || "OTP has been sent to your email.");
        },
      }
    );
  };

  const onStep2Submit = (data: Step2Data) => {
    verifyOtp(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          setOtp(data.otp);
          setStep(3);
          toast.success("OTP verified successfully!");
        },
      }
    );
  };

  const onStep3Submit = (data: Step3Data) => {
    resetPassword(
      { email, otp, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Admin password reset successfully. Please log in.");
        },
      }
    );
  };

  const stepTitles = { 1: "Reset Password", 2: "Verify OTP", 3: "New Password" };
  const stepSubtitles = {
    1: "Enter your admin email to receive an OTP code",
    2: `Enter the 6-digit OTP sent to ${email}`,
    3: "Set your new admin password",
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-[400px] max-w-full">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="font-rozha text-4xl sm:text-5xl font-normal text-[#181D27] mb-2">
          {stepTitles[step]}
        </h1>
        <p className="font-work-sans text-xs sm:text-sm text-[#414651]">{stepSubtitles[step]}</p>
      </motion.div>

      {/* Step 1 — Email */}
      {step === 1 && (
        <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-5">
          {sendError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">{(sendError as Error).message}</p>
            </div>
          )}
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-bold text-[#181D27]">
              Admin Email Address <span className="text-red-500">*</span>
            </label>
            <input
              {...step1Form.register("email")}
              type="email"
              placeholder="Enter your admin email"
              className={inputCls}
            />
            {step1Form.formState.errors.email && (
              <p className="font-work-sans text-xs text-red-500">● {step1Form.formState.errors.email.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isSending}
              className="w-full h-14 rounded-full bg-[#181D27] text-white font-work-sans font-semibold text-base hover:bg-[#181D27]/90 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center mt-3">
            <Link href="/admin/login" className="font-work-sans text-sm text-[#414651] hover:underline font-medium">
              ← Back to Admin Login
            </Link>
          </motion.div>
        </form>
      )}

      {/* Step 2 — OTP */}
      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
          {verifyError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">{(verifyError as Error).message}</p>
            </div>
          )}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label className="font-work-sans text-sm font-bold text-[#181D27]">
              Enter 6-Digit OTP <span className="text-red-500">*</span>
            </label>
            <OTPInput length={6} onChange={(val) => step2Form.setValue("otp", val)} />
            {step2Form.formState.errors.otp && (
              <p className="font-work-sans text-xs text-red-500">● {step2Form.formState.errors.otp.message}</p>
            )}

            {/* Countdown Timer & Resend OTP */}
            <div className="flex items-center justify-between text-xs font-work-sans text-[#414651] mt-1 px-0.5">
              <span>
                OTP expires in:{" "}
                <strong className="font-semibold text-[#181D27]">
                  {Math.floor(otpExpiry / 60)}:{String(otpExpiry % 60).padStart(2, "0")}
                </strong>
              </span>
              {resendCooldown > 0 ? (
                <span className="text-[#9CA3AF]">
                  Resend in <strong className="font-semibold">{resendCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSending}
                  className="text-[#181D27] font-bold hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isSending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </motion.div>

          <Button
            type="submit"
            disabled={isVerifying}
            className="w-full h-14 rounded-full bg-[#181D27] text-white font-work-sans font-semibold text-base hover:bg-[#181D27]/90 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full font-work-sans text-sm text-[#414651] hover:underline font-medium cursor-pointer"
          >
            ← Back to Email
          </button>
        </form>
      )}

      {/* Step 3 — New Password */}
      {step === 3 && (
        <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-5">
          {resetError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">{(resetError as Error).message}</p>
            </div>
          )}
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-bold text-[#181D27]">
              New Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...step3Form.register("newPassword")}
              placeholder="Enter new password (min 6 chars)"
              className={inputCls}
            />
            {step3Form.formState.errors.newPassword && (
              <p className="font-work-sans text-xs text-red-500">● {step3Form.formState.errors.newPassword.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-bold text-[#181D27]">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...step3Form.register("confirmPassword")}
              placeholder="Confirm new password"
              className={inputCls}
            />
            {step3Form.formState.errors.confirmPassword && (
              <p className="font-work-sans text-xs text-red-500">● {step3Form.formState.errors.confirmPassword.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isResetting}
              className="w-full h-14 rounded-full bg-[#181D27] text-white font-work-sans font-semibold text-base hover:bg-[#181D27]/90 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </motion.div>
        </form>
      )}
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { OTPInput } from "@/components/ui/otp-input";
import { useSendOtp, useVerifyOtp, useCompleteRegistration } from "@/hooks/auth/use-signup";
import { useFirebaseSocialLogin } from "@/hooks/auth/use-firebase-social-login";

const step1Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CLIENT", "SERVICE_PROVIDER"]),
  acceptTerms: z.boolean().refine((v) => v === true, "You must accept the terms"),
});

const step2Schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function SignUpForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [registrationData, setRegistrationData] = useState<Step1Data | null>(null);

  const { mutate: sendOtp, isPending: isSendingOtp, error: sendOtpError } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp, error: verifyOtpError } = useVerifyOtp();
  const { mutate: completeRegistration, isPending: isCompleting, error: completeError } = useCompleteRegistration();
  const { loginWithGoogle, loginWithApple, isPending: isSocialPending, error: socialError } = useFirebaseSocialLogin();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { role: "CLIENT", acceptTerms: false },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  const selectedRole = step1Form.watch("role");

  const onStep1Submit = (data: Step1Data) => {
    sendOtp(
      { email: data.email, name: data.name, password: data.password, role: data.role },
      {
        onSuccess: () => {
          setRegistrationData(data);
          setStep(2);
        },
      }
    );
  };

  const onStep2Submit = (data: Step2Data) => {
    if (!registrationData) return;
    verifyOtp(
      { email: registrationData.email, otp: data.otp },
      {
        onSuccess: () => {
          completeRegistration({
            email: registrationData.email,
            password: registrationData.password,
          });
        },
      }
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-[400px] max-w-full">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="font-rozha text-5xl sm:text-6xl font-normal text-[#181D27] mb-3">
          {step === 1 ? "Sign Up!" : "Verify Email"}
        </h1>
        <p className="font-work-sans text-sm text-[#414651]">
          {step === 1 ? "Get ready to do business" : `Enter the OTP sent to ${registrationData?.email}`}
        </p>
      </motion.div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <>
          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <Button type="button" variant="outline" disabled={isSocialPending}
              onClick={() => loginWithGoogle(step1Form.getValues("role") || "CLIENT")}
              className="w-full h-12 rounded-full font-work-sans text-sm font-medium border-gray-300 hover:bg-gray-50 gap-3 disabled:opacity-60">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isSocialPending ? "Signing up..." : "Sign up with Google"}
            </Button>
            <Button type="button" disabled={isSocialPending}
              onClick={() => loginWithApple(step1Form.getValues("role") || "CLIENT")}
              className="w-full h-12 rounded-full font-work-sans text-sm font-medium bg-[#181D27] hover:bg-[#181D27]/90 gap-3 disabled:opacity-60">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              {isSocialPending ? "Signing up..." : "Sign up with Apple"}
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="font-work-sans text-sm text-[#414651]">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {socialError && (
              <p className="font-work-sans text-sm text-red-600 text-center">{socialError}</p>
            )}
          </div>

          {/* Step 1 Form */}
          <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-5">
            {/* Role Selector */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              {([
                { value: "SERVICE_PROVIDER", label: "Service Provider" },
                { value: "CLIENT", label: "Client" },
              ] as const).map(({ value, label }) => (
                <button key={value} type="button" onClick={() => step1Form.setValue("role", value)}
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 font-work-sans text-sm font-medium transition-all ${
                    selectedRole === value ? "border-[#181D27] bg-[#181D27]/5" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <FaUser className="h-6 w-6 text-[#181D27] shrink-0" />
                  {label}
                </button>
              ))}
            </motion.div>

            {sendOtpError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-work-sans text-sm text-red-600">{sendOtpError.message}</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-2">
              <Label className="font-work-sans font-bold text-sm text-[#181D27]">Full Name <span className="text-red-500">*</span></Label>
              <Input {...step1Form.register("name")} placeholder="Enter your full name" className="h-12 rounded-xl border-gray-200 font-work-sans" />
              {step1Form.formState.errors.name && (
                <p className="font-work-sans text-xs text-red-500">● {step1Form.formState.errors.name.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label className="font-work-sans font-bold text-sm text-[#181D27]">Email <span className="text-red-500">*</span></Label>
              <Input {...step1Form.register("email")} type="email" placeholder="Enter your email" className="h-12 rounded-xl border-gray-200 font-work-sans" />
              {step1Form.formState.errors.email && (
                <p className="font-work-sans text-xs text-red-500">● {step1Form.formState.errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label className="font-work-sans font-bold text-sm text-[#181D27]">Password <span className="text-red-500">*</span></Label>
              <PasswordInput {...step1Form.register("password")} placeholder="Enter your password" className="h-12 rounded-xl border-gray-200 font-work-sans" />
              {step1Form.formState.errors.password && (
                <p className="font-work-sans text-xs text-red-500">● {step1Form.formState.errors.password.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <input {...step1Form.register("acceptTerms")} type="checkbox" id="acceptTerms"
                className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#181D27] cursor-pointer" />
              <label htmlFor="acceptTerms" className="font-work-sans text-xs text-[#414651] leading-relaxed cursor-pointer">
                By clicking &quot;Sign Up&quot; you accept our{" "}
                <Link href="/terms" className="font-bold text-[#181D27] hover:underline">Terms</Link>
                {" and "}
                <Link href="/privacy" className="font-bold text-[#181D27] hover:underline">Privacy Policy</Link>
              </label>
            </motion.div>
            {step1Form.formState.errors.acceptTerms && (
              <p className="font-work-sans text-xs text-red-500">● {step1Form.formState.errors.acceptTerms.message}</p>
            )}

            <motion.div variants={itemVariants}>
              <Button type="submit" disabled={isSendingOtp}
                className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base mt-2">
                {isSendingOtp ? "Sending OTP..." : "Sign up"}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <p className="font-work-sans text-sm text-[#414651]">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-[#181D27] hover:underline">Log in!</Link>
              </p>
            </motion.div>
          </form>
        </>
      )}

      {/* ── STEP 2: OTP ── */}
      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
          {(verifyOtpError || completeError) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">
                {verifyOtpError?.message || completeError?.message}
              </p>
            </motion.div>
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

          <Button type="submit" disabled={isVerifyingOtp || isCompleting}
            className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base">
            {isVerifyingOtp || isCompleting ? "Verifying..." : "Verify & Complete"}
          </Button>

          <button type="button" onClick={() => setStep(1)}
            className="w-full font-work-sans text-sm text-[#414651] hover:underline">
            ← Back
          </button>
        </form>
      )}
    </motion.div>
  );
}

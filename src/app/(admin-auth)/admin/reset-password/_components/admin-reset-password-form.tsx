"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useResetPassword } from "@/hooks/auth/use-auth";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

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

export function AdminResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: resetPassword, isPending, error } = useResetPassword("/admin/login");

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordData) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    resetPassword(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Admin password reset successful. Please log in.");
        },
      }
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-[400px] max-w-full">
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="font-rozha text-4xl sm:text-5xl font-normal text-[#181D27] mb-2">
          New Password
        </h1>
        <p className="font-work-sans text-xs sm:text-sm text-[#414651]">
          Set your new password for your admin account
        </p>
      </motion.div>

      {!token ? (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center space-y-3">
          <p className="font-work-sans text-sm text-red-600 font-semibold">
            Invalid or missing reset token in link URL.
          </p>
          <Link
            href="/admin/forgot-password"
            className="inline-block font-work-sans text-xs text-[#181D27] hover:underline font-bold"
          >
            ← Request a new reset code
          </Link>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-work-sans text-sm text-red-600">{(error as Error).message}</p>
            </div>
          )}
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-bold text-[#181D27]">
              New Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...form.register("newPassword")}
              placeholder="Enter new password (min 6 chars)"
              className={inputCls}
            />
            {form.formState.errors.newPassword && (
              <p className="font-work-sans text-xs text-red-500">● {form.formState.errors.newPassword.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-bold text-[#181D27]">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...form.register("confirmPassword")}
              placeholder="Confirm new password"
              className={inputCls}
            />
            {form.formState.errors.confirmPassword && (
              <p className="font-work-sans text-xs text-red-500">● {form.formState.errors.confirmPassword.message}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 rounded-full bg-[#181D27] text-white font-work-sans font-semibold text-base hover:bg-[#181D27]/90 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center mt-3">
            <Link href="/admin/login" className="font-work-sans text-sm text-[#414651] hover:underline font-medium">
              ← Back to Admin Login
            </Link>
          </motion.div>
        </form>
      )}
    </motion.div>
  );
}

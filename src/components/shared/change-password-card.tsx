"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, ShieldAlert } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useChangePassword, useGetMe } from "@/hooks/auth/use-auth";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordCardProps {
  provider?: string | null;
}

export function ChangePasswordCard({ provider: propProvider }: ChangePasswordCardProps) {
  const { data: user } = useGetMe();
  const { mutate: changePassword, isPending, error } = useChangePassword();

  const provider = propProvider ?? user?.PROVIDER;
  const isSocialLogin = provider === "GOOGLE" || provider === "APPLE";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: (res: { message?: string }) => {
          toast.success(res?.message || "Password changed successfully!");
          reset();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to change password. Please check your current password.");
        },
      }
    );
  };

  if (isSocialLogin) {
    return (
      <div className="pt-4 border-t border-gray-100 mt-2">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="font-work-sans text-xs leading-relaxed">
            Password change is not available because your account was created using social sign-in (<strong>{provider}</strong>).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 border-t border-gray-100 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#181D27]" />
          <h4 className="font-work-sans font-bold text-sm text-[#181D27]">Change Password</h4>
        </div>
        <span className="font-work-sans text-[11px] text-[#9CA3AF]">Min 6 characters</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2.5 rounded-lg bg-red-50 border border-red-200">
            <p className="font-work-sans text-xs text-red-600">{(error as Error).message}</p>
          </motion.div>
        )}

        {/* Current Password */}
        <div className="space-y-1">
          <label className="font-work-sans font-bold text-[12px] text-[#181D27]">
            Current Password <span className="text-red-500">*</span>
          </label>
          <PasswordInput
            {...register("currentPassword")}
            placeholder="Enter current password"
            className="h-10 rounded-xl border-gray-200 font-work-sans text-xs"
          />
          {errors.currentPassword && (
            <p className="font-work-sans text-[11px] text-red-500">● {errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-work-sans font-bold text-[12px] text-[#181D27]">
              New Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register("newPassword")}
              placeholder="Enter new password"
              className="h-10 rounded-xl border-gray-200 font-work-sans text-xs"
            />
            {errors.newPassword && (
              <p className="font-work-sans text-[11px] text-red-500">● {errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-work-sans font-bold text-[12px] text-[#181D27]">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              className="h-10 rounded-xl border-gray-200 font-work-sans text-xs"
            />
            {errors.confirmPassword && (
              <p className="font-work-sans text-[11px] text-red-500">● {errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 px-6 rounded-full bg-[#181D27] text-white font-work-sans font-semibold text-xs hover:bg-[#181D27]/90 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetMe, useUpdateProfilePicture, useLogout } from "@/hooks/auth/use-auth";
import { ChangePasswordCard } from "@/components/shared/change-password-card";

const readonlyCls =
  "w-full h-11 border border-gray-100 rounded-xl px-4 font-work-sans text-[13px] text-[#9CA3AF] bg-gray-50 cursor-not-allowed";

export default function AdminSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading } = useGetMe();
  const logout = useLogout();

  const { mutate: updateProfilePicture, isPending: isUploading } = useUpdateProfilePicture();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateProfilePicture(file, {
      onSuccess: () => {
        toast.success("Profile picture updated successfully!");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to upload profile picture");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-work-sans text-sm text-[#414651]">Loading admin profile...</span>
      </div>
    );
  }

  const nameParts = user?.name?.split(" ") ?? [];
  const firstName = nameParts[0] ?? "Admin";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  return (
    <div className="flex flex-col h-full px-4 sm:px-6 lg:px-8 py-6 gap-8 overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] leading-none"
      >
        Admin Settings & Profile
      </motion.h1>

      {/* Admin Profile Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="max-w-5xl w-full bg-white rounded-[24px] border border-gray-100/80 p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10 shadow-xs"
      >
        {/* Left: Avatar */}
        <div className="flex flex-col items-center w-full lg:w-[260px] shrink-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-10 border-b lg:border-b-0">
          <h3 className="font-rozha text-xl text-[#181D27] mb-4 hidden lg:block text-center">
            Profile Picture
          </h3>
          <div className="relative mb-5 w-28 h-28 lg:w-32 lg:h-32">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-[#181D27] flex items-center justify-center relative">
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white backdrop-blur-[1px] z-10">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Admin Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="font-rozha text-4xl text-white">
                  {user?.name?.charAt(0).toUpperCase() ?? "A"}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              title="Upload profile picture"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </div>
          <p className="font-work-sans text-[13px] text-[#535862] mb-5 text-center">
            Admin Profile Avatar
          </p>
          <div className="flex flex-col items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-10 px-5 rounded-full bg-[#181D27] text-white font-work-sans text-[13px] font-semibold hover:bg-[#181D27]/90 disabled:opacity-60 transition-colors shadow-sm w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUploading ? "Uploading..." : "Upload new photo"}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="h-10 px-5 rounded-full border border-red-200 text-red-500 font-work-sans text-[13px] font-semibold hover:bg-red-50 transition-colors w-full cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col flex-1 w-full gap-5">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="font-work-sans text-[13px] font-bold text-[#181D27]">First Name</label>
              <input readOnly value={firstName} title="First Name" className={readonlyCls} />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="font-work-sans text-[13px] font-bold text-[#181D27]">Last Name</label>
              <input readOnly value={lastName} title="Last Name" className={readonlyCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-[13px] font-bold text-[#181D27]">Email Address</label>
            <input readOnly value={user?.email ?? ""} title="Email" className={readonlyCls} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-[13px] font-bold text-[#181D27]">Role</label>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#181D27] font-work-sans text-[13px] text-white font-semibold">
                ADMIN
              </span>
            </div>
          </div>

          {/* Compact Change Password Component */}
          <ChangePasswordCard provider={user?.PROVIDER} />
        </div>
      </motion.div>
    </div>
  );
}

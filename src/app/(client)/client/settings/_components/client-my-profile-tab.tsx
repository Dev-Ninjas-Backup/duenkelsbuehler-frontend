"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGetMe } from "@/hooks/auth/use-auth";
import { useAuthStore } from "@/stores/auth/use-auth-store";

const readonlyCls = "w-full h-11 border border-gray-100 rounded-xl px-4 font-work-sans text-[13px] text-[#9CA3AF] bg-gray-50 cursor-not-allowed";

export function ClientMyProfileTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading } = useGetMe();
  const { clearAuth } = useAuthStore();

  const nameParts = user?.name?.split(" ") ?? [];
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
      </div>
    );
  }

  return (
    <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto w-full pt-2">
      <div className="bg-white rounded-[24px] border border-gray-100/80 p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10">

        {/* Left: Avatar */}
        <div className="flex flex-col items-center w-full lg:w-[260px] shrink-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-10 border-b lg:border-b-0">
          <h3 className="font-rozha text-xl text-[#181D27] mb-4 hidden lg:block text-center">Profile Picture</h3>
          <div className="relative mb-5 w-28 h-28 lg:w-32 lg:h-32">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-[#181D27] flex items-center justify-center">
              <span className="font-rozha text-4xl text-white">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" title="Upload profile picture" className="hidden" />
          </div>
          <p className="font-work-sans text-[13px] text-[#535862] mb-5 text-center">
            This is your identity on AristoAccess.
          </p>
          <div className="flex flex-col items-center gap-3 w-full">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="h-10 px-5 rounded-full bg-[#181D27] text-white font-work-sans text-[13px] font-semibold hover:bg-[#181D27]/90 transition-colors shadow-sm w-full">
              Upload new photo
            </button>
            <button type="button" onClick={() => clearAuth()}
              className="h-10 px-5 rounded-full border border-red-200 text-red-500 font-work-sans text-[13px] font-semibold hover:bg-red-50 transition-colors w-full">
              Logout
            </button>
          </div>
        </div>

        {/* Right: Info */}
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
              {user?.role?.map((r) => (
                <span key={r} className="px-3 py-1 rounded-full bg-gray-100 font-work-sans text-[13px] text-[#414651]">{r}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-[13px] font-bold text-[#181D27]">Identity Verified</label>
            <input readOnly
              value={user?.isIdentityVerified ? "Verified ✓" : "Not Verified"}
              title="Identity Verified"
              className={`${readonlyCls} ${user?.isIdentityVerified ? "text-green-600" : "text-red-500"}`}
            />
          </div>

          <div className="flex justify-end pt-5 mt-2 border-t border-gray-100">
            <p className="font-work-sans text-[13px] text-[#9CA3AF]">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

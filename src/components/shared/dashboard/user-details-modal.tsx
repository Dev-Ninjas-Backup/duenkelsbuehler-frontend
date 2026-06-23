"use client";

import { motion } from "framer-motion";
import {
  X,
  Mail,
  Shield,
  Calendar,
  Fingerprint,
  Globe,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ProviderIcon } from "@/components/shared/provider-icons";
import type { AdminUser } from "@/types/admin";

interface UserDetailsModalProps {
  user: AdminUser;
  onClose: () => void;
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#090d16]/50 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100/80 flex flex-col relative"
      >
        {/* Top Accent Gradient Header Banner */}
        <div className="bg-gradient-to-tr from-[#181D27] via-[#242c3b] to-[#343e52] h-28 w-full relative">
          {/* Sparkles / Subtle lights */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm transition-all focus:outline-none hover:rotate-90 duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile Avatar Container */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#181D27] to-[#2c3547] border-4 border-white shadow-lg flex items-center justify-center">
            <span className="font-rozha text-3xl text-white select-none">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="pt-12 px-6 pb-7 flex flex-col gap-5">
          {/* Profile Name & Contact */}
          <div className="text-center flex flex-col gap-1">
            <h3 className="font-rozha text-2xl text-[#181D27] font-semibold tracking-wide">
              {user.name}
            </h3>
            <p className="font-work-sans text-sm text-slate-500 flex items-center justify-center gap-1.5">
              <Mail size={13} className="text-slate-400" />
              {user.email}
            </p>
          </div>

          {/* Verification Statuses Widget */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
            {/* Email Verification Box */}
            <div className="flex flex-col gap-0.5 items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
              <span className="font-work-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Email Status
              </span>
              {user.isEmailVerified ? (
                <span className="flex items-center gap-1 font-work-sans text-xs text-emerald-600 font-semibold mt-1">
                  <CheckCircle2 size={13} className="text-emerald-500" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 font-work-sans text-xs text-amber-600 font-semibold mt-1">
                  <AlertCircle size={13} className="text-amber-500" /> Unverified
                </span>
              )}
            </div>

            {/* Identity Verification Box */}
            <div className="flex flex-col gap-0.5 items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
              <span className="font-work-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Identity Verified
              </span>
              {user.isIdentityVerified ? (
                <span className="flex items-center gap-1 font-work-sans text-xs text-emerald-600 font-semibold mt-1">
                  <CheckCircle2 size={13} className="text-emerald-500" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 font-work-sans text-xs text-amber-600 font-semibold mt-1">
                  <AlertCircle size={13} className="text-amber-500" /> Unverified
                </span>
              )}
            </div>
          </div>

          {/* Metadata Rows */}
          <div className="flex flex-col gap-2.5">
            {/* Role Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
              <span className="font-work-sans text-sm text-slate-500 flex items-center gap-2">
                <Shield size={15} className="text-slate-400" />
                Role
              </span>
              <div className="flex items-center gap-1 flex-wrap justify-end">
                {user.role?.map((r) => (
                  <span
                    key={r}
                    className="font-work-sans text-xs font-semibold bg-[#181D27]/5 text-[#181D27] border border-[#181D27]/10 px-2.5 py-0.5 rounded-full uppercase"
                  >
                    {r === "SERVICE_PROVIDER" ? "Service Provider" : r}
                  </span>
                ))}
              </div>
            </div>

            {/* Country Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
              <span className="font-work-sans text-sm text-slate-500 flex items-center gap-2">
                <Globe size={15} className="text-slate-400" />
                Country
              </span>
              <span className="font-work-sans text-sm font-semibold text-[#181D27]">
                {user.country || "Not Specified"}
              </span>
            </div>

            {/* Login Provider Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
              <span className="font-work-sans text-sm text-slate-500 flex items-center gap-2">
                <Fingerprint size={15} className="text-slate-400" />
                Sign In Method
              </span>
              <div className="flex items-center gap-1.5">
                <ProviderIcon firebaseUid={user.firebaseUid} provider={user.PROVIDER} />
                <span className="font-work-sans text-sm font-semibold text-[#181D27] capitalize">
                  {user.PROVIDER?.toLowerCase() || (user.firebaseUid ? "Social Auth" : "Email")}
                </span>
              </div>
            </div>

            {/* Member Since Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
              <span className="font-work-sans text-sm text-slate-500 flex items-center gap-2">
                <Calendar size={15} className="text-slate-400" />
                Member Since
              </span>
              <span className="font-work-sans text-sm font-semibold text-[#181D27]">
                {new Date(user.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

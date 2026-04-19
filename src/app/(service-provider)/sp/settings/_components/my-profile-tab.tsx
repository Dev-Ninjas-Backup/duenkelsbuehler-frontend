"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetMe } from "@/hooks/auth/use-auth";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import { useCreateServiceProvider, useAllServiceProviders } from "@/hooks/sp/use-sp";

const inputCls = "w-full h-11 border border-gray-200 rounded-xl px-4 font-work-sans text-[13px] text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";
const readonlyCls = "w-full h-11 border border-gray-100 rounded-xl px-4 font-work-sans text-[13px] text-[#9CA3AF] bg-gray-50 cursor-not-allowed";

export function MyProfileTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading } = useGetMe();
  const { clearAuth } = useAuthStore();
  const { data: allSPs = [] } = useAllServiceProviders();
  const { mutate: createSP, isPending: isCreating } = useCreateServiceProvider();

  const nameParts = user?.name?.split(" ") ?? [];
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  // Check if SP profile exists
  const spProfile = allSPs.find((sp) => sp.userId === user?.id);
  const hasSpProfile = !!spProfile;

  // SP profile form state
  const [spForm, setSpForm] = useState({
    Fullname: user?.name ?? "",
    occupation: "",
    description: "",
    location: "",
    phoneNumber: "",
    payementDetails: "",
  });

  useEffect(() => {
    if (user?.name) setSpForm((prev) => ({ ...prev, Fullname: user.name }));
  }, [user?.name]);

  const handleCreateSP = () => {
    if (!spForm.Fullname || !spForm.occupation || !spForm.description || !spForm.location || !spForm.phoneNumber || !spForm.payementDetails) return;
    createSP(spForm);
  };

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
      className="max-w-5xl mx-auto w-full pt-2 flex flex-col gap-6">

      {/* ── Account Info ── */}
      <div className="bg-white rounded-[24px] border border-gray-100/80 p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left: Avatar */}
        <div className="flex flex-col items-center w-full lg:w-[260px] shrink-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-10 border-b lg:border-b-0">
          <h3 className="font-rozha text-xl text-[#181D27] mb-4 hidden lg:block text-center">Profile Picture</h3>
          <div className="relative mb-5 w-28 h-28 lg:w-32 lg:h-32">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-[#181D27] flex items-center justify-center">
              <span className="font-rozha text-4xl text-white">{user?.name?.charAt(0).toUpperCase() ?? "?"}</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" title="Upload profile picture" className="hidden" />
          </div>
          <p className="font-work-sans text-[13px] text-[#535862] mb-5 text-center">
            This is your identity on AristoAccess.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="h-10 px-5 rounded-full bg-[#181D27] text-white font-work-sans text-[13px] font-semibold hover:bg-[#181D27]/90 transition-colors w-full">
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
            <label className="font-work-sans text-[13px] font-bold text-[#181D27]">Identity Verified</label>
            <input readOnly value={user?.isIdentityVerified ? "Verified ✓" : "Not Verified"} title="Identity Verified"
              className={`${readonlyCls} ${user?.isIdentityVerified ? "text-green-600" : "text-red-500"}`} />
          </div>
          <div className="flex justify-end pt-5 mt-2 border-t border-gray-100">
            <p className="font-work-sans text-[13px] text-[#9CA3AF]">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Service Provider Profile ── */}
      <div className="bg-white rounded-[24px] border border-gray-100/80 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-rozha text-xl text-[#181D27]">Service Provider Profile</h3>
          {hasSpProfile && (
            <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A] bg-[#16A34A]/10 px-3 py-1 rounded-full font-semibold">
              ✓ Profile Created
            </span>
          )}
        </div>

        {hasSpProfile ? (
          /* Show existing profile */
          <div className="flex flex-col gap-4">
            {[
              { label: "Full Name", value: spProfile.Fullname },
              { label: "Occupation", value: spProfile.occupation },
              { label: "Description", value: spProfile.description },
              { label: "Location", value: spProfile.location },
              { label: "Phone Number", value: spProfile.phoneNumber },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="font-work-sans text-[13px] font-bold text-[#181D27]">{label}</label>
                <input readOnly value={value ?? ""} title={label} className={readonlyCls} />
              </div>
            ))}
          </div>
        ) : (
          /* Create profile form */
          <div className="flex flex-col gap-4">
            <p className="font-work-sans text-sm text-[#9CA3AF]">
              Complete your service provider profile to get verified by admin.
            </p>
            {[
              { key: "Fullname", label: "Full Name", placeholder: "Your full name" },
              { key: "occupation", label: "Occupation", placeholder: "e.g. Corporate Lawyer" },
              { key: "description", label: "Description", placeholder: "Describe your services" },
              { key: "location", label: "Location", placeholder: "e.g. New York, USA" },
              { key: "phoneNumber", label: "Phone Number", placeholder: "+1 234 567 8900" },
              { key: "payementDetails", label: "Payment Details", placeholder: "Bank/payment info" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="font-work-sans text-[13px] font-bold text-[#181D27]">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input value={spForm[key as keyof typeof spForm]}
                  onChange={(e) => setSpForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder} title={label} className={inputCls} />
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button onClick={handleCreateSP} disabled={isCreating}
                className="h-11 px-8 rounded-full bg-[#181D27] text-white font-work-sans text-[13px] font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-60">
                {isCreating ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

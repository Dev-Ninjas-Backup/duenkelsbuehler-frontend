"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Image from "next/image";

const inputCls =
  "w-full h-11 border border-gray-200 rounded-xl px-4 font-work-sans text-[13px] text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";
const readonlyCls =
  "w-full h-11 border border-gray-100 rounded-xl px-4 font-work-sans text-[13px] text-[#9CA3AF] bg-gray-50 cursor-not-allowed";

export function ClientMyProfileTab() {
  const [avatarUrl, setAvatarUrl] = useState("/images/user/user_avatar.png");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    console.log("Saved:", { email, password });
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto w-full pt-2"
    >
      <div className="bg-white rounded-[24px] border border-gray-100/80 p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10">
        
        {/* Left column: Avatar Section */}
        <div className="flex flex-col items-center w-full lg:w-[260px] shrink-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-10 border-b lg:border-b-0">
          <h3 className="font-rozha text-xl text-[#181D27] mb-4 hidden lg:block text-center">Profile Picture</h3>
          <div className="relative mb-5 w-28 h-28 lg:w-32 lg:h-32">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-gray-100">
              <Image src={avatarUrl} alt="Profile avatar" width={128} height={128} className="object-cover w-full h-full" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" title="Upload profile picture" className="hidden" onChange={handleAvatarChange} />
          </div>
          <p className="font-work-sans text-[13px] text-[#535862] mb-5 text-center">
            This is your identity on AristoAccess. We recommend a professional, clear photo.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 px-5 rounded-full bg-[#181D27] text-white font-work-sans text-[13px] font-semibold hover:bg-[#181D27]/90 transition-colors shadow-sm w-full"
            >
              Upload new photo
            </button>
            <button
              type="button"
              className="h-10 px-5 rounded-full border border-gray-200 text-[#414651] font-work-sans text-[13px] font-semibold hover:bg-gray-50 transition-colors w-full"
              onClick={() => setAvatarUrl("/images/user/user_avatar.png")}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Right column: Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 w-full gap-5">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="font-work-sans text-[13px] font-bold text-[#181D27]">First Name</label>
              <input readOnly value="John" title="First Name" className={readonlyCls} />
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <label className="font-work-sans text-[13px] font-bold text-[#181D27]">Last Name</label>
              <input readOnly value="Doe" title="Last Name" className={readonlyCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-[13px] font-bold text-[#181D27]">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              title="Email"
              className={inputCls}
            />
          </div>

          <div className="pt-2">
            <h4 className="font-rozha text-lg text-[#181D27] mb-3">Security</h4>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="font-work-sans text-[13px] font-bold text-[#181D27]">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  title="New Password"
                  className={inputCls}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="font-work-sans text-[13px] font-bold text-[#181D27]">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  title="Confirm Password"
                  className={inputCls}
                />
              </div>
            </div>
            {error && <p className="font-work-sans text-xs text-red-500 mt-2">{error}</p>}
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-5 mt-2 border-t border-gray-100">
            <button
              type="submit"
              className="px-8 h-11 rounded-full bg-[#181D27] text-white font-work-sans text-[14px] font-semibold hover:bg-[#181D27]/90 transition-colors shadow-sm w-full sm:w-auto"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

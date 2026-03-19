"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Image from "next/image";

const inputCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";
const readonlyCls = "w-full h-12 border border-gray-100 rounded-xl px-4 font-work-sans text-sm text-[#9CA3AF] bg-gray-50 cursor-not-allowed";

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
      className="max-w-lg mx-auto w-full"
    >
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image src={avatarUrl} alt="Profile avatar" width={96} height={96} className="object-cover w-full h-full" />
          </div>
          <button
            type="button"
            aria-label="Edit profile picture"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#181D27] text-white flex items-center justify-center shadow-md hover:bg-[#181D27]/90 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" title="Upload profile picture" className="hidden" onChange={handleAvatarChange} />
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-8 h-10 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Edit
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">First Name</label>
          <input readOnly value="John" title="First Name" className={readonlyCls} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">Last Name</label>
          <input readOnly value="Doe" title="Last Name" className={readonlyCls} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            title="Email"
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            title="New Password"
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            title="Confirm Password"
            className={inputCls}
          />
          {error && <p className="font-work-sans text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}

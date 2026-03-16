"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Image from "next/image";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
type ProfileForm = z.infer<typeof profileSchema>;

const inputCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";

export function ClientMyProfileTab() {
  const [avatarUrl, setAvatarUrl] = useState("/images/logo/Logo2.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "" },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const onSubmit = (data: ProfileForm) => console.log("Profile saved:", data);

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
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#181D27] text-white flex items-center justify-center shadow-md hover:bg-[#181D27]/90 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-8 h-10 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Edit
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">
            First Name <span className="text-red-500">*</span>
          </label>
          <input {...register("firstName")} placeholder="Enter First Name" className={inputCls} />
          {errors.firstName && <p className="font-work-sans text-xs text-red-500">{errors.firstName.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input {...register("lastName")} placeholder="Enter Last Name" className={inputCls} />
          {errors.lastName && <p className="font-work-sans text-xs text-red-500">{errors.lastName.message}</p>}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </form>
    </motion.div>
  );
}

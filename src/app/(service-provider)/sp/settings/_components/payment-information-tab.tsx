"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export function PaymentInformationTab() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { businessName: "", businessEmail: "" },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoUrl(URL.createObjectURL(file));
  };

  const onSubmit = (data: FormData) => {
    console.log("Payment info saved:", data);
  };

  return (
    <motion.div
      key="information"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="max-w-lg mx-auto w-full"
    >
      <h2 className="font-rozha text-2xl text-[#181D27] text-center mb-6">Payment Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label className="font-work-sans font-bold text-sm text-[#181D27]">Business Name <span className="text-red-500">*</span></Label>
          <Input {...register("businessName")} placeholder="Enter First Name" className="h-12 rounded-xl border-gray-200 font-work-sans" aria-invalid={!!errors.businessName} />
          {errors.businessName && <p className="font-work-sans text-xs text-red-500">● {errors.businessName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="font-work-sans font-bold text-sm text-[#181D27]">Business Email Address <span className="text-red-500">*</span></Label>
          <Input {...register("businessEmail")} type="email" placeholder="Business E-mail Address" className="h-12 rounded-xl border-gray-200 font-work-sans" aria-invalid={!!errors.businessEmail} />
          {errors.businessEmail && <p className="font-work-sans text-xs text-red-500">● {errors.businessEmail.message}</p>}
        </div>

        {/* Logo Upload */}
        <div className="flex flex-col items-center gap-3 py-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => logoInputRef.current?.click()}
            className="w-14 h-14 rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-colors shadow-md overflow-hidden"
          >
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </motion.button>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          <p className="font-work-sans text-sm text-[#414651]">(Optional) Upload your business logo</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold px-8 h-12">Submit</Button>
        </div>
      </form>
    </motion.div>
  );
}

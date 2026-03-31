"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const industries = ["Accounting", "Engineering", "Legal", "Media", "Finance", "Technology", "Healthcare", "Education"];

const addServiceSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  description: z.string().min(10, "Description is too short"),
  location: z.string().min(1, "Location is required"),
});

export type AddServiceForm = z.infer<typeof addServiceSchema>;

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddServiceForm) => void;
  initialData?: AddServiceForm;
}

export function AddServiceModal({ open, onClose, onSubmit, initialData }: AddServiceModalProps) {
  const [industryOpen, setIndustryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddServiceForm>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: { industry: "", description: "", location: "" },
  });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ industry: "", description: "", location: "" });
      }
    }
  }, [open, initialData, reset]);

  const selectedIndustry = watch("industry");

  const handleClose = () => {
    setIndustryOpen(false);
    onClose();
  };

  const handleFormSubmit = (data: AddServiceForm) => {
    onSubmit(data);
    setIndustryOpen(false);
  };

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg bg-white rounded-[24px] p-8 shadow-2xl mx-4"
          >
            <h2 className="font-rozha text-3xl text-[#181D27] mb-1">
              {initialData ? "Edit Service" : "Add Service"}
            </h2>
            <div className="h-px bg-gray-200 mb-6" />

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
              {/* Industry Dropdown */}
              <div className="space-y-2">
                <label className="font-work-sans font-bold text-sm text-[#181D27]">
                  Select industry <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIndustryOpen((p) => !p)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 font-work-sans text-sm text-left flex items-center justify-between bg-white hover:border-gray-300 transition-colors"
                  >
                    <span className={selectedIndustry ? "text-[#181D27]" : "text-gray-400"}>
                      {selectedIndustry || "Select industry"}
                    </span>
                    <motion.div animate={{ rotate: industryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {industryOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                      >
                        {industries.map((ind) => (
                          <li
                            key={ind}
                            onClick={() => {
                              setValue("industry", ind, { shouldValidate: true });
                              setIndustryOpen(false);
                            }}
                            className={`px-4 py-3 font-work-sans text-sm cursor-pointer transition-colors hover:bg-gray-50 ${
                              selectedIndustry === ind ? "bg-gray-50 font-medium text-[#181D27]" : "text-[#414651]"
                            }`}
                          >
                            {ind}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                {errors.industry && (
                  <p className="font-work-sans text-xs text-red-500">● {errors.industry.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="font-work-sans font-bold text-sm text-[#181D27]">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Describe Your Services (10 characters min)."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-work-sans text-sm text-[#414651] placeholder:text-gray-400 resize-none focus:outline-none focus:border-gray-400 transition-colors"
                />
                {errors.description && (
                  <p className="font-work-sans text-xs text-red-500">● {errors.description.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="font-work-sans font-bold text-sm text-[#181D27]">
                  Enter Location <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("location")}
                  placeholder="Enter Location"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 font-work-sans text-sm text-[#414651] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                />
                {errors.location && (
                  <p className="font-work-sans text-xs text-red-500">● {errors.location.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base mt-2"
              >
                {initialData ? "Save Changes" : "Submit"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

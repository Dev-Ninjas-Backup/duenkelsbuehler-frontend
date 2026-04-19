"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCreateBanner } from "@/hooks/admin/use-admin";
import { ImageUpload } from "@/components/shared/image-upload";

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBannerModal({ isOpen, onClose }: AddBannerModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const { mutate: createBanner, isPending } = useCreateBanner();

  const handleUpload = () => {
    if (!imageUrl) return;
    createBanner({ imageUrl }, { onSuccess: handleClose });
  };

  const handleClose = () => {
    onClose();
    setImageUrl("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={handleClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-rozha text-2xl text-[#181D27]">Add New Banner</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={16} className="text-[#414651]" />
                </motion.button>
              </div>

              <div className="h-px bg-gray-100" />

              <ImageUpload value={imageUrl} onChange={setImageUrl} />

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={!imageUrl || isPending}
                className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? "Saving..." : "Upload Now"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

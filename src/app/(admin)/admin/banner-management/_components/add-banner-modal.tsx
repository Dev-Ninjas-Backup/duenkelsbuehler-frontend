"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import { useCreateBanner } from "@/hooks/admin/use-admin";

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBannerModal({ isOpen, onClose }: AddBannerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { mutate: createBanner, isPending } = useCreateBanner();

  const handleFile = (file: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    // TODO: upload file to get URL — for now use object URL as placeholder
    setImageUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = () => {
    if (!imageUrl) return;
    createBanner({ imageUrl }, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    onClose();
    setPreview(null);
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

              {/* Image URL input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-work-sans text-sm font-medium text-[#181D27]">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm focus:outline-none focus:border-[#181D27] transition-colors"
                />
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl px-6 py-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                  isDragging ? "border-[#181D27] bg-gray-50" : "border-gray-300 hover:border-[#181D27] hover:bg-gray-50"
                }`}
              >
                {preview ? (
                  <div className="w-full h-40 rounded-xl overflow-hidden">
                    <Image src={preview} alt="Preview" width={400} height={160} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <>
                    <CloudUpload size={40} className="text-[#414651]" strokeWidth={1.5} />
                    <p className="font-rozha text-lg text-[#181D27] text-center">Choose a file or drag & drop it here</p>
                    <p className="font-work-sans text-sm text-[#9CA3AF] text-center">JPEG, PNG formats, up to 50MB</p>
                    <motion.button type="button" whileTap={{ scale: 0.97 }}
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="mt-2 px-6 py-2.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-medium hover:bg-[#181D27]/90 transition-colors">
                      Browse File
                    </motion.button>
                  </>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />

              <motion.button whileTap={{ scale: 0.98 }} onClick={handleUpload}
                disabled={!imageUrl || isPending}
                className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {isPending ? "Uploading..." : "Upload Now"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

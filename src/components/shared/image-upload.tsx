"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import { useUploadImage } from "@/hooks/files/use-files";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
}

export function ImageUpload({ value, onChange, accept = "image/jpeg,image/png", hint = "JPEG, PNG formats, up to 50MB" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate: uploadImage, isPending } = useUploadImage();

  const handleFile = (file: File) => {
    uploadImage(file, { onSuccess: (res) => onChange(res.url) });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isPending && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl px-6 py-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          isDragging ? "border-[#181D27] bg-gray-50" : "border-gray-300 hover:border-[#181D27] hover:bg-gray-50"
        } ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {value ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden">
            <Image src={value} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              title="Remove image"
              aria-label="Remove image"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <>
            <CloudUpload size={40} className="text-[#414651]" strokeWidth={1.5} />
            <p className="font-rozha text-lg text-[#181D27] text-center">
              {isPending ? "Uploading..." : "Choose a file or drag & drop it here"}
            </p>
            <p className="font-work-sans text-sm text-[#9CA3AF] text-center">{hint}</p>
            {!isPending && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-medium hover:bg-[#181D27]/90 transition-colors"
              >
                Browse File
              </motion.button>
            )}
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        title="Upload image"
        aria-label="Upload image"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

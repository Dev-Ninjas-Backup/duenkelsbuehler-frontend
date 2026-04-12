"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";
import { useCreateVerifSession } from "@/hooks/verif/use-verif";

export function UploadStep({ onNext }: { onNext: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createSession, isPending, error } = useCreateVerifSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    createSession(selectedFile, {
      onSuccess: () => onNext(),
    });
  };

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col items-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      <p className="font-work-sans text-sm text-[#414651] text-center mb-6">
        Place your ID within the borders. Then press the green button to capture
        the image. You will receive notification of success.
      </p>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
          <p className="font-work-sans text-sm text-red-600">{(error as Error).message}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onClick={() => fileInputRef.current?.click()}
        className="relative w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors mb-6 aspect-[1.6/1] flex items-center justify-center"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="ID preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Image src="/images/id_card.png" alt="Tap to upload your ID" width={460} height={360} className="object-contain" />
            <span className="font-work-sans text-sm text-gray-400">Tap to upload your ID</span>
          </div>
        )}
      </motion.div>

      <input ref={fileInputRef} type="file" accept="image/*"
        aria-label="Upload ID image" title="Upload ID image"
        className="hidden" onChange={handleFileChange} />

      <Button onClick={handleUpload} disabled={!selectedFile || isPending}
        className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base disabled:opacity-60">
        {isPending ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}

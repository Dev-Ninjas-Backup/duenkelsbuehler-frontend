"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CloudUpload } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBlogModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleClose = () => {
    setTitle("");
    setFile(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-2xl mx-auto p-8 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-rozha text-2xl text-[#181D27]">Add New Blog</h3>
              <button onClick={handleClose} aria-label="Close modal" className="text-gray-400 hover:text-[#181D27] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Title input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">
                Enter Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors"
              />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center gap-3 py-10 px-6 transition-colors ${
                dragging ? "border-[#181D27] bg-gray-50" : "border-gray-300"
              }`}
            >
              <CloudUpload size={40} strokeWidth={1.5} className="text-[#181D27]" />

              {file ? (
                <p className="font-work-sans text-sm font-semibold text-[#181D27]">{file.name}</p>
              ) : (
                <>
                  <p className="font-work-sans text-sm font-bold text-[#181D27] text-center">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="font-work-sans text-xs text-gray-400 text-center">
                    JPEG, PNG, PDG, and MP4 formats, up to 50MB
                  </p>
                </>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,.pdg,video/mp4"
                aria-label="Upload blog file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-8 py-2.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Brose File
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!title.trim() && !file}
              onClick={handleClose}
              className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-50 transition-colors"
            >
              Add Now
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

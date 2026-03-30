"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CloudUpload, ChevronDown } from "lucide-react";

const TRIGGER_OPTIONS = [
  "Left a rating",
  "Completed a transaction",
  "Attached a contract",
  "Subscribed to AristoAccess+",
  "Verified account",
  "Sent a proposal",
];

function TriggerSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] bg-white hover:border-[#181D27] transition-colors"
      >
        <span className={value ? "text-[#181D27]" : "text-gray-400"}>{value || "Select trigger..."}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          >
            {TRIGGER_OPTIONS.map((opt) => (
              <li key={opt} role="none">
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 font-work-sans text-sm transition-colors hover:bg-gray-50 ${value === opt ? "text-[#16A34A] font-semibold" : "text-[#181D27]"}`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { title: string; description: string; trigger: string };
}

export function AddBadgeModal({ isOpen, onClose, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [trigger, setTrigger] = useState(initialData?.trigger ?? "");
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
    setDescription("");
    setTrigger("");
    setFile(null);
    onClose();
  };

  const isEdit = !!initialData;
  const canSubmit = title.trim() && description.trim() && trigger && (isEdit || file);

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
            className="bg-white rounded-2xl w-full max-w-lg mx-4 p-8 flex flex-col gap-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-rozha text-2xl text-[#181D27]">{isEdit ? "Edit Badge" : "Add New Badge"}</h3>
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="text-gray-400 hover:text-[#181D27] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter badge title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter badge description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors resize-none"
              />
            </div>

            {/* Trigger */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">
                Unlock Condition <span className="text-red-500">*</span>
              </label>
              <TriggerSelect value={trigger} onChange={setTrigger} />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center gap-3 py-8 px-6 transition-colors ${
                dragging ? "border-[#181D27] bg-gray-50" : "border-gray-300"
              }`}
            >
              <CloudUpload size={36} strokeWidth={1.5} className="text-[#181D27]" />

              {file ? (
                <p className="font-work-sans text-sm font-semibold text-[#181D27]">{file.name}</p>
              ) : (
                <>
                  <p className="font-work-sans text-sm font-bold text-[#181D27] text-center">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="font-work-sans text-xs text-gray-400 text-center">
                    JPEG, PNG formats, up to 10MB
                  </p>
                </>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                aria-label="Upload badge image"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-8 py-2.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
              >
                Browse File
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!canSubmit}
              onClick={handleClose}
              className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-50 transition-colors"
            >
              {isEdit ? "Save Changes" : "Create Badge"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

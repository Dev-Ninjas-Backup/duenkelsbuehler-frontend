"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, CloudUpload } from "lucide-react";
import Image from "next/image";
import { useCreateBadge, useUpdateBadge } from "@/hooks/admin/use-admin";
import { useUploadImage } from "@/hooks/files/use-files";
import type { Badge, BadgeType, CreateBadgeData, UpdateBadgeData } from "@/types/admin";

const BADGE_TYPE_OPTIONS: { value: BadgeType; label: string }[] = [
  { value: "LEFT_A_RATING", label: "Left a rating" },
  { value: "COMPLETED_A_TRANSACTION", label: "Completed a transaction" },
  { value: "ATTACHED_A_CONTRACT", label: "Attached a contract" },
  { value: "SUBSCRIBED_TO_ARISTO_ACCESS_PLUS", label: "Subscribed to AristoAccess+" },
  { value: "VERIFIED_ACCOUNT", label: "Verified account" },
  { value: "SENT_A_PROPOSAL", label: "Sent a proposal" },
];

function TypeSelect({ value, onChange }: { value: BadgeType | ""; onChange: (v: BadgeType) => void }) {
  const [open, setOpen] = useState(false);
  const label = BADGE_TYPE_OPTIONS.find((o) => o.value === value)?.label;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] bg-white hover:border-[#181D27] transition-colors">
        <span className={value ? "text-[#181D27]" : "text-gray-400"}>{label || "Select type..."}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {BADGE_TYPE_OPTIONS.map((opt) => (
              <li key={opt.value} role="none">
                <button type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 font-work-sans text-sm transition-colors hover:bg-gray-50 ${value === opt.value ? "text-[#16A34A] font-semibold" : "text-[#181D27]"}`}>
                  {opt.label}
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
  editingBadge?: Badge | null;
}

export function AddBadgeModal({ isOpen, onClose, editingBadge }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [type, setType] = useState<BadgeType | "">("");

  const { mutate: createBadge, isPending: isCreating } = useCreateBadge();
  const { mutate: updateBadge, isPending: isUpdating } = useUpdateBadge();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  useEffect(() => {
    if (editingBadge) {
      setTitle(editingBadge.title);
      setDescription(editingBadge.description);
      setImageUrl(editingBadge.imageUrl);
      setImagePreview(editingBadge.imageUrl);
      setType(editingBadge.type);
    } else {
      setTitle(""); setDescription(""); setImageUrl(""); setImagePreview(""); setType("");
    }
  }, [editingBadge, isOpen]);

  const handleClose = () => {
    setTitle(""); setDescription(""); setImageUrl(""); setImagePreview(""); setType("");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file));
    // Upload to server
    uploadImage(file, {
      onSuccess: (data) => {
        setImageUrl(data.url);
      },
      onError: () => {
        setImagePreview("");
      },
    });
    e.target.value = "";
  };

  const canSubmit = title.trim() && description.trim() && imageUrl.trim() && type && !isUploading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (editingBadge) {
      const data: UpdateBadgeData = { title, description, imageUrl, type: type as BadgeType };
      updateBadge({ id: editingBadge.id, data }, { onSuccess: handleClose });
    } else {
      const data: CreateBadgeData = { title, description, imageUrl, type: type as BadgeType };
      createBadge(data, { onSuccess: handleClose });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={handleClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg mx-4 p-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-rozha text-2xl text-[#181D27]">{editingBadge ? "Edit Badge" : "Add New Badge"}</h3>
              <button onClick={handleClose} aria-label="Close" className="text-gray-400 hover:text-[#181D27] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">Type <span className="text-red-500">*</span></label>
              <TypeSelect value={type} onChange={setType} />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">Title <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Enter badge title" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">Description <span className="text-red-500">*</span></label>
              <textarea placeholder="Enter badge description" value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors resize-none" />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="font-work-sans text-sm font-medium text-[#181D27]">Badge Image <span className="text-red-500">*</span></label>

              {imagePreview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                  <Image src={imagePreview} alt="Badge preview" fill className="object-contain p-4" />
                  <button type="button" aria-label="Remove image" onClick={() => { setImagePreview(""); setImageUrl(""); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-[#181D27] hover:bg-gray-100">
                    <X size={14} />
                  </button>
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="font-work-sans text-sm text-[#414651]">Uploading...</span>
                    </div>
                  )}
                  {imageUrl && !isUploading && (
                    <div className="absolute bottom-2 left-2 bg-green-50 text-green-600 font-work-sans text-xs px-2 py-0.5 rounded-full">
                      ✓ Uploaded
                    </div>
                  )}
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-3 py-8 px-6 cursor-pointer hover:border-[#181D27] hover:bg-gray-50 transition-colors">
                  <CloudUpload size={36} strokeWidth={1.5} className="text-[#181D27]" />
                  <p className="font-work-sans text-sm font-bold text-[#181D27]">Choose a file or drag & drop</p>
                  <p className="font-work-sans text-xs text-gray-400">JPEG, PNG formats, up to 10MB</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-6 py-2 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors">
                    Browse File
                  </button>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png"
                title="Upload badge image" aria-label="Upload badge image"
                className="hidden" onChange={handleFileChange} />
            </div>

            <motion.button whileTap={{ scale: 0.98 }}
              disabled={!canSubmit || isCreating || isUpdating}
              onClick={handleSubmit}
              className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-50 transition-colors">
              {isUploading ? "Uploading image..." : isCreating || isUpdating ? "Saving..." : editingBadge ? "Save Changes" : "Create Badge"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

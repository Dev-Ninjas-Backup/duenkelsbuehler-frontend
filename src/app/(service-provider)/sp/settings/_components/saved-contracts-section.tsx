"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, Bookmark, Loader2 } from "lucide-react";
import { useMyTemplates, useDeleteTemplate } from "@/hooks/contract-templates/use-contract-templates";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

// Date formatting helper
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function SavedContractsSection() {
  const { data: templates = [], isLoading } = useMyTemplates();
  const deleteTemplateMutation = useDeleteTemplate();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await deleteTemplateMutation.mutateAsync(id);
      toast.success("Template deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete template");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto w-full mt-8 pt-8 border-t border-gray-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <Bookmark size={16} className="fill-[#181D27] text-[#181D27]" />
        <h3 className="font-work-sans text-sm font-bold text-[#181D27]">Saved Templates</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-[#181D27]" />
        </div>
      ) : templates.length === 0 ? (
        <p className="font-work-sans text-sm text-[#9CA3AF] text-center py-6">
          No saved templates yet. Upload templates on the Saved Templates page to reuse them.
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3"
        >
          <AnimatePresence>
            {templates.map((t) => (
              <motion.div
                key={t.id}
                variants={rowVariants}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 bg-[#F9F9F9] rounded-xl px-4 py-3"
              >
                <FileText size={20} className="text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-work-sans text-sm font-semibold text-[#181D27] truncate">{t.title}</p>
                  <p className="font-work-sans text-xs text-[#9CA3AF]">Saved {formatDate(t.createdAt)}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleDelete(t.id)}
                  className="text-[#9CA3AF] hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                  aria-label="Remove saved template"
                >
                  <Trash2 size={15} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

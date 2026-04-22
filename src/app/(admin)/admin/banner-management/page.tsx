"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddBannerModal } from "./_components/add-banner-modal";
import { useBanners, useDeleteBanner, useUpdateBanner } from "@/hooks/admin/use-admin";
import { ImageUpload } from "@/components/shared/image-upload";
import type { Banner } from "@/types/admin";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function BannerManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  const { data: banners = [], isLoading } = useBanners();
  const { mutate: deleteBanner } = useDeleteBanner();
  const { mutate: updateBanner, isPending: isUpdating } = useUpdateBanner();

  const totalPages = Math.ceil(banners.length / pageSize);
  const paginated = banners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100dvh-160px)]">
      {/* Title row */}
      <div className="flex items-center justify-between shrink-0 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-rozha text-2xl md:text-3xl text-[#181D27]"
        >
          Banner Management
        </motion.h2>
        <motion.button
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors whitespace-nowrap shrink-0"
        >
          Add New
        </motion.button>
      </div>

      <AddBannerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Table header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[30px_1fr_60px] md:grid-cols-[60px_2fr_1.5fr_100px] gap-2 md:gap-0 bg-[#181D27] text-white rounded-xl px-4 md:px-6 py-4 items-center shrink-0"
      >
        <span className="font-work-sans text-xs md:text-sm font-medium">Sl</span>
        <span className="font-work-sans text-xs md:text-sm font-medium">Image</span>
        <span className="font-work-sans text-sm font-medium hidden md:block">Upload Date & Time</span>
        <span className="font-work-sans text-xs md:text-sm font-medium text-center">Action</span>
      </motion.div>

      {/* Rows */}
      <motion.div
        key={currentPage}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar pb-2"
      >
        {isLoading ? (
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[30px_1fr_60px] md:grid-cols-[60px_2fr_1.5fr_100px] gap-2 md:gap-0 items-center bg-[#F9F9F9] rounded-2xl px-4 md:px-6 py-5 shrink-0 animate-pulse">
                <div className="h-4 w-6 bg-gray-200 rounded" />
                <div className="w-32 md:w-44 h-16 md:h-24 rounded-xl bg-gray-200 shrink-0" />
                <div className="h-4 w-32 bg-gray-200 rounded-lg hidden md:block" />
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200" />
                  <div className="w-7 h-7 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-work-sans text-sm text-[#414651]">No banners found</span>
          </div>
        ) : paginated.map((banner, i) => (
          <motion.div
            key={banner.id}
            variants={rowVariants}
            className="grid grid-cols-[30px_1fr_60px] md:grid-cols-[60px_2fr_1.5fr_100px] gap-2 md:gap-0 items-center bg-[#F9F9F9] rounded-2xl px-4 md:px-6 py-5 shrink-0"
          >
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + i + 1}
            </span>

            <div className="w-32 md:w-44 h-16 md:h-24 rounded-xl overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={banner.imageUrl}
                alt={`Banner ${banner.id}`}
                width={176} height={96}
                className="object-cover w-full h-full"
              />
            </div>

            <span className="font-work-sans text-sm text-[#414651] hidden md:block">
              {new Date(banner.createdAt).toLocaleString()}
            </span>

            <div className="flex items-center justify-center gap-2">
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => { setEditingBanner(banner); setEditImageUrl(banner.imageUrl); }}
                className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] hover:border-gray-300 transition-colors shadow-sm"
                aria-label="Edit banner">
                <Pencil size={13} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => setDeleteConfirmId(banner.id)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                aria-label="Delete banner">
                <Trash2 size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-between shrink-0 pt-2"
      >
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Entries per page"
            className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>

          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span
                key={`e-${i}`}
                className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]"
              >
                ...
              </span>
            ) : (
              <motion.button
                key={page}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(page as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#181D27] text-white"
                    : "border border-gray-200 text-[#414651] hover:bg-gray-50"
                }`}
              >
                {page}
              </motion.button>
            ),
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingBanner && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setEditingBanner(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-rozha text-2xl text-[#181D27]">Edit Banner</h3>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingBanner(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <X size={16} className="text-[#414651]" />
                  </motion.button>
                </div>
                <div className="h-px bg-gray-100" />
                <ImageUpload value={editImageUrl} onChange={setEditImageUrl} />
                <motion.button whileTap={{ scale: 0.98 }}
                  disabled={!editImageUrl || isUpdating}
                  onClick={() => updateBanner({ id: editingBanner.id, data: { imageUrl: editImageUrl } }, { onSuccess: () => setEditingBanner(null) })}
                  className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {deleteConfirmId !== null && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/30 z-40" onClick={() => setDeleteConfirmId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5 shadow-xl">
              <h3 className="font-rozha text-2xl text-[#181D27]">Delete Banner?</h3>
              <p className="font-work-sans text-sm text-[#414651]">Are you sure you want to delete this banner? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 h-11 rounded-full border border-gray-200 font-work-sans text-sm font-medium text-[#414651] hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => { deleteBanner(deleteConfirmId); setDeleteConfirmId(null); }}
                  className="flex-1 h-11 rounded-full bg-red-500 text-white font-work-sans text-sm font-semibold hover:bg-red-600 transition-colors">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

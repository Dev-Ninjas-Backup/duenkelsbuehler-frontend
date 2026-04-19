"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from "@/hooks/admin/use-admin";
import { ImageUpload } from "@/components/shared/image-upload";
import type { Blog } from "@/types/admin";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const rowVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } } };
type Mode = "list" | "create" | "edit";

export default function BlogManagementPage() {
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);


  const { data: blogs = [], isLoading } = useBlogs();
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog();
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
  const { mutate: deleteBlog } = useDeleteBlog();

  const totalPages = Math.ceil(blogs.length / pageSize);
  const paginated = blogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const openCreate = () => { setTitle(""); setContent(""); setImagePreview(""); setEditing(null); setMode("create"); };

  const openEdit = (blog: Blog) => {
    setTitle(blog.title); setContent(blog.content); setImagePreview(blog.imageUrl);
    setEditing(blog); setMode("edit");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !imagePreview.trim()) return;
    if (mode === "create") {
      createBlog({ title, content, imageUrl: imagePreview }, { onSuccess: () => setMode("list") });
    } else if (mode === "edit" && editing) {
      updateBlog({ id: editing.id, data: { title, content, imageUrl: imagePreview } }, { onSuccess: () => setMode("list") });
    }
  };

  // ── Create / Edit form ──
  if (mode === "create" || mode === "edit") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => setMode("list")}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors">
            <ChevronLeft size={16} /> Back
          </motion.button>
          <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="font-rozha text-3xl text-[#181D27] mx-auto w-full max-w-5xl">
            {mode === "create" ? "Add New Blog" : "Edit Blog"}
          </motion.h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="flex flex-col gap-5 max-w-5xl mx-auto w-full">

          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">Title <span className="text-red-500">*</span></label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">Cover Image <span className="text-red-500">*</span></label>
            <ImageUpload value={imagePreview} onChange={setImagePreview} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">Content <span className="text-red-500">*</span></label>
            <div data-color-mode="light">
              <MDEditor value={content} onChange={(v) => setContent(v ?? "")} height={400} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
              disabled={!title.trim() || !content.trim() || !imagePreview.trim() || isCreating || isUpdating}
              className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors">
              {mode === "create" ? (isCreating ? "Publishing..." : "Publish Blog") : (isUpdating ? "Saving..." : "Save Changes")}
            </motion.button>
            <button onClick={() => setMode("list")} className="font-work-sans text-sm text-[#414651] underline underline-offset-2 hover:text-[#181D27] transition-colors">
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="flex flex-col gap-6 h-[calc(100dvh-160px)]">
      <div className="flex items-center justify-between shrink-0 gap-4">
        <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="font-rozha text-2xl md:text-3xl text-[#181D27]">Blog Management</motion.h2>
        <motion.button initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          whileTap={{ scale: 0.97 }} onClick={openCreate}
          className="px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors whitespace-nowrap shrink-0">
          Add New
        </motion.button>
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto w-full custom-scrollbar">
        <div className="min-w-[800px] h-full flex flex-col">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
            className="grid grid-cols-[60px_2.5fr_1.5fr_80px] bg-[#181D27] text-white rounded-xl px-6 py-4 items-center shrink-0 mb-5">
            <span className="font-work-sans text-sm font-medium">Sl</span>
            <span className="font-work-sans text-sm font-medium">Title</span>
            <span className="font-work-sans text-sm font-medium">Upload Date & Time</span>
            <span className="font-work-sans text-sm font-medium text-center">Action</span>
          </motion.div>

          <motion.div key={currentPage} variants={containerVariants} initial="hidden" animate="visible"
            className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar pb-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <span className="font-work-sans text-sm text-[#414651]">No blogs found</span>
              </div>
            ) : paginated.map((blog, i) => (
              <motion.div key={blog.id} variants={rowVariants}
                className="grid grid-cols-[60px_2.5fr_1.5fr_80px] items-center bg-[#F9F9F9] rounded-2xl px-6 py-5 shrink-0">
                <span className="font-work-sans text-sm text-[#414651]">{(currentPage - 1) * pageSize + i + 1}</span>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                    <Image src={blog.imageUrl} alt={blog.title} width={96} height={64} className="object-cover w-full h-full" />
                  </div>
                  <span className="font-work-sans text-sm font-bold text-[#181D27] leading-snug">{blog.title}</span>
                </div>
                <span className="font-work-sans text-sm text-[#414651]">{new Date(blog.createdAt).toLocaleString()}</span>
                <div className="flex items-center justify-center gap-2">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => openEdit(blog)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] hover:border-gray-300 transition-colors shadow-sm" aria-label="Edit">
                    <Pencil size={13} />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setDeleteConfirmId(blog.id)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-red-500 hover:border-red-200 transition-colors shadow-sm" aria-label="Delete">
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-between shrink-0 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Entries per page" className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer">
            {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]">...</span>
            ) : (
              <motion.button key={page} whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(page as number)}
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${currentPage === page ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50"}`}>
                {page}
              </motion.button>
            )
          )}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40" onClick={() => setDeleteConfirmId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5 shadow-xl">
              <h3 className="font-rozha text-2xl text-[#181D27]">Delete Blog?</h3>
              <p className="font-work-sans text-sm text-[#414651]">Are you sure you want to delete this blog? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 h-11 rounded-full border border-gray-200 font-work-sans text-sm font-medium text-[#414651] hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => { deleteBlog(deleteConfirmId); setDeleteConfirmId(null); }}
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

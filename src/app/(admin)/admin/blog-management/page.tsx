"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { MoreVertical, ChevronLeft, ChevronRight, X, CloudUpload, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";

// Load editor client-side only (no SSR)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

type Mode = "list" | "create" | "edit";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(blogs.length / pageSize);
  const paginated = blogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const openCreate = () => {
    setTitle(""); setContent(""); setImageFile(null); setImagePreview(""); setEditing(null);
    setMode("create");
  };

  const openEdit = (blog: BlogPost) => {
    setTitle(blog.title); setContent(blog.content); setImagePreview(blog.image); setImageFile(null); setEditing(blog);
    setMode("edit");
  };

  const handleDelete = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    if (mode === "create") {
      const newBlog: BlogPost = {
        id: Date.now().toString(),
        title,
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
        image: imagePreview || "/images/blog/blog_post_1.png",
        content,
      };
      setBlogs((prev) => [newBlog, ...prev]);
    } else if (mode === "edit" && editing) {
      setBlogs((prev) => prev.map((b) => b.id === editing.id ? { ...b, title, content, image: imagePreview || b.image } : b));
    }
    setMode("list");
  };

  // ── Create / Edit form ──
  if (mode === "create" || mode === "edit") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => setMode("list")}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </motion.button>
          <motion.h2
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="font-rozha text-3xl text-[#181D27]"
          >
            {mode === "create" ? "Add New Blog" : "Edit Blog"}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="flex flex-col gap-5 max-w-3xl"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors"
            />
          </div>

          {/* Cover image */}
          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">Cover Image</label>
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                <Image src={imagePreview} alt="preview" fill className="object-cover" />
                <button
                  aria-label="Remove cover image"
                  onClick={() => { setImagePreview(""); setImageFile(null); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-[#181D27] hover:bg-gray-100"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleImageDrop}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center gap-3 py-8 px-6 transition-colors ${dragging ? "border-[#181D27] bg-gray-50" : "border-gray-300"}`}
              >
                <CloudUpload size={36} strokeWidth={1.5} className="text-[#181D27]" />
                <p className="font-work-sans text-sm font-bold text-[#181D27]">Choose a file or drag & drop it here</p>
                <p className="font-work-sans text-xs text-gray-400">JPEG, PNG formats, up to 10MB</p>
                <input ref={inputRef} type="file" accept="image/jpeg,image/png" title="Upload cover image" className="hidden" onChange={handleImageSelect} />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-8 py-2.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
                >
                  Browse File
                </button>
              </div>
            )}
          </div>

          {/* Rich text editor */}
          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">
              Content <span className="text-red-500">*</span>
            </label>
            <div data-color-mode="light">
              <MDEditor value={content} onChange={(v) => setContent(v ?? "")} height={400} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors"
            >
              {mode === "create" ? "Publish Blog" : "Save Changes"}
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="font-rozha text-3xl text-[#181D27]"
        >
          Blog Management
        </motion.h2>
        <motion.button
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="px-6 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Add New
        </motion.button>
      </div>

      {/* Table header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[40px_1fr_220px_80px] bg-[#181D27] text-white rounded-xl px-6 py-3.5"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">File Name</span>
        <span className="font-work-sans text-sm font-medium">Upload Date & Time</span>
        <span className="font-work-sans text-sm font-medium text-center">Action</span>
      </motion.div>

      {/* Rows */}
      <motion.div key={currentPage} variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3">
        {paginated.map((blog, i) => (
          <motion.div
            key={blog.id}
            variants={rowVariants}
            className="grid grid-cols-[40px_1fr_220px_80px] items-center bg-[#F9F9F9] rounded-xl px-6 py-4"
          >
            <span className="font-work-sans text-sm text-[#414651]">{(currentPage - 1) * pageSize + i + 1}</span>

            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                <Image src={blog.image} alt={blog.title} width={96} height={64} className="object-cover w-full h-full" />
              </div>
              <span className="font-work-sans text-sm font-bold text-[#181D27] leading-snug">{blog.title}</span>
            </div>

            <span className="font-work-sans text-sm text-[#414651]">{blog.date}</span>

            <div className="flex items-center justify-center gap-2">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => openEdit(blog)}
                className="text-[#414651] hover:text-[#181D27] transition-colors"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleDelete(blog.id)}
                className="text-[#414651] hover:text-red-500 transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Entries per page"
            className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer"
          >
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
    </div>
  );
}

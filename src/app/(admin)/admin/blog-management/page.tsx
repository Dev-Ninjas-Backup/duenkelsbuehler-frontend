"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AddBlogModal } from "./_components/add-blog-modal";

interface Blog {
  id: number;
  image: string;
  title: string;
  uploadDateTime: string;
}

const MOCK: Blog[] = [
  { id: 1, image: "/images/blog_cover.png", title: "Learn How to Trade Safely Online", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 2, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 3, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 4, image: "/images/blog_cover.png", title: "Learn How to Trade Safely Online", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 5, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 6, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 7, image: "/images/blog_cover.png", title: "Learn How to Trade Safely Online", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 8, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 9, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 10, image: "/images/blog_cover.png", title: "Learn How to Trade Safely Online", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 11, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
  { id: 12, image: "/images/blog_cover.png", title: "Welcome to Our Knowledge Center", uploadDateTime: "19 January 25, 10:00 PM" },
];

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

export default function BlogManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(MOCK.length / pageSize);
  const paginated = MOCK.slice(
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
    <div className="flex flex-col gap-6">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-rozha text-3xl text-[#181D27]"
        >
          Blog Management
        </motion.h2>
        <motion.button
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Add New
        </motion.button>
      </div>

      <AddBlogModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Table header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[40px_1fr_220px_50px] bg-[#181D27] text-white rounded-xl px-6 py-3.5"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">File Name</span>
        <span className="font-work-sans text-sm font-medium">
          Upload Date & Time
        </span>
        <span className="font-work-sans text-sm font-medium">Action</span>
      </motion.div>

      {/* Rows */}
      <motion.div
        key={currentPage}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {paginated.map((blog, i) => (
          <motion.div
            key={blog.id}
            variants={rowVariants}
            className="grid grid-cols-[40px_1fr_220px_50px] items-center bg-[#F9F9F9] rounded-xl px-6 py-4"
          >
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + i + 1}
            </span>

            {/* Thumbnail + title */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={96}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-work-sans text-sm font-bold text-[#181D27] leading-snug">
                {blog.title}
              </span>
            </div>

            <span className="font-work-sans text-sm text-[#414651]">
              {blog.uploadDateTime}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              className="flex items-center justify-center text-[#414651] hover:text-[#181D27] transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={16} />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-between"
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
    </div>
  );
}

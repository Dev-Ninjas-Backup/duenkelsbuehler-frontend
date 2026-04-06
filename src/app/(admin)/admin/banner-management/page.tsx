"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AddBannerModal } from "./_components/add-banner-modal";

interface Banner {
  id: number;
  image: string;
  uploadDateTime: string;
}

const MOCK: Banner[] = [
  {
    id: 1,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 2,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 3,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 4,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 5,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 6,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 7,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 8,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 9,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 10,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 11,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
  {
    id: 12,
    image: "/images/banner_cover.png",
    uploadDateTime: "12 March 26, 10:00 PM",
  },
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

export default function BannerManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
        className="grid grid-cols-[30px_1fr_40px] md:grid-cols-[60px_2fr_1.5fr_80px] gap-2 md:gap-0 bg-[#181D27] text-white rounded-xl px-4 md:px-6 py-4 items-center shrink-0"
      >
        <span className="font-work-sans text-xs md:text-sm font-medium">Sl</span>
        <span className="font-work-sans text-xs md:text-sm font-medium">Name</span>
        <span className="font-work-sans text-sm font-medium hidden md:block">
          Upload Date & Time
        </span>
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
        {paginated.map((banner, i) => (
          <motion.div
            key={banner.id}
            variants={rowVariants}
            className="grid grid-cols-[30px_1fr_40px] md:grid-cols-[60px_2fr_1.5fr_80px] gap-2 md:gap-0 items-center bg-[#F9F9F9] rounded-2xl px-4 md:px-6 py-5 shrink-0"
          >
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + i + 1}
            </span>

            {/* Banner thumbnail */}
            <div className="w-32 md:w-44 h-16 md:h-24 rounded-xl overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={banner.image}
                alt={`Banner ${banner.id}`}
                width={176}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>

            <span className="font-work-sans text-sm text-[#414651] hidden md:block">
              {banner.uploadDateTime}
            </span>

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] hover:border-gray-300 transition-colors shadow-sm"
                aria-label="More options"
              >
                <MoreVertical size={14} />
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
    </div>
  );
}

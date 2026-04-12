"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAdminUsers } from "@/hooks/admin/use-admin";
import { useAdminVerifyServiceProvider, useDeleteServiceProvider } from "@/hooks/sp/use-sp";
import { ShieldCheck, Trash2 } from "lucide-react";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: users = [], isLoading } = useAdminUsers();
  const { mutate: verifyServiceProvider } = useAdminVerifyServiceProvider();
  const { mutate: deleteServiceProvider } = useDeleteServiceProvider();

  const totalPages = Math.ceil(users.length / pageSize);
  const paginated = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  return (
    <div className="flex flex-col gap-6 h-[calc(100dvh-160px)]">
      <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="font-rozha text-3xl text-[#181D27] shrink-0">
        User Management
      </motion.h2>

      {/* Table header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[30px_1fr_1fr_40px] md:grid-cols-[60px_2fr_1.5fr_1.5fr_100px] gap-2 md:gap-0 bg-[#181D27] text-white rounded-xl px-4 md:px-6 py-4 items-center shrink-0">
        <span className="font-work-sans text-xs md:text-sm font-medium">Sl</span>
        <span className="font-work-sans text-xs md:text-sm font-medium">Name</span>
        <span className="font-work-sans text-xs md:text-sm font-medium">Email</span>
        <span className="font-work-sans text-xs md:text-sm font-medium hidden md:block">Role</span>
        <span className="font-work-sans text-xs md:text-sm font-medium text-center">Action</span>
      </motion.div>

      {/* Rows */}
      <motion.div key={currentPage} variants={containerVariants} initial="hidden" animate="visible"
        className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar pb-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-work-sans text-sm text-[#414651]">No users found</span>
          </div>
        ) : paginated.map((user, i) => (
          <motion.div key={user.id} variants={rowVariants}
            className="grid grid-cols-[30px_1fr_1fr_40px] md:grid-cols-[60px_2fr_1.5fr_1.5fr_100px] gap-2 md:gap-0 items-center bg-[#F9F9F9] rounded-2xl px-4 md:px-6 py-5 shrink-0">
            <span className="font-work-sans text-sm text-[#414651]">
              {(currentPage - 1) * pageSize + i + 1}
            </span>

            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gray-200 flex items-center justify-center">
                <span className="font-work-sans text-sm font-bold text-[#181D27]">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-work-sans text-sm font-bold text-[#181D27] truncate">{user.name}</span>
            </div>

            {/* Email */}
            <span className="font-work-sans text-sm text-[#414651] truncate">{user.email}</span>

            {/* Role */}
            <div className="hidden md:flex items-center gap-1 flex-wrap">
              {user.role.map((r) => (
                <span key={r} className="font-work-sans text-xs bg-gray-100 text-[#414651] px-2 py-0.5 rounded-full">
                  {r}
                </span>
              ))}
            </div>

            {/* Action */}
            <div className="flex justify-center items-center gap-2">
              {user.isIdentityVerified ? (
                <span className="flex items-center gap-1 font-work-sans text-[10px] sm:text-xs text-[#16A34A] bg-[#16A34A]/10 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                  <Image src="/svg/crown.svg" alt="Verified" width={12} height={12} /> Verified
                </span>
              ) : (
                <motion.button whileTap={{ scale: 0.85 }}
                  onClick={() => verifyServiceProvider(user.id)}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#16A34A] hover:border-green-200 transition-colors shadow-sm"
                  aria-label="Verify">
                  <ShieldCheck size={13} />
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => deleteServiceProvider(user.id)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                aria-label="Delete">
                <Trash2 size={13} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-between shrink-0 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-work-sans text-sm text-[#414651]">Show</span>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Entries per page"
            className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer">
            {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="font-work-sans text-sm text-[#414651]">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
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

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

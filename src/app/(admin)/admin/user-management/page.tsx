"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  ShieldCheck,
} from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAdminUsers } from "@/hooks/admin/use-admin";
import {
  useAdminVerifyServiceProvider,
  useAllServiceProviders,
} from "@/hooks/sp/use-sp";
import { ProviderIcon } from "@/components/shared/provider-icons";
import type { AdminUser } from "@/types/admin";

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

function UserDetailsModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-rozha text-2xl text-[#181D27]">User Details</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-[#181D27]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
            <span className="font-rozha text-2xl text-white">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-rozha text-xl text-[#181D27]">{user.name}</p>
            <p className="font-work-sans text-sm text-[#9CA3AF]">
              {user.email}
            </p>
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex flex-col gap-3">
          {[
            { label: "Role", value: user.role?.join(", ") },
            {
              label: "Email Verified",
              value: user.isEmailVerified ? "✅ Yes" : "❌ No",
            },
            {
              label: "Identity Verified",
              value: user.isIdentityVerified ? "✅ Yes" : "❌ No",
            },
            {
              label: "Sign In",
              value: user.firebaseUid ? "Google / Apple" : "Email",
            },
            {
              label: "Member Since",
              value: new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4"
            >
              <span className="font-work-sans text-sm text-[#9CA3AF] shrink-0">
                {label}
              </span>
              <span className="font-work-sans text-sm font-medium text-[#181D27] text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [detailsUser, setDetailsUser] = useState<AdminUser | null>(null);

  const { data: users = [], isLoading } = useAdminUsers();
  const { data: serviceProviders = [] } = useAllServiceProviders();
  const { mutate: verifyServiceProvider, isPending: isVerifying } =
    useAdminVerifyServiceProvider();

  const hasSpProfile = (userId: number) =>
    serviceProviders.some((sp) => sp.userId === userId);

  const totalPages = Math.ceil(users.length / pageSize) || 1;
  const paginated = users.slice(
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
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const ActionMenu = ({ user }: { user: AdminUser }) => (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => setMenuOpenId(menuOpenId === user.id ? null : user.id)}
        className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] hover:border-gray-300 transition-colors shadow-sm"
        aria-label="More options"
      >
        <MoreVertical size={14} />
      </motion.button>
      <AnimatePresence>
        {menuOpenId === user.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-40"
          >
            <button
              onClick={() => {
                setDetailsUser(user);
                setMenuOpenId(null);
              }}
              className="w-full text-left px-4 py-2.5 font-work-sans text-sm text-[#181D27] hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              View Details
            </button>
            {user.role?.includes("SERVICE_PROVIDER") &&
              !user.isIdentityVerified &&
              hasSpProfile(user.id) && (
                <button
                  onClick={() => {
                    verifyServiceProvider(user.id);
                    setMenuOpenId(null);
                  }}
                  disabled={isVerifying}
                  className="w-full text-left px-4 py-2.5 font-work-sans text-sm text-[#16A34A] hover:bg-green-50 transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  <ShieldCheck size={16} /> Verify Account
                </button>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 h-[calc(100dvh-160px)]">
      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-2xl md:text-3xl text-[#181D27] shrink-0"
      >
        User Management
      </motion.h2>

      {/* ── Desktop Table ── */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0 gap-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex items-center bg-[#181D27] text-white rounded-xl px-6 py-4 shrink-0"
        >
          <span className="font-work-sans text-sm font-medium w-10">Sl</span>
          <span className="font-work-sans text-sm font-medium flex-1">
            Name
          </span>
          <span className="font-work-sans text-sm font-medium w-28 text-center">
            Status
          </span>
          <span className="font-work-sans text-sm font-medium w-20 text-center">
            Role
          </span>
          <span className="font-work-sans text-sm font-medium flex-1 text-center">
            Sign in
          </span>
          <span className="font-work-sans text-sm font-medium flex-1">
            Date & Time
          </span>
          <span className="font-work-sans text-sm font-medium w-12 text-center">
            Action
          </span>
        </motion.div>

        {/* Rows */}
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar pb-2"
        >
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center bg-[#F9F9F9] rounded-2xl px-6 py-4 shrink-0 animate-pulse">
                  <div className="h-4 w-6 bg-gray-200 rounded w-10" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-gray-200 rounded-lg" />
                      <div className="h-3 w-44 bg-gray-200 rounded-lg" />
                    </div>
                  </div>
                  <div className="w-28 flex justify-center"><div className="h-6 w-20 bg-gray-200 rounded-full" /></div>
                  <div className="w-20 flex justify-center"><div className="h-5 w-10 bg-gray-200 rounded-full" /></div>
                  <div className="flex-1 flex justify-center"><div className="w-5 h-5 bg-gray-200 rounded" /></div>
                  <div className="flex-1"><div className="h-3 w-28 bg-gray-200 rounded-lg" /></div>
                  <div className="w-12 flex justify-center"><div className="w-7 h-7 rounded-full bg-gray-200" /></div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">
                No users found
              </span>
            </div>
          ) : (
            paginated.map((user, i) => (
              <motion.div
                key={user.id}
                variants={rowVariants}
                className="flex items-center bg-[#F9F9F9] rounded-2xl px-6 py-4 shrink-0 relative"
              >
                <span className="font-work-sans text-sm text-[#414651] w-10">
                  {(currentPage - 1) * pageSize + i + 1}
                </span>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="font-work-sans text-sm font-bold text-[#181D27]">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-work-sans text-sm font-bold text-[#181D27] truncate">
                      {user.name}
                    </span>
                    <span className="font-work-sans text-xs text-[#9CA3AF] truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center w-28">
                  {user.isIdentityVerified ? (
                    <span className="flex items-center gap-1 font-work-sans text-[10px] text-[#16A34A] bg-[#16A34A]/10 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                      <Image
                        src="/svg/crown.svg"
                        alt="Verified"
                        width={12}
                        height={12}
                      />{" "}
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-work-sans text-[10px] text-red-500 bg-red-500/10 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                      <AiFillWarning className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </div>
                <div className="flex justify-center w-20 flex-wrap gap-1">
                  {user.role
                    ?.filter((r) => r !== "ADMIN")
                    .map((r) => (
                      <span
                        key={r}
                        className="font-work-sans text-[10px] bg-gray-100 text-[#414651] px-2 py-0.5 rounded-full whitespace-nowrap"
                      >
                        {r === "SERVICE_PROVIDER" ? "SP" : r}
                      </span>
                    ))}
                </div>
                <div className="flex justify-center flex-1">
                  <ProviderIcon firebaseUid={user.firebaseUid} />
                </div>
                <span className="font-work-sans text-xs text-[#414651] flex-1">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <div className="flex justify-center w-12">
                  <ActionMenu user={user} />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* ── Mobile Card View ── */}
      <motion.div
        key={`mobile-${currentPage}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex lg:hidden flex-col gap-4 overflow-y-auto flex-1 min-h-0 pb-2"
      >
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#F9F9F9] rounded-2xl px-4 py-4 flex flex-col gap-3 border border-gray-100/80 animate-pulse">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-28 bg-gray-200 rounded-lg" />
                      <div className="h-3 w-36 bg-gray-200 rounded-lg" />
                    </div>
                  </div>
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  <div className="h-5 w-12 bg-gray-200 rounded-full" />
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-work-sans text-sm text-[#414651]">
              No users found
            </span>
          </div>
        ) : (
          paginated.map((user, i) => (
            <motion.div
              key={user.id}
              variants={rowVariants}
              className="bg-[#F9F9F9] rounded-2xl px-4 py-4 flex flex-col gap-3 border border-gray-100/80 relative"
            >
              {/* Top row: avatar + name + date + action */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="font-work-sans text-sm font-bold text-[#181D27]">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-work-sans text-sm font-bold text-[#181D27] truncate">
                      {user.name}
                    </span>
                    <span className="font-work-sans text-xs text-[#9CA3AF] truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-work-sans text-[10px] text-[#9CA3AF] whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                  <ActionMenu user={user} />
                </div>
              </div>

              {/* Info row: status + role + sign in */}
              <div className="flex items-center gap-2 flex-wrap">
                {user.isIdentityVerified ? (
                  <span className="flex items-center gap-1 font-work-sans text-[10px] text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full font-semibold">
                    <Image
                      src="/svg/crown.svg"
                      alt="Verified"
                      width={10}
                      height={10}
                    />{" "}
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-work-sans text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full font-semibold">
                    <AiFillWarning className="w-3 h-3" /> Unverified
                  </span>
                )}
                {user.role
                  ?.filter((r) => r !== "ADMIN")
                  .map((r) => (
                    <span
                      key={r}
                      className="font-work-sans text-[10px] bg-gray-100 text-[#414651] px-2 py-0.5 rounded-full"
                    >
                      {r === "SERVICE_PROVIDER" ? "SP" : r}
                    </span>
                  ))}
                {user.firebaseUid ? (
                  <ProviderIcon firebaseUid={user.firebaseUid} />
                ) : (
                  <ProviderIcon firebaseUid={null} />
                )}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-between shrink-0 pt-2 gap-3 sm:gap-0"
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
                className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${currentPage === page ? "bg-[#181D27] text-white" : "border border-gray-200 text-[#414651] hover:bg-gray-50"}`}
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

      <AnimatePresence>
        {detailsUser && (
          <UserDetailsModal
            user={detailsUser}
            onClose={() => setDetailsUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

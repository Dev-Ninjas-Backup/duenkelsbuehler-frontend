"use client";

import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreVertical, X, ShieldCheck } from "lucide-react";
import { useAdminUsers } from "@/hooks/admin/use-admin";
import {
  useAdminVerifyServiceProvider,
  useAllServiceProviders,
} from "@/hooks/sp/use-sp";
import { ProviderIcon } from "@/components/shared/provider-icons";
import type { AdminUser } from "@/types/admin";

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

export function RecentUsersTable() {
  const router = useRouter();
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [detailsUser, setDetailsUser] = useState<AdminUser | null>(null);

  const { data: users = [], isLoading } = useAdminUsers();
  const { data: serviceProviders = [] } = useAllServiceProviders();
  const { mutate: verifyServiceProvider, isPending: isVerifying } =
    useAdminVerifyServiceProvider();

  const hasSpProfile = (userId: number) =>
    serviceProviders.some((sp) => sp.userId === userId);

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="font-rozha text-xl md:text-2xl text-[#181D27]">
          Recent Users
        </h2>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/admin/user-management")}
          className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-medium hover:bg-[#181D27]/90 transition-colors whitespace-nowrap shrink-0"
        >
          View All
        </motion.button>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block">
        <div className="flex items-center bg-[#181D27] text-white rounded-xl px-6 py-3.5 mb-3">
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
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center bg-[#F9F9F9] rounded-2xl px-6 py-4 animate-pulse">
                <div className="w-10"><div className="h-3 w-4 bg-gray-200 rounded-full" /></div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-28 bg-gray-200 rounded-full" />
                    <div className="h-2.5 w-36 bg-gray-200 rounded-full" />
                  </div>
                </div>
                <div className="w-28 flex justify-center"><div className="h-5 w-16 bg-gray-200 rounded-full" /></div>
                <div className="w-20 flex justify-center"><div className="h-5 w-8 bg-gray-200 rounded-full" /></div>
                <div className="flex-1 flex justify-center"><div className="h-5 w-5 bg-gray-200 rounded-full" /></div>
                <div className="flex-1"><div className="h-3 w-24 bg-gray-200 rounded-full" /></div>
                <div className="w-12 flex justify-center"><div className="w-7 h-7 bg-gray-200 rounded-full" /></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {recentUsers.map((user, i) => (
              <motion.div
                key={user.id}
                variants={rowVariants}
                className="flex items-center bg-[#F9F9F9] rounded-2xl px-6 py-4"
              >
                <span className="font-work-sans text-sm text-[#414651] w-10">
                  {i + 1}
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
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Mobile Card View ── */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#F9F9F9] rounded-2xl px-4 py-4 flex flex-col gap-3 border border-gray-100/80 animate-pulse">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3 w-24 bg-gray-200 rounded-full" />
                      <div className="h-2.5 w-32 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-14 bg-gray-200 rounded-full" />
                    <div className="w-7 h-7 bg-gray-200 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-gray-200 rounded-full" />
                  <div className="h-5 w-8 bg-gray-200 rounded-full" />
                  <div className="h-5 w-5 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {recentUsers.map((user, i) => (
              <motion.div
                key={user.id}
                variants={rowVariants}
                className="bg-[#F9F9F9] rounded-2xl px-4 py-4 flex flex-col gap-2 border border-gray-100/80"
              >
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
                  <ProviderIcon firebaseUid={user.firebaseUid} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {detailsUser && (
          <UserDetailsModal
            user={detailsUser}
            onClose={() => setDetailsUser(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

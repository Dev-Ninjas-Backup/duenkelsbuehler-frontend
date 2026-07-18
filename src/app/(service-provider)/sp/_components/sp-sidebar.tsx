"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import { authService } from "@/services/auth/auth-service";
import {
  Briefcase,
  Users,
  Star,
  ShieldCheck,
  Settings,
  Bookmark,
  FileText,
} from "lucide-react";

const navItems = [
  { label: "My Services", href: "/sp/my-services", icon: Briefcase },
  { label: "My Proposals", href: "/sp/my-proposals", icon: FileText },
  { label: "Saved Clients", href: "/sp/saved-clients", icon: Users },
  { label: "Saved Contracts", href: "/sp/saved-contracts", icon: Bookmark },
  { label: "Rating & Badges", href: "/sp/ratings-rewards", icon: Star },
  { label: "Verify Account", href: "/sp/verify-account", icon: ShieldCheck },
  { label: "Settings", href: "/sp/settings", icon: Settings },
];

interface SPSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SPSidebar({ isOpen, onToggle }: SPSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleSwitchProfile = async () => {
    if (!accessToken) return;
    try {
      const res = await authService.switchRole("CLIENT", accessToken);
      
      // Update active token and role in Zustand store (persisted synchronously in localStorage)
      useAuthStore.setState({
        accessToken: res.accessToken,
        role: "CLIENT"
      });

      // Redirect directly via window.location to avoid client-side Next.js route guard race condition
      window.location.href = "/client/settings";
    } catch (err) {
      console.error("Failed to switch profile", err);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute lg:relative top-4 bottom-[130px] md:top-6 lg:top-auto lg:bottom-auto lg:h-full bg-[#F5F5F5] rounded-[30px] overflow-visible shrink-0 z-40 flex flex-col items-center lg:shadow-md shadow-2xl"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[320px] h-full flex flex-col px-6 py-6 lg:py-8"
            >
              {/* Logo */}
              <div className="flex flex-col items-center mb-4 lg:mb-6">
                <span className="font-rozha text-[26px] lg:text-[28px] text-[#181D27]">
                  AristoPay
                </span>
                <span className="mt-1 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold font-work-sans text-[#D97706] bg-[#FEF3C7] rounded-full">
                  Provider Mode
                </span>
                {/* Crown badge */}
                <div className="mt-2 mb-2">
                  <Image
                    src={user?.isIdentityVerified ? "/svg/crown.svg" : "/svg/unverified_warning.svg"}
                    alt="Crown"
                    width={32}
                    height={26}
                  />
                </div>
                {/* Avatar */}
                <div className="mt-2 w-[85px] h-[85px] rounded-full overflow-hidden shadow-sm relative flex items-center justify-center bg-[#181D27]">
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="Profile"
                      width={85}
                      height={85}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src="/images/user/user_avatar.png"
                      alt="Profile"
                      width={85}
                      height={85}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                {user?.role?.includes("CLIENT") && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSwitchProfile}
                    className="mt-4 flex items-center justify-between gap-2.5 px-4 py-2 w-44 rounded-xl bg-white border border-gray-200 text-[#181D27] hover:bg-[#181D27] hover:text-white transition-all shadow-xs shrink-0 font-work-sans text-xs font-semibold cursor-pointer"
                  >
                    <span>Switch to Client</span>
                    <ArrowLeftRight size={14} className="opacity-70" />
                  </motion.button>
                )}
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-1 lg:gap-1.5 flex-1 w-full px-4 mt-2 lg:mt-3">
                {navItems.map(({ label, href,  icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(href);
                  return (
                    <Link key={href} href={href} className="w-full">
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center px-5 py-2.5 rounded-full font-work-sans text-[13.5px] lg:text-[14px] font-medium transition-colors ${
                          isActive
                            ? "bg-[#181D27] text-white"
                            : "text-[#535862] hover:bg-[#E5E5E5]/50"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 mr-2" />
                        {label}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button Overlapping Right Edge */}
        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.9 }}
          initial={false}
          animate={{ right: isOpen ? -18 : -46 }}
          className="absolute top-6 z-40 w-9 h-9 rounded-full bg-[#181D27] text-white flex items-center justify-center shadow-lg"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </motion.button>
      </motion.aside>


    </>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  Briefcase,
  Users,
  Star,
  ShieldCheck,
  Settings,
  Bookmark,
} from "lucide-react";

const navItems = [
  { label: "My Services", href: "/sp/my-services", icon: Briefcase },
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
              className="w-[320px] h-full flex flex-col px-6 py-12"
            >
              {/* Logo */}
              <div className="flex flex-col items-center mb-10">
                <span className="font-rozha text-[32px] text-[#181D27]">
                  AristoPay
                </span>
                {/* Crown badge */}
                <div className="mt-4 mb-3">
                  <Image
                    src="/svg/crown.svg"
                    alt="Crown"
                    width={40}
                    height={32}
                  />
                </div>
                {/* Avatar */}
                <div className="mt-4 w-[110px] h-[110px] rounded-full overflow-hidden shadow-sm">
                  <Image
                    src="/images/user/user_avatar.png"
                    alt="Profile"
                    width={110}
                    height={110}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-2 flex-1 w-full px-6 mt-4">
                {navItems.map(({ label, href,  icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(href);
                  return (
                    <Link key={href} href={href} className="w-full">
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center px-8 py-4 rounded-full font-work-sans text-[15px] font-medium transition-colors ${
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
          className="absolute top-6 -right-4 z-40 w-9 h-9 rounded-full bg-[#181D27] text-white flex items-center justify-center shadow-lg"
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

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Briefcase, Users, Star, ShieldCheck, Settings, Bookmark } from "lucide-react";

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
        className="relative h-full bg-[#F5F5F5] rounded-2xl overflow-hidden shrink-0 z-30"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[280px] h-full flex flex-col px-6 py-8"
            >
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <span className="font-rozha text-2xl text-[#181D27]">
                  AristoPay
                </span>
                {/* Crown badge */}
                <div className="mt-3">
                  <Image src="/svg/crown.svg" alt="Crown" width={32} height={24} />
                </div>
                {/* Avatar */}
                <div className="mt-4 w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <Image
                    src="/images/user/user_avatar.png"
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link key={href} href={href}>
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-3 px-5 py-3 rounded-full font-work-sans text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#181D27] text-white"
                            : "text-[#414651] hover:bg-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
        animate={{ left: isOpen ? 268 : 8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute top-6 z-40 w-9 h-9 rounded-full bg-[#181D27] text-white flex items-center justify-center shadow-lg"
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </motion.button>
    </>
  );
}

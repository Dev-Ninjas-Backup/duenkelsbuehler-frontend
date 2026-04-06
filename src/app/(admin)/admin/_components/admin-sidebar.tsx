"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  Handshake,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Globe,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/user-management", icon: Users },
  { label: "Banner Management", href: "/admin/banner-management", icon: ImageIcon },
  { label: "Deal Management", href: "/admin/deal-management", icon: Handshake },
  { label: "Blog Management", href: "/admin/blog-management", icon: BookOpen },
  { label: "Badges Management", href: "/admin/badges-management", icon: Award },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen absolute lg:relative top-0 left-0 bg-[#F9F9F9] overflow-hidden shrink-0 z-40 shadow-2xl lg:shadow-none"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[260px] h-full flex flex-col px-4 py-8"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center justify-center gap-2 mb-8 px-2"
              >
                <Image
                  src="/images/logo/logo.png"
                  alt="AristoPay Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain shrink-0"
                />
                <span className="font-rozha text-2xl text-[#181D27]">
                  AristoPay
                </span>
              </motion.div>

              {/* Nav */}
              <nav className="flex flex-col gap-1">
                {navItems.map(({ label, href, icon: Icon }, i) => {
                  const isActive = pathname === href;
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                    >
                      <Link href={href}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-3 px-5 py-4 rounded-full font-work-sans text-sm transition-colors ${
                            isActive
                              ? "bg-[#181D27] text-white font-medium"
                              : "text-[#414651] hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {label}
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              {/* Bottom Actions */}
              <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-gray-100/50">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Link href="/">
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-full font-work-sans text-sm text-[#414651] hover:bg-gray-50 transition-colors"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      Visit Site
                    </motion.div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <button className="w-full text-left">
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-full font-work-sans text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Log out
                    </motion.div>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Toggle button */}
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
        initial={false}
        animate={{ left: isOpen ? 245 : 8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute lg:fixed top-6 z-[45] w-8 h-8 rounded-full bg-[#181D27] text-white flex items-center justify-center shadow-lg"
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

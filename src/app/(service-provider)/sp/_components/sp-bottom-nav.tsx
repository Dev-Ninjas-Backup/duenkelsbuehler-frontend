"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Wifi, ShoppingBag, User } from "lucide-react";

const bottomItems = [
  { label: "Connect", href: "/sp/messages", icon: Wifi },
  { label: "Transact", href: "/sp/my-services", icon: ShoppingBag },
  { label: "Me", href: "/sp/settings", icon: User },
];

export function SPBottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white border-t border-gray-100 px-6 py-3 pb-safe"
    >
      {bottomItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href) && label === "Transact"
          ? pathname.includes("my-services") || pathname.includes("saved-clients") || pathname.includes("ratings") || pathname.includes("verify")
          : pathname === href;

        const isTransact = label === "Transact";

        if (isTransact) {
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 -mt-8">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="w-16 h-16 rounded-full bg-[#181D27] flex items-center justify-center shadow-xl"
              >
                <Icon className="h-7 w-7 text-white" />
              </motion.div>
              <span className="font-work-sans text-xs text-[#414651] mt-1">{label}</span>
            </Link>
          );
        }

        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-1">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-[#181D27]" : "text-[#9CA3AF]"
                }`}
              />
            </motion.div>
            <span
              className={`font-work-sans text-xs transition-colors ${
                isActive ? "text-[#181D27] font-semibold" : "text-[#9CA3AF]"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </motion.nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Wifi, User } from "lucide-react";
import Image from "next/image";

const bottomItems = [
  { label: "Connect", href: "/sp/connect", icon: Wifi },
  { label: "Transact", href: "/sp/transact", icon: null },
  { label: "Me", href: "/sp/settings", icon: User },
];

export function SPBottomNav({ onMeClick }: { onMeClick: () => void }) {
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
        const isMe = label === "Me";

        if (isTransact) {
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 -mt-8">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="w-16 h-16 rounded-full bg-[#181D27] border-4 border-[#181D27] flex items-center justify-center shadow-xl"
              >
                <Image src="/images/logo/inverse_logo.png" alt="Transact" width={44} height={44} className="object-contain" />
              </motion.div>
              <span className="font-work-sans text-xs text-[#414651] mt-1">{label}</span>
            </Link>
          );
        }

        if (isMe) {
          return (
            <button key={href} onClick={onMeClick} className="flex flex-col items-center gap-1">
              <motion.div whileTap={{ scale: 0.9 }}>
                <span className={`font-work-sans text-xs transition-colors ${isActive ? "text-[#181D27] font-semibold" : "text-[#9CA3AF]"}`}>
                  {label}
                </span>
              </motion.div>
            </button>
          );
        }

        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-1">
            <motion.div whileTap={{ scale: 0.9 }}>
              <span
                className={`font-work-sans text-xs transition-colors ${
                  isActive ? "text-[#181D27] font-semibold" : "text-[#9CA3AF]"
                }`}
              >
                {label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </motion.nav>
  );
}

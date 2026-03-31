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
      className="fixed bottom-0 left-0 right-0 max-w-[1540px] mx-auto z-50 flex items-center justify-around bg-white rounded-t-[32px] border border-b-0 border-gray-100 px-6 py-2 pb-safe mx-8"
    >
      {bottomItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href) && label === "Transact"
          ? pathname.includes("my-services") || pathname.includes("saved-clients") || pathname.includes("ratings") || pathname.includes("verify")
          : pathname === href;

        const isTransact = label === "Transact";
        const isMe = label === "Me";

        if (isTransact) {
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-end gap-1 -mt-8">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="md:w-24 md:h-24 w-16 h-16 rounded-full bg-[#181D27] md:-mt-8 md:border-8 border-white flex items-center justify-center shadow-xl"
              >
                <Image src="/images/logo/inverse_logo.png" alt="Transact" width={54} height={54} className="object-contain" />
              </motion.div>
              <span className="font-work-sans text-sm md:text-base  text-[#414651] mt-1">{label}</span>
            </Link>
          );
        }

        if (isMe) {
          return (
            <button key={href} onClick={onMeClick} className="flex-1 flex flex-col items-center justify-end pb-1 gap-1">
              <motion.div whileTap={{ scale: 0.9 }}>
                <span className={`font-work-sans  text-sm md:text-base transition-colors ${isActive ? "text-[#181D27] font-semibold" : "text-[#9CA3AF]"}`}>
                  {label}
                </span>
              </motion.div>
            </button>
          );
        }

        return (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-end pb-1 gap-1">
            <motion.div whileTap={{ scale: 0.9 }}>
              <span
                className={`font-work-sans  text-sm md:text-base transition-colors ${
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

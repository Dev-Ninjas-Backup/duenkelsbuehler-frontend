"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, ShoppingBag, User } from "lucide-react";

const bottomItems = [
  { label: "Discover", href: "/client/my-services", icon: Compass },
  { label: "Transact", href: "/client/review-proposals", icon: ShoppingBag },
  { label: "Me", href: "/client/settings", icon: User },
];

export function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#181D27] px-6 py-3"
    >
      {bottomItems.map(({ label, href, icon: Icon }) => {
        const isTransact = label === "Transact";

        if (isTransact) {
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 -mt-8">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="w-16 h-16 rounded-full bg-[#181D27] border-4 border-white flex items-center justify-center shadow-xl"
              >
                <Icon className="h-7 w-7 text-white" />
              </motion.div>
              <span className="font-work-sans text-xs text-white mt-1">{label}</span>
            </Link>
          );
        }

        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-1">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Icon className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-work-sans text-xs text-white">{label}</span>
          </Link>
        );
      })}
    </motion.nav>
  );
}

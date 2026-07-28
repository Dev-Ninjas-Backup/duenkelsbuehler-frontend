"use client";

import Image from "next/image";
import { Bell, LogOut, User, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLogout } from "@/hooks/auth/use-auth";

export function AdminHeader() {
  const router = useRouter();
  const logout = useLogout();
  const { user } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-2xs sticky top-0 z-[100]"
    >
      <h2 className="font-rozha text-2xl font-normal text-[#181D27] leading-none">
        Admin Panel
      </h2>

      <div className="flex items-center gap-4">
        <button
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 transition-colors relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#181D27]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
            <div className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name ?? "Admin"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="font-work-sans font-bold text-sm text-[#181D27]">
                    {user?.name?.[0]?.toUpperCase() ?? "A"}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-work-sans text-sm font-semibold text-[#181D27] leading-tight">
                  {user?.name ?? "Admin"}
                </span>
                <span className="font-work-sans text-xs text-[#9CA3AF] leading-tight">
                  Admin
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 font-work-sans rounded-xl p-2 bg-white border border-gray-100 shadow-lg">
            <DropdownMenuLabel className="font-semibold text-[#181D27] pb-2">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem
              onClick={() => router.push("/admin/settings")}
              className="cursor-pointer py-2.5 hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors"
            >
              <User className="mr-2 h-4 w-4 text-[#414651]" />
              <span className="text-sm font-medium text-[#414651]">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/admin/settings")}
              className="cursor-pointer py-2.5 hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="mr-2 h-4 w-4 text-[#414651]" />
              <span className="text-sm font-medium text-[#414651]">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            <DropdownMenuItem onClick={handleLogout}
              className="cursor-pointer py-2.5 hover:bg-red-50 focus:bg-red-50 rounded-lg transition-colors text-red-500 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

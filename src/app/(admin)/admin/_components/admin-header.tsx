"use client";

import Image from "next/image";
import { Bell, LogOut, User, Settings } from "lucide-react";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between px-6 py-4 bg-[#F9F9F9] rounded-b-3xl"
    >
      <h1 className="font-rozha text-xl sm:text-2xl text-[#181D27] pl-12 md:pl-0">
        Admin Panel
      </h1>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={17} className="text-[#181D27]" />
        </motion.button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 sm:pr-3 rounded-full transition-colors outline-none">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
                <Image
                  src="/images/user/user_avatar.png"
                  alt="Admin avatar"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-work-sans text-sm font-semibold text-[#181D27] leading-tight">
                  Alexis
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
            <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors">
              <User className="mr-2 h-4 w-4 text-[#414651]" />
              <span className="text-sm font-medium text-[#414651]">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors">
              <Settings className="mr-2 h-4 w-4 text-[#414651]" />
              <span className="text-sm font-medium text-[#414651]">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-red-50 focus:bg-red-50 rounded-lg transition-colors text-red-500 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

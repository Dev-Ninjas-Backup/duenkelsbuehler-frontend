"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth/use-auth-store";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, role, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/");
    setOpen(false);
  };

  const dashboardHref = role === "CLIENT" ? "/client/discover" : role === "SERVICE_PROVIDER" ? "/sp/connect" : "/admin/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full bg-[#FAFAFA] transition-all duration-300",
        scrolled && "shadow-md",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex flex-col items-center">
              <Image
                src="/images/logo/logo.png"
                alt="AristoPay Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="font-rozha text-2xl sm:text-[32px] font-normal text-[#181D27]">
                AristoPay
              </span>
            </Link>
          </motion.div>


          {/* Desktop Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden lg:flex items-center gap-3"
          >
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-work-sans text-sm text-[#181D27]">
                    <div className="w-7 h-7 rounded-full bg-[#181D27] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <span className="max-w-[120px] truncate">{user?.name}</span>
                    <ChevronDown size={14} className="text-[#414651]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push(dashboardHref)} className="gap-2 cursor-pointer">
                    <LayoutDashboard size={14} /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut size={14} /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" className="font-work-sans rounded-full px-8 py-2.5 h-auto hover:scale-105 transition-transform" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button className="font-work-sans rounded-full px-8 py-2.5 h-auto hover:scale-105 transition-transform" asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="px-6 py-4 border-b">
                  <span className="font-rozha text-xl text-[#181D27]">
                    AristoPay
                  </span>
                </div>


                {/* Mobile Auth Buttons */}
                <div className="mt-auto p-6 border-t space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-2 pb-3 border-b">
                        <div className="w-9 h-9 rounded-full bg-[#181D27] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                        <span className="font-work-sans text-sm font-medium text-[#181D27] truncate">{user?.name}</span>
                      </div>
                      <Button variant="outline" className="font-work-sans w-full rounded-full h-12 gap-2" onClick={() => { router.push(dashboardHref); setOpen(false); }}>
                        <LayoutDashboard size={15} /> Dashboard
                      </Button>
                      <Button className="font-work-sans w-full rounded-full h-12 gap-2 bg-red-500 hover:bg-red-600" onClick={handleLogout}>
                        <LogOut size={15} /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="font-work-sans w-full rounded-full h-12" asChild>
                        <Link href="/login" onClick={() => setOpen(false)}>Log In</Link>
                      </Button>
                      <Button className="font-work-sans w-full rounded-full h-12" asChild>
                        <Link href="/sign-up" onClick={() => setOpen(false)}>Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

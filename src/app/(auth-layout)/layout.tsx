import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Account Authentication",
  description: "Sign in or create an account on AristoPay to manage secure escrow transactions.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}

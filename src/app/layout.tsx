import type { Metadata } from "next";
import { Rozha_One, Work_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700"],
});

const rozhaOne = Rozha_One({
  subsets: ["latin"],
  variable: "--font-rozha",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "AristoPay - Transparent Marketplace for Securing Deals",
  description: "AristoPay - Transparent Marketplace for Securing Deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} ${rozhaOne.variable} font-work-sans antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Rozha_One, Work_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";

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
  metadataBase: new URL("https://aristopay.com"),
  title: {
    default: "AristoPay - Transparent Escrow Marketplace for Securing Deals",
    template: "%s | AristoPay",
  },
  description:
    "AristoPay is a secure, transparent marketplace empowering clients and service providers to execute deals with legally binding contracts and milestone-based Trustap escrow payments.",
  keywords: [
    "escrow payment",
    "freelance marketplace",
    "secure milestone payment",
    "legally binding contract",
    "Trustap escrow",
    "AristoPay",
    "client freelancer agreement",
  ],
  authors: [{ name: "AristoPay Team", url: "https://aristopay.com" }],
  creator: "AristoPay",
  publisher: "AristoPay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "AristoPay - Transparent Escrow Marketplace for Securing Deals",
    description:
      "Secure your transactions and freelance agreements with milestone-based Trustap escrow payments and verified digital contracts.",
    url: "https://aristopay.com",
    siteName: "AristoPay",
    images: [
      {
        url: "/images/hero_img.png",
        width: 1200,
        height: 630,
        alt: "AristoPay Escrow Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AristoPay - Transparent Escrow Marketplace for Securing Deals",
    description:
      "Secure your transactions and freelance agreements with milestone-based Trustap escrow payments and verified digital contracts.",
    images: ["/images/hero_img.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}

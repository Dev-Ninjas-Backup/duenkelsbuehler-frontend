import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read AristoPay's Privacy Policy to learn how we collect, store, protect, and process user data and transaction details.",
  openGraph: {
    title: "Privacy Policy | AristoPay",
    description: "Learn how AristoPay protects your personal data and escrow privacy.",
    url: "https://aristopay.com/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review AristoPay's Terms of Service governing platform usage, escrow dispute resolutions, and user obligations.",
  openGraph: {
    title: "Terms of Service | AristoPay",
    description: "Terms and conditions for using AristoPay escrow and contract services.",
    url: "https://aristopay.com/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

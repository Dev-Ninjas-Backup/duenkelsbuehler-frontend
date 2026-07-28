import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Discover the latest insights, escrow payment guides, contract tips, and marketplace news from the AristoPay team.",
  openGraph: {
    title: "Blog & Insights | AristoPay",
    description:
      "Articles and guides on secure freelance transactions, Trustap escrow, and digital contract security.",
    url: "https://aristopay.com/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

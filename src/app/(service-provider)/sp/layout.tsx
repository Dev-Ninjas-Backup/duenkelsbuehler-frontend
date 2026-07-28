import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Provider Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServiceProviderPortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

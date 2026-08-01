import type { Metadata } from "next";
import { 
  Navbar, 
  HeroSection, 
  QuoteSection, 
  HowItWorksSection, 
  ProtectionSection, 
  WhyWeBuiltSection, 
  StatsSection, 
  PricingSection, 
  FooterCTA 
} from "./_components";

export const metadata: Metadata = {
  title: "Secure Escrow Payments & Legally Binding Contracts",
  description:
    "AristoPay provides milestone-based Trustap escrow payments and legally binding digital contracts for freelancers, agencies, and clients worldwide.",
  openGraph: {
    title: "Secure Escrow Payments & Legally Binding Contracts | AristoPay",
    description:
      "Empowering freelancers and clients to execute deals with guaranteed milestone payments and verified identities.",
    url: "https://aristopay.com",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <QuoteSection />
        <HowItWorksSection />
        <ProtectionSection />
        <WhyWeBuiltSection />
        <StatsSection />
        <PricingSection />
      </main>
      <FooterCTA />
    </div>
  );
}

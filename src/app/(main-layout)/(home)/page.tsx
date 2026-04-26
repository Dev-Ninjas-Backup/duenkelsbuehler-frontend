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
} from "./_components"

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
  )
}

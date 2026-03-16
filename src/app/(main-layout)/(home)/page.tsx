import { Navbar, HeroSection, AboutSection, BlogSection, Footer } from "./_components"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}

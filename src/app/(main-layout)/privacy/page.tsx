"use client";

import { useEffect, useState } from "react";
import { Navbar, Footer } from "../(home)/_components";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "information-collection", title: "1. Information Collection" },
  { id: "how-we-use", title: "2. How We Use Your Data" },
  { id: "data-sharing", title: "3. Data Sharing & Disclosure" },
  { id: "cookies", title: "4. Cookies & Tracking" },
  { id: "data-security", title: "5. Data Security" },
  { id: "your-rights", title: "6. Your Privacy Rights" },
  { id: "third-party", title: "7. Third-Party Links" },
  { id: "policy-updates", title: "8. Updates to This Policy" },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust offset to trigger section change smoothly before the top reaches 0
          if (rect.top <= 160) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset accounts for the sticky Navbar
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#181D27] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 shrink-0 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-rozha text-4xl md:text-5xl lg:text-7xl mb-6 text-center md:text-left"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-work-sans text-gray-300 text-lg md:text-xl max-w-2xl text-center md:text-left leading-relaxed"
          >
            Your privacy is critically important to us at AristoPay. <br className="hidden md:block" />
            <span className="text-[#16A34A] font-medium mt-2 inline-block">Last updated: April 7, 2026.</span>
          </motion.p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* Left: Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 order-2 lg:order-1 font-work-sans text-[#414651] max-w-3xl"
        >
          
          <section id="information-collection" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">1. Information Collection</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              We collect information to provide better services to all our users. Information is collected in the following ways:
            </p>
            <ul className="list-disc pl-6 mb-5 space-y-3 text-base md:text-lg">
              <li><strong className="text-[#181D27]">Information you give us:</strong> This includes your name, email address, billing information, and identity verification credentials required to create an AristoPay account.</li>
              <li><strong className="text-[#181D27]">Information we get from your use of our services:</strong> We collect device information, log data, location tracking, and interaction times to monitor service health and security.</li>
            </ul>
          </section>

          <section id="how-we-use" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">2. How We Use Your Data</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              The data we collect is primarily heavily utilized to maintain, protect, and improve our services setup. Key uses include:
            </p>
            <ul className="list-disc pl-6 mb-5 space-y-3 text-base md:text-lg">
              <li>Facilitating secure financial transactions across regions.</li>
              <li>Validating "AristoAccess+" certifications.</li>
              <li>Processing payouts to verified bank accounts or crypto wallets.</li>
              <li>Personalizing your user dashboard and job/freelance recommendations.</li>
            </ul>
          </section>

          <section id="data-sharing" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">3. Data Sharing & Disclosure</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              We do not share personal information with companies, organizations, or individuals outside of AristoPay except in the following cases:
            </p>
            <p className="leading-loose mb-5 text-base md:text-lg">
              <strong>With your consent:</strong> We will share personal information outside of AristoPay when we have your explicit consent to do so. <br/><br/>
              <strong>For legal reasons:</strong> We will share information if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.
            </p>
          </section>

          <section id="cookies" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">4. Cookies & Tracking</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              We and our partners use various technologies to collect and store information when you visit AristoPay, and this may include using cookies or similar technologies to identify your browser or device.
            </p>
            <p className="leading-loose mb-5 text-base md:text-lg">
              You can set your browser to block all cookies, including cookies associated with our services, or to indicate when a cookie is being set by us. However, many of our services may not function properly if your cookies are disabled.
            </p>
          </section>

          <section id="data-security" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">5. Data Security</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              We work hard to protect AristoPay and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use heavily encrypted databases and SSL/TLS everywhere.
            </p>
            <p className="leading-loose mb-5 text-base md:text-lg">
              We restrict access to personal information to AristoPay employees, contractors, and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations.
            </p>
          </section>

          <section id="your-rights" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">6. Your Privacy Rights</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Depending on your location, you may have the right to request access to the personal data we hold about you, request that we delete or correct your data, or restrict how we process your personal data under the GDPR, CCPA, or other applicable laws.
            </p>
          </section>

          <section id="third-party" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">7. Third-Party Links</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Our Service may contain links to third-party web sites or services that are not owned or controlled by AristoPay. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
            </p>
          </section>

          <section id="policy-updates" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">8. Updates to This Policy</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
            </p>
          </section>

        </motion.div>

        {/* Right: Sticky Sidebar */}
        <aside className="w-full lg:w-[320px] order-1 lg:order-2 shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sticky top-32 lg:top-40 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
          >
            <h3 className="font-rozha text-xl md:text-2xl text-[#181D27] mb-5 pb-4 border-b border-gray-100">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-1.5">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => handleNavClick(e, section.id)}
                    className={`px-4 py-3 rounded-xl font-work-sans text-sm md:text-base transition-all duration-300 flex items-center gap-3 ${
                      isActive
                        ? "bg-[#181D27] text-white font-medium shadow-md translate-x-2"
                        : "text-[#414651] hover:bg-gray-50 hover:text-[#181D27]"
                    }`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeDotPrivacy" className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                    )}
                    {section.title}
                  </a>
                );
              })}
            </nav>
          </motion.div>
        </aside>

      </main>

      <Footer />
    </div>
  );
}

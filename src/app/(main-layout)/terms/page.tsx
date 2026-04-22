"use client";

import { useEffect, useState } from "react";
import { Navbar, Footer } from "../(home)/_components";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "user-verification", title: "2. User Verification" },
  { id: "platform-usage", title: "3. Platform Usage" },
  { id: "payments-fees", title: "4. Payments & Fees" },
  { id: "intellectual-property", title: "5. Intellectual Property" },
  { id: "termination", title: "6. Termination" },
  { id: "limitation", title: "7. Limitation of Liability" },
  { id: "changes", title: "8. Changes to Terms" },
];

export default function TermsPage() {
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
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-work-sans text-gray-300 text-lg md:text-xl max-w-2xl text-center md:text-left leading-relaxed"
          >
            Please read these terms carefully before using AristoPay. <br className="hidden md:block" />
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
          
          <section id="introduction" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">1. Introduction</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Welcome to AristoPay. By accessing or using our platform, you agree to be bound by these Terms of Service. These terms govern your usage of all AristoPay services, interactions, and financial transactions.
            </p>
            <p className="leading-loose mb-5 text-base md:text-lg">
              If you disagree with any part of the terms, you may not access our service. We reserve the right to review and update these terms at our sole discretion. It is your responsibility to periodically check this document for any revisions.
            </p>
          </section>

          <section id="user-verification" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">2. User Verification</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              To utilize complete platform features, users must perform verification. The &quot;AristoAccess+&quot; system verifies the identity of Service Providers to increase client trust.
            </p>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Providing false information during verification constitutes a material breach of these terms and will result in immediate termination of account access, alongside any potential legal action prescribed by governing authority.
            </p>
          </section>

          <section id="platform-usage" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">3. Platform Usage</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              You agree to use our platform strictly for lawful purposes. Harassment, abuse, explicit content, and spamming are strictly prohibited and will be met with a zero-tolerance policy.
            </p>
            <ul className="list-disc pl-6 mb-5 space-y-3 text-base md:text-lg">
              <li><strong className="text-[#181D27]">Exclusivity:</strong> Do not circumvent platform payment systems to conduct transactions established via AristoPay.</li>
              <li><strong className="text-[#181D27]">Professionalism:</strong> Always maintain professional and courteous communication with all users.</li>
              <li><strong className="text-[#181D27]">Integrity:</strong> Respect the privacy and intellectual property rights of other platform users.</li>
            </ul>
          </section>

          <section id="payments-fees" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">4. Payments & Fees</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              All payments facilitated via AristoPay are subject to platform service fees as outlined in our Fee Schedule. Invoices generated must accurately reflect the services rendered.
            </p>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Chargebacks and payment disputes are handled by our internal resolution center. We strongly recommend tracking all project milestones carefully to ensure you are fully protected under our Payment Protection framework.
            </p>
          </section>

          <section id="intellectual-property" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">5. Intellectual Property</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Unless otherwise specified in a specific project contract, Service Providers retain intellectual property rights until full payment has been disbursed. Upon successful payment settlement, the relevant rights transfer entirely to the client as configured in the project scope.
            </p>
          </section>

          <section id="termination" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">6. Termination</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              AristoPay reserves the right to suspend or terminate accounts that violate our policies without prior written notice, though we typically strive to communicate warnings where possible.
            </p>
          </section>

          <section id="limitation" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">7. Limitation of Liability</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              Under no circumstances shall AristoPay be liable for indirect, incidental, or consequential damages resulting from lost data, lost profits, or business interruptions attributed directly to the unexpected failure of the platform.
            </p>
          </section>

          <section id="changes" className="mb-14 lg:mb-20 scroll-mt-32">
            <h2 className="font-rozha text-3xl md:text-4xl text-[#181D27] mb-6">8. Changes to Terms</h2>
            <p className="leading-loose mb-5 text-base md:text-lg">
              When updates are made, the "Last updated" date will reflect the revision. Continued use of the platform after changes implies consent to the revised terms. We encourage frequent review of these policies.
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
                      <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
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

"use client";

import { Navbar, FooterCTA } from "../(home)/_components";
import { motion } from "framer-motion";
import { TermlyPolicy } from "@/components/shared/termly-policy";

const TERMS_POLICY_UUID = "d2e8c9b9-83a6-444c-858e-ebb15ad8d53e";
const TERMS_POLICY_URL = `https://app.termly.io/policy-viewer/policy.html?policyUUID=${TERMS_POLICY_UUID}`;

export default function TermsPage() {
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
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-work-sans text-gray-300 text-lg md:text-xl max-w-2xl text-center md:text-left leading-relaxed"
          >
            Please read these terms carefully before using AristoPay.{" "}
            <br className="hidden md:block" />
            <span className="text-[#16A34A] font-medium mt-2 inline-block">
              Automatically synced and verified via Termly.
            </span>
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-gray-100"
        >
          <TermlyPolicy
            policyId={TERMS_POLICY_UUID}
            policyUrl={TERMS_POLICY_URL}
            title="Terms & Conditions"
          />
        </motion.div>
      </main>

      <FooterCTA />
    </div>
  );
}

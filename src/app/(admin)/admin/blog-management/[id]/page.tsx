"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const MOCK_BLOGS: Record<number, { title: string; image: string; uploadDateTime: string; content: string }> = {
  1: {
    title: "Learn How to Trade Safely Online",
    image: "/images/blog_cover.png",
    uploadDateTime: "19 January 25, 10:00 PM",
    content: "Trading online can be a rewarding experience when done safely. In this article, we cover the essential steps to protect yourself and your assets while engaging in digital transactions. From verifying counterparties to using secure payment methods, we walk you through best practices that every trader should know.\n\nAlways ensure you are transacting with verified users. Look for the AristoAccess+ badge which indicates a verified and trusted service provider. Never share sensitive personal information unless absolutely necessary, and always use the platform's built-in messaging and payment tools.\n\nRemember: due diligence is your best protection. Research your counterparty, review their ratings, and don't hesitate to ask for references before committing to a transaction.",
  },
  2: {
    title: "Welcome to Our Knowledge Center",
    image: "/images/blog_cover.png",
    uploadDateTime: "19 January 25, 10:00 PM",
    content: "Welcome to the AristoPay Knowledge Center — your go-to resource for everything related to our platform. Whether you're a service provider looking to grow your client base or a client seeking trusted professionals, this space is designed to help you get the most out of AristoPay.\n\nExplore our guides on setting up your profile, understanding the verification process, and making the most of AristoAccess+. We regularly update this section with new articles, tips, and platform updates.\n\nHave a question not covered here? Reach out to our support team anytime — we're always here to help.",
  },
};

const DEFAULT_BLOG = {
  title: "Blog Post",
  image: "/images/blog_cover.png",
  uploadDateTime: "19 January 25, 10:00 PM",
  content: "Blog content goes here.",
};

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const blog = MOCK_BLOGS[Number(id)] ?? DEFAULT_BLOG;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </motion.button>
      </div>

      {/* Cover image */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-64 rounded-2xl overflow-hidden bg-gray-200"
      >
        <Image src={blog.image} alt={blog.title} width={800} height={256} className="object-cover w-full h-full" />
      </motion.div>

      {/* Meta */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="font-rozha text-3xl text-[#181D27] mb-2">{blog.title}</h1>
        <p className="font-work-sans text-xs text-[#9CA3AF]">{blog.uploadDateTime}</p>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col gap-4"
      >
        {blog.content.split("\n\n").map((para, i) => (
          <p key={i} className="font-work-sans text-sm text-[#414651] leading-relaxed">
            {para}
          </p>
        ))}
      </motion.div>
    </div>
  );
}

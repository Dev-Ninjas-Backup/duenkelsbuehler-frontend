"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useBlog } from "@/hooks/admin/use-admin";
import { Navbar } from "@/app/(main-layout)/(home)/_components/navbar";
import { Footer } from "@/app/(main-layout)/(home)/_components/footer";

const MDPreview = dynamic(() => import("@uiw/react-md-editor").then((m) => m.default.Markdown), { ssr: false });

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: post, isLoading } = useBlog(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-6 animate-pulse">
            <div className="w-24 h-5 bg-gray-200 rounded-full" />
            <div className="w-full aspect-video rounded-2xl bg-gray-200" />
            <div className="w-3/4 h-8 bg-gray-200 rounded-xl" />
            <div className="w-1/4 h-4 bg-gray-200 rounded-xl" />
            <div className="flex flex-col gap-3">
              {[1,2,3,4,5].map((i) => <div key={i} className="w-full h-4 bg-gray-200 rounded-xl" />)}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-work-sans text-[#414651]">Blog post not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-1.5 font-work-sans text-sm text-[#414651] hover:text-[#181D27] transition-colors mb-8"
          >
            <ChevronLeft size={16} /> Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 mb-8"
          >
            <Image src={post.imageUrl} alt={post.title} width={800} height={450} className="object-cover w-full h-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="font-rozha text-4xl text-[#181D27] mb-2">{post.title}</h1>
            <p className="font-work-sans text-sm text-[#9CA3AF]">
              {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
            data-color-mode="light"
          >
            <MDPreview source={post.content} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

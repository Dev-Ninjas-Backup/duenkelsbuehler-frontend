"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, type Variants } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useBlogs } from "@/hooks/admin/use-admin"
import type { Blog } from "@/types/admin"
import { Navbar, Footer } from "../(home)/_components"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

function BlogCard({ post }: { post: Blog }) {
  const router = useRouter()
  return (
    <motion.div variants={cardVariants} onClick={() => router.push(`/blog/${post.id}`)} className="cursor-pointer h-full">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group py-0! gap-0! h-full flex flex-col bg-white">
        <div className="aspect-[16/10] relative bg-gray-200 overflow-hidden shrink-0">
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <CardContent className="px-6 pt-6 pb-2 flex-1">
          <h3 className="font-rozha text-xl sm:text-2xl font-normal leading-tight mb-3 text-[#181D27] group-hover:text-amber-700 transition-colors">
            {post.title}
          </h3>
          <p className="font-work-sans text-sm text-[#414651] line-clamp-3 leading-relaxed">
            {post.content.replace(/##/g, "").replace(/\*\*/g, "")}
          </p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-4 shrink-0 mt-auto">
          <p className="font-work-sans text-[13px] text-[#9CA3AF] uppercase tracking-wider font-semibold">
            {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function BlogPage() {
  const { data: blogs = [], isLoading } = useBlogs()

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      <main className="flex-1 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="font-rozha text-4xl md:text-5xl lg:text-6xl text-[#181D27] mb-6"
            >
              Insights & Updates
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-work-sans text-[#414651] max-w-2xl mx-auto text-lg leading-relaxed"
            >
              Stay up to date with the latest news, detailed guides, and tips directly from our experts to maximize your success on AristoPay.
            </motion.p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[4/3]" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants} initial="hidden" animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog) => <BlogCard key={blog.id} post={blog} />)}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion, type Variants } from "framer-motion"
import { useBlogs } from "@/hooks/admin/use-admin"
import type { Blog } from "@/types/admin"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export function BlogSection() {
  const { data: blogs = [], isLoading } = useBlogs()
  const latest = blogs.slice(0, 3)

  return (
    <section id="blog" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-work-sans text-sm text-muted-foreground uppercase tracking-wide mb-4"
          >
            Blog
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="font-rozha text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight"
          >
            Insights on Secure Digital <br /> Transactions
          </motion.h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[4/3]" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {latest.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <Link href="/blog"
            className="px-8 py-3.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:scale-105 hover:bg-[#181D27]/90 transition-all shadow-sm flex items-center gap-2">
            View All
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function BlogCard({ blog }: { blog: Blog }) {
  const router = useRouter()
  return (
    <motion.div variants={cardVariants} onClick={() => router.push(`/blog/${blog.id}`)} className="cursor-pointer">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 group py-0! gap-0!">
        <div className="aspect-video relative bg-gray-200 overflow-hidden">
          <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <CardContent className="px-6 pt-6 pb-0">
          <h3 className="font-rozha text-xl font-normal leading-tight mb-3 line-clamp-1">{blog.title}</h3>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <p className="font-work-sans text-sm text-muted-foreground">
            {new Date(blog.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

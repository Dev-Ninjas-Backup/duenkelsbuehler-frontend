"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion, type Variants } from "framer-motion"

interface BlogPost {
  id: string
  title: string
  date: string
  image: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Learn How to Trade Safely Online",
    date: "19 January 2025",
    image: "/images/blog/blog_post_1.png",
  },
  {
    id: "2",
    title: "Welcome to Our Knowledge Center",
    date: "19 January 2025",
    image: "/images/blog/blog_post_2.png",
  },
  {
    id: "3",
    title: "Welcome to Our Knowledge Center",
    date: "19 January 2025",
    image: "/images/blog/blog_post_3.png",
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export function BlogSection() {
  return (
    <section id="blog" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-work-sans text-sm text-muted-foreground uppercase tracking-wide mb-4"
          >
            Blog
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-rozha text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight"
          >
            Insights on Secure Digital <br /> Transactions
          </motion.h2>
        </div>

        {/* Blog Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  const router = useRouter()
  return (
    <motion.div variants={cardVariants} onClick={() => router.push(`/blog/${post.id}`)} className="cursor-pointer">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 group py-0! gap-0!">
          {/* Image */}
          <div className="aspect-video relative bg-gray-200 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          {/* Content */}
          <CardContent className="px-6 pt-6 pb-0">
            <h3 className="font-rozha text-xl sm:text-xl font-normal leading-tight mb-3">
              {post.title}
            </h3>
          </CardContent>
          
          {/* Footer */}
          <CardFooter className="px-6 pb-6 pt-0">
            <p className="font-work-sans text-sm text-muted-foreground">
              {post.date}
            </p>
          </CardFooter>
        </Card>
    </motion.div>
  )
}

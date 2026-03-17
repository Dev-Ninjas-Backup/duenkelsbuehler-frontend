"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LoginIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      className="hidden lg:flex items-center justify-center flex-1"
    >
      <motion.div className="relative w-full max-w-lg aspect-square">
        <Image
          src="/images/logo/auth_img.png"
          alt="AristoPay Illustration"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </motion.div>
  );
}

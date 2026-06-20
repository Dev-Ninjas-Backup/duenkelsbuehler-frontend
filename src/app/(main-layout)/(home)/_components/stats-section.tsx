"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function StatCounter({ value, suffix = "", prefix = "", duration = 1.5 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const startTime = performance.now();
    let animationFrameId: number;

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // easeOutQuad easing
      const easedProgress = progress * (2 - progress);
      const currentCount = Math.round(easedProgress * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration, isInView]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section className="bg-[#00D05A] text-white px-6 md:px-12 lg:px-24 py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col space-y-16">
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="border-b border-white/20 pb-12"
          >
            <h3 className="text-[72px] md:text-[100px] lg:text-[130px] font-normal font-rozha leading-none mb-6 tracking-tighter">
              <StatCounter value={8} suffix="%" />
            </h3>
            <p className="text-[18px] md:text-[22px] font-medium font-work-sans tracking-tight text-white/90">
              Maximum blended transaction fee — no hidden charges
            </p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="border-b border-white/20 pb-12"
          >
            <h3 className="text-[72px] md:text-[100px] lg:text-[130px] font-normal font-rozha leading-none mb-6 tracking-tighter">
              <StatCounter value={150} prefix="$" />
            </h3>
            <p className="text-[18px] md:text-[22px] font-medium font-work-sans tracking-tight text-white/90">
              Minimum transaction size
            </p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <h3 className="text-[72px] md:text-[100px] lg:text-[130px] font-normal font-rozha leading-none mb-6 tracking-tighter">
              <StatCounter value={4} />
            </h3>
            <p className="text-[18px] md:text-[22px] font-medium font-work-sans tracking-tight text-white/90">
              Supported currencies — USD, EUR, GBP, CHF
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

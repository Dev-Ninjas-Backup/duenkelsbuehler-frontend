"use client";

import { motion } from "framer-motion";
import { useAdminUsers } from "@/hooks/admin/use-admin";
import { useBanners } from "@/hooks/admin/use-admin";
import { useAdminFinanceSummary } from "@/hooks/subscription/use-subscription";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function StatsCards() {
  const { data: users = [] } = useAdminUsers();
  const { data: banners = [] } = useBanners();
  const { data: finance } = useAdminFinanceSummary();

  const stats = [
    { label: "Total Revenue", value: finance ? `$${finance.totalRevenueUsd.toLocaleString()}` : "$0" },
    { label: "Total Users", value: users.length.toString() },
    { label: "Active Subscriptions", value: finance?.activeSubscriptions?.toString() ?? "0" },
    { label: "Total Banners", value: banners.length.toString() },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value }) => (
        <motion.div key={label} variants={cardVariants}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-[#F9F9F9] rounded-2xl px-6 py-6">
          <p className="font-work-sans text-sm text-[#9CA3AF] mb-3">{label}</p>
          <p className="font-rozha text-3xl text-[#181D27]">{value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

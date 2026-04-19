"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminFinanceSummary } from "@/hooks/subscription/use-subscription";

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (active && payload?.length) {
    return (
      <div className="bg-[#181D27] text-white rounded-xl px-4 py-2.5 text-center shadow-lg">
        <p className="font-work-sans text-xs text-gray-300">Revenue</p>
        <p className="font-work-sans text-sm font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

export function RevenueChart() {
  const { data: finance, isLoading } = useAdminFinanceSummary();

  const chartData = finance?.monthlyRevenue?.map((m) => ({
    month: m.month.slice(5), // "2025-01" → "01"
    value: m.revenueUsd,
  })) ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
      className="bg-[#F9F9F9] rounded-2xl px-8 py-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="font-work-sans text-sm text-[#9CA3AF]">Total Revenue</p>
          <p className="font-rozha text-3xl text-[#181D27] mt-1">
            {isLoading ? "..." : `$${finance?.totalRevenueUsd?.toLocaleString() ?? 0}`}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-work-sans text-xs text-[#9CA3AF]">All time</span>
            <TrendingUp size={13} className="text-[#16A34A]" />
            <span className="font-work-sans text-xs text-[#16A34A] font-medium">
              {finance?.activeSubscriptions ?? 0} active
            </span>
          </div>
        </div>
      </div>

      <div className="h-52 mt-4" style={{ minWidth: 0 }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="font-work-sans text-sm text-[#9CA3AF]">Loading...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="font-work-sans text-sm text-[#9CA3AF]">No revenue data yet</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#181D27" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#181D27" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false}
                tick={{ fontFamily: "Work Sans", fontSize: 12, fill: "#9CA3AF" }} />
              <Tooltip content={<CustomTooltip />}
                cursor={{ stroke: "#181D27", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="value" stroke="#181D27" strokeWidth={2.5}
                fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: "#181D27" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}

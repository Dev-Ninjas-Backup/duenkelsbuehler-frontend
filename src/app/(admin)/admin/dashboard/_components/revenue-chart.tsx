"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const data = [
  { month: "Jan",  value: 3000 },
  { month: "Feb",  value: 4500 },
  { month: "Mar",  value: 4000 },
  { month: "Apr",  value: 5500 },
  { month: "May",  value: 7000 },
  { month: "Jun",  value: 8500 },
  { month: "July", value: 7800 },
  { month: "Aug",  value: 6500 },
  { month: "Sep",  value: 5800 },
  { month: "Oct",  value: 5000 },
  { month: "Nov",  value: 4200 },
  { month: "Dec",  value: 3800 },
];

const filters = ["Monthly", "Weekly", "Yearly"];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (active && payload?.length) {
    return (
      <div className="bg-[#181D27] text-white rounded-xl px-4 py-2.5 text-center shadow-lg">
        <p className="font-work-sans text-xs text-gray-300">Total Earned</p>
        <p className="font-work-sans text-sm font-bold">80.1% Overall</p>
      </div>
    );
  }
  return null;
}

export function RevenueChart() {
  const [filter, setFilter] = useState("Monthly");
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
      className="bg-[#F9F9F9] rounded-2xl px-8 py-6"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="font-work-sans text-sm text-[#9CA3AF]">Total Revenue</p>
          <p className="font-rozha text-3xl text-[#181D27] mt-1">$12,500</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-work-sans text-xs text-[#9CA3AF]">Last 30 Days</span>
            <TrendingUp size={13} className="text-[#16A34A]" />
            <span className="font-work-sans text-xs text-[#16A34A] font-medium">+12%</span>
          </div>
        </div>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-work-sans text-sm text-[#181D27] hover:border-[#181D27] transition-colors"
          >
            {filter}
            <motion.span animate={{ rotate: filterOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 overflow-hidden min-w-[110px]"
              >
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 font-work-sans text-sm transition-colors ${
                      filter === f ? "bg-[#181D27] text-white" : "text-[#181D27] hover:bg-gray-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chart */}
      <div className="h-52 mt-4" style={{ minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#181D27" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#181D27" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Work Sans", fontSize: 12, fill: "#9CA3AF" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#181D27", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#181D27"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#181D27" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

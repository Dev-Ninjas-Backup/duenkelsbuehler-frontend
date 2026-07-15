"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { Client } from "./types";
import { useSearchClients } from "@/hooks/sp/use-sp";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" as const },
  },
};

interface Props {
  onSelect: (client: Client) => void;
}

export function ClientSearchStep({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading } = useSearchClients({ search, page: currentPage, limit: pageSize });

  const clients = useMemo(() => {
    const rawClients = Array.isArray(data?.data) ? data.data : [];
    return rawClients.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.imageUrl || "/images/user/user_avatar.png",
      verified: u.isIdentityVerified || false,
      trustapUserId: u.trustapUserId || null,
    }));
  }, [data]);

  const totalPages = data?.meta?.totalPages || 1;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Title */}
      <h1 className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-2 shrink-0">
        Send a Proposal
      </h1>
      <p className="font-work-sans text-[13px] lg:text-sm text-[#414651] text-center mb-6 shrink-0">
        Search for the Client you would like to send a proposal to
      </p>

      {/* Search Bar */}
      <div className="relative max-w-sm mx-auto w-full mb-6 shrink-0">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
        />
      </div>

      {/* Table Header */}
      <div className="hidden lg:grid grid-cols-[40px_1fr_120px] bg-[#181D27] text-white rounded-[16px] px-6 py-3.5 mb-3">
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Name / Email</span>
        <span className="font-work-sans text-sm font-medium text-center">Action</span>
      </div>

      {/* Rows */}
      <div className="w-full pr-2 pb-4">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <span className="font-work-sans text-sm text-[#414651]">No clients found</span>
            </div>
          ) : (
            clients.map((client: Client, i: number) => (
              <div
                key={client.id}
                onClick={() => onSelect(client)}
                className="grid grid-cols-1 lg:grid-cols-[40px_1fr_120px] items-center bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 lg:px-6 lg:py-3.5 transition-colors cursor-pointer group shadow-xs"
              >
                <span className="hidden lg:block font-work-sans text-sm font-semibold text-[#181D27]/40">
                  {(currentPage - 1) * pageSize + i + 1}
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/user/user_avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1 mt-0.5 flex-wrap">
                      <span className="font-work-sans text-[15px] font-bold text-[#181D27] group-hover:text-black transition-colors">
                        {client.name}
                      </span>
                      {client.verified ? (
                        <span className="flex items-center gap-1 font-work-sans text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-max">
                          <Image
                            src="/svg/crown.svg"
                            alt="Verified"
                            width={14}
                            height={14}
                          />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-work-sans text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-max">
                          <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />
                          Unverified
                        </span>
                      )}
                    </div>
                    <span className="font-work-sans text-xs text-[#535862]">
                      {client.email}
                    </span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(client);
                    }}
                    className="w-full lg:w-auto h-9 px-4 rounded-full border border-gray-200 text-[#181D27] group-hover:bg-[#181D27] group-hover:text-white group-hover:border-transparent transition-all font-work-sans text-xs font-semibold"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6 bg-transparent shrink-0">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-[#414651] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <div className="flex items-center gap-1.5">
            {getPageNumbers().map((num, i) =>
              num === "..." ? (
                <span key={`dots-${i}`} className="text-gray-400 px-2 select-none">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num as number)}
                  className={`w-9 h-9 rounded-lg font-work-sans text-sm font-semibold transition-all ${
                    currentPage === num
                      ? "bg-[#181D27] text-white"
                      : "text-[#414651] hover:bg-gray-50"
                  }`}
                >
                  {num}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-[#414651] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

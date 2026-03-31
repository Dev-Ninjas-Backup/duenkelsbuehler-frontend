"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddServiceModal, type AddServiceForm } from "./_components/add-service-modal";

interface Service {
  id: number;
  description: string;
  industry: string;
  location: string;
}

const mockServices: Service[] = [
  { id: 1, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Accounting", location: "USA" },
  { id: 2, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Engineering", location: "Australia" },
  { id: 3, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Legal", location: "Canada" },
  { id: 4, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Media", location: "Algeria" },
  { id: 5, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Finance", location: "India" },
  { id: 6, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Technology", location: "UK" },
  { id: 7, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Healthcare", location: "Germany" },
  { id: 8, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Education", location: "Spain" },
  { id: 9, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Marketing", location: "Japan" },
  { id: 10, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Design", location: "Singapore" },
  { id: 11, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Retail", location: "UAE" },
  { id: 12, description: "Corporate lawyer specializing in mergers and aquisitions.", industry: "Logistics", location: "Brazil" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(services.length / pageSize) || 1;
  const paginated = services.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleModalSubmit = (data: AddServiceForm) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...s, ...data } : s))
      );
    } else {
      setServices((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          description: data.description,
          industry: data.industry,
          location: data.location,
        },
      ]);
    }
    setModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="flex flex-col h-full bg-white pb-4 overflow-hidden">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-[48px] text-[#181D27] text-center mt-6 mb-6 shrink-0"
      >
        My Services
      </motion.h1>

      <div className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col px-4 md:px-8 overflow-hidden">

        {/* Table Header */}
        <motion.div
           initial={{ opacity: 0, y: -8 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.35, delay: 0.1 }}
           className="hidden lg:grid grid-cols-[60px_2.5fr_1.5fr_1.5fr_100px] bg-[#181D27] rounded-xl px-10 py-5 mb-4 shadow-sm shrink-0 mr-2"
        >
          <span className="font-work-sans text-sm font-medium text-[#D1D5DB]">Sl</span>
          <span className="font-work-sans text-sm font-medium text-[#D1D5DB]">Service Description</span>
          <span className="font-work-sans text-sm font-medium text-[#D1D5DB]">Industry</span>
          <span className="font-work-sans text-sm font-medium text-[#D1D5DB]">Location</span>
          <span className="font-work-sans text-sm font-medium text-[#D1D5DB] text-center">Action</span>
        </motion.div>

        {/* Table Rows */}
        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            {paginated.map((service, index) => {
              const rowSl = (currentPage - 1) * pageSize + index + 1;
              return (
              <motion.div
                key={service.id}
                variants={rowVariants}
                layout
                className="flex flex-col lg:grid lg:grid-cols-[60px_2.5fr_1.5fr_1.5fr_100px] bg-[#F5F5F5] lg:bg-[#F5F5F5] rounded-[24px] px-5 py-5 lg:px-10 lg:py-4 items-start lg:items-center border border-gray-100/80 hover:bg-[#EFEFEF] transition-colors gap-3 lg:gap-0"
              >
                {/* Desktop ID / Mobile Header */}
                <span className="hidden lg:block font-work-sans text-base font-semibold text-[#181D27] lg:pl-2">
                  {rowSl}
                </span>

                <div className="flex w-full items-center justify-between lg:hidden mb-1 border-b border-gray-200 pb-3">
                  <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Service #{rowSl}</span>
                  <div className="flex items-center gap-2">
                    <motion.button 
                      whileTap={{ scale: 0.9 }} 
                      onClick={() => {
                        setEditingService(service);
                        setModalOpen(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-[#414651] hover:text-[#181D27]"
                    >
                      <AiFillEdit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(service.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-red-500 hover:bg-red-50"
                    >
                      <AiFillDelete className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col w-full lg:w-auto lg:pr-12">
                  <span className="lg:hidden text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Description</span>
                  <span className="font-work-sans text-[13px] text-[#535862] leading-[1.6]">
                    {service.description}
                  </span>
                </div>

                {/* Industry */}
                <div className="flex w-full items-center justify-between lg:justify-start lg:w-auto">
                  <span className="lg:hidden text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Industry</span>
                  <span className="font-work-sans text-[14px] font-medium text-[#181D27] bg-white lg:bg-transparent px-3 py-1 rounded-full lg:p-0 lg:rounded-none shadow-sm lg:shadow-none">
                    {service.industry}
                  </span>
                </div>

                {/* Location */}
                <div className="flex w-full items-center justify-between lg:justify-start lg:w-auto">
                  <span className="lg:hidden text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Location</span>
                  <span className="font-work-sans text-[14px] font-medium text-[#181D27]">
                    {service.location}
                  </span>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center justify-center gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setEditingService(service);
                      setModalOpen(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#414651] hover:text-[#181D27]"
                  >
                    <AiFillEdit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(service.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-red-500 hover:bg-red-50"
                  >
                    <AiFillDelete className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            )})}
          </motion.div>
        </div>

        {/* Add Service Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex justify-end mt-4 mb-4 shrink-0"
        >
          <Button
            onClick={() => {
              setEditingService(null);
              setModalOpen(true);
            }}
            className="rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold px-8 h-12 shadow-md"
          >
            + Add Service
          </Button>
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex items-center justify-between shrink-0"
        >
          {/* Show entries */}
          <div className="flex items-center gap-2">
            <span className="font-work-sans text-sm text-[#414651]">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Entries per page"
              className="h-8 px-2 rounded-lg border border-gray-200 font-work-sans text-sm text-[#181D27] focus:outline-none cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="font-work-sans text-sm text-[#414651]">entries</span>
          </div>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {/* Prev */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-9 h-9 flex items-center justify-center font-work-sans text-sm text-[#414651]"
                >
                  ...
                </span>
              ) : (
                <motion.button
                  key={page}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-9 h-9 rounded-full font-work-sans text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[#181D27] text-white"
                      : "border border-gray-200 text-[#414651] hover:bg-gray-50"
                  }`}
                >
                  {page}
                </motion.button>
              ),
            )}

            {/* Next */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AddServiceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={
          editingService
            ? {
                industry: editingService.industry,
                description: editingService.description,
                location: editingService.location,
              }
            : undefined
        }
      />
    </div>
  );
}

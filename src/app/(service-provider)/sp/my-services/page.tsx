"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
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
];

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

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddService = (data: AddServiceForm) => {
    setServices((prev) => [
      ...prev,
      { id: prev.length + 1, description: data.description, industry: data.industry, location: data.location },
    ]);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full px-2 py-6 lg:px-8">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        My Services
      </motion.h1>

      {/* Table Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-[40px_1fr_140px_140px_100px] bg-[#181D27] text-white rounded-xl px-6 py-4 mb-3"
      >
        <span className="font-work-sans text-sm font-medium">Sl</span>
        <span className="font-work-sans text-sm font-medium">Service Description</span>
        <span className="font-work-sans text-sm font-medium text-center">Industry</span>
        <span className="font-work-sans text-sm font-medium text-center">Location</span>
        <span className="font-work-sans text-sm font-medium text-center">Action</span>
      </motion.div>

      {/* Table Rows */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 flex-1"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={rowVariants}
            layout
            className="grid grid-cols-[40px_1fr_140px_140px_100px] bg-[#F9F9F9] rounded-xl px-6 py-4 items-center"
          >
            <span className="font-work-sans text-sm text-[#414651]">{service.id}</span>
            <span className="font-work-sans text-sm text-[#414651] pr-4">{service.description}</span>
            <span className="font-work-sans text-sm text-[#414651] text-center">{service.industry}</span>
            <span className="font-work-sans text-sm text-[#414651] text-center">{service.location}</span>
            <div className="flex items-center justify-center gap-3">
              <motion.button whileTap={{ scale: 0.85 }} className="text-[#414651] hover:text-[#181D27] transition-colors">
                <Pencil className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleDelete(service.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Service Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-end mt-8"
      >
        <Button
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold px-8 h-12"
        >
          + Add Service
        </Button>
      </motion.div>

      {/* Modal */}
      <AddServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddService}
      />
    </div>
  );
}

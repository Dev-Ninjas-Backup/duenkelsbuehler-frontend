"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, MessageSquare, AlertTriangle } from "lucide-react";
import { useServiceItem } from "@/hooks/sp/use-sp";
import { useMemo } from "react";

interface ServiceProviderDetail {
  id: number;
  dbId: string;
  email: string;
  name: string;
  imageUrl: string | null;
  isIdentityVerified: boolean;
  serviceItems: {
    id: number;
    description: string;
    industry: string;
    location: string;
    createdAt: string;
    workflowStatus: string;
  }[];
}

export default function ServicesPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // Fetch the service provider profile using the same GET /services/{id} API
  const { data: rawSp, isLoading } = useServiceItem(Number(id));
  const sp = rawSp as unknown as ServiceProviderDetail | undefined;

  const services = sp?.serviceItems ?? [];

  // Extract all unique industries to display as tags
  const tags = useMemo(() => {
    return Array.from(new Set(services.map((s) => s.industry).filter(Boolean)));
  }, [services]);

  // Extract the description and location from the first service item (as a primary profile info)
  const description = services[0]?.description ?? "No description provided.";
  const location = services[0]?.location ?? "Not specified";

  return (
    <div className="flex flex-col items-center min-h-full bg-white rounded-2xl overflow-hidden pb-12 shadow-sm border border-gray-100/50 relative">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => router.push(`/client/discover/${id}`)} 
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100"
          aria-label="Go back to profile"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Dark header band */}
      <div className="w-full bg-[#181D27] h-28" />

      <div className="flex flex-col items-center px-6 pb-10 -mt-14 w-full">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3 bg-[#181D27] flex items-center justify-center relative shrink-0"
        >
          {sp?.imageUrl ? (
            <Image
              src={sp.imageUrl}
              alt={sp?.name ?? "Profile"}
              fill
              className="object-cover"
            />
          ) : (
            <span className="font-rozha text-3xl text-white">
              {sp?.name?.charAt(0).toUpperCase() ?? "?"}
            </span>
          )}
        </motion.div>

        {/* Verification Status Badge */}
        {isLoading ? (
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse mb-6" />
        ) : sp?.isIdentityVerified ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-1 text-[#16A34A] font-work-sans text-xs font-semibold mb-6 bg-green-50 border border-green-200 px-3 py-1 rounded-full shadow-sm"
          >
            <Image src="/svg/crown.svg" alt="Verified Crown" width={12} height={10} className="object-contain" />
            Verified
          </motion.span>
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-1 text-red-600 font-work-sans text-xs font-semibold mb-6 bg-red-50 border border-red-200 px-3 py-1 rounded-full shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Unverified
          </motion.span>
        )}

        {/* Services Section */}
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="font-rozha text-3xl text-[#181D27] font-bold mb-3"
        >
          Services
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8 max-w-md"
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
            ))
          ) : tags.length > 0 ? (
            tags.map((tag, i) => (
              <span
                key={i}
                className="bg-[#181D27] text-white rounded-full px-3.5 py-1 font-work-sans text-xs font-medium shadow-sm"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-gray-400 font-work-sans text-xs italic">No services posted yet</span>
          )}
        </motion.div>

        {/* Description Section */}
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="font-rozha text-3xl text-[#181D27] font-bold mb-3"
        >
          Description
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="font-work-sans text-sm text-[#414651] text-center max-w-md mb-8 leading-relaxed"
        >
          {isLoading ? (
            <span className="block h-4 bg-gray-200 rounded animate-pulse w-full max-w-xs mx-auto" />
          ) : (
            description
          )}
        </motion.p>

        {/* Location Section */}
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="font-rozha text-3xl text-[#181D27] font-bold mb-2"
        >
          Location
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          className="font-work-sans text-sm text-[#414651] mb-8 font-medium"
        >
          {isLoading ? (
            <span className="block h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto" />
          ) : (
            location
          )}
        </motion.p>

        {/* Message Action Button */}
        {!isLoading && sp && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.42 }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/client/messages?spId=${sp.id}`)}
              className="flex items-center gap-2 px-8 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              Message
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

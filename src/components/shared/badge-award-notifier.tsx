"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMyBadges } from "@/hooks/admin/use-admin";
import { useAuthStore } from "@/stores/auth/use-auth-store";

interface EarnedBadge {
  id: number;
  userId: number;
  badgeId: number;
  awardedAt: string;
  badge: {
    id: number;
    type: string;
    title: string;
    description: string;
    imageUrl: string;
  };
}

export function BadgeAwardNotifier() {
  const user = useAuthStore((s) => s.user);
  const { data: earnedBadges = [] } = useMyBadges();
  const [activeAward, setActiveAward] = useState<EarnedBadge | null>(null);

  useEffect(() => {
    if (!user || earnedBadges.length === 0) return;

    const storageKey = `aristopay_seen_badges_${user.id}`;
    const seenBadgesStr = localStorage.getItem(storageKey);

    if (!seenBadgesStr) {
      // First load: initialize seen badges so existing badges do not trigger popup on first login
      const ids = earnedBadges.map((eb: EarnedBadge) => eb.badgeId);
      localStorage.setItem(storageKey, JSON.stringify(ids));
      return;
    }

    try {
      const seenIds: number[] = JSON.parse(seenBadgesStr);
      // Find any newly earned badge that isn't in seen list
      const newAward = earnedBadges.find((eb: EarnedBadge) => !seenIds.includes(eb.badgeId));

      if (newAward) {
        // Play notification sound
        try {
          const audio = new Audio("/sounds/modal_open_sound.mp3");
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch {}

        setActiveAward(newAward);
        // Save the updated list of seen badge IDs
        const updatedIds = [...seenIds, newAward.badgeId];
        localStorage.setItem(storageKey, JSON.stringify(updatedIds));
      }
    } catch (err) {
      console.error("Error parsing seen badges", err);
    }
  }, [earnedBadges, user]);

  const handleClose = () => {
    setActiveAward(null);
  };

  return (
    <AnimatePresence>
      {activeAward && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          {/* Confetti particles pop animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const velocity = 80 + Math.random() * 150;
              const x = Math.cos(angle) * velocity;
              const y = Math.sin(angle) * velocity - 100;
              const colors = ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6", "#EF4444"];
              
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                  animate={{ 
                    x, 
                    y, 
                    scale: [0.5, 1.2, 0.8], 
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 w-3.5 h-3.5 rounded-sm"
                  style={{
                    backgroundColor: colors[i % colors.length],
                  }}
                />
              );
            })}
          </div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 relative overflow-hidden"
          >
            {/* Soft decorative radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.06),transparent_60%)] pointer-events-none" />

            <span className="font-work-sans text-[11px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full inline-block mb-5">
              🏆 Badge Unlocked!
            </span>

            {/* Badge Image Frame */}
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-28 h-28 mx-auto relative flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl p-4 shadow-sm mb-6"
            >
              <Image
                src={activeAward.badge.imageUrl}
                alt={activeAward.badge.title}
                width={90}
                height={90}
                className="object-contain animate-bounce"
                style={{ animationDuration: "3s" }}
              />
            </motion.div>

            <h2 className="font-rozha text-2xl lg:text-3xl text-[#181D27] mb-2">
              {activeAward.badge.title}
            </h2>

            <p className="font-work-sans text-xs text-[#535862] leading-relaxed mb-8 px-2">
              {activeAward.badge.description}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full h-12 bg-[#181D27] text-white font-work-sans text-sm font-semibold rounded-2xl hover:bg-[#181D27]/90 transition-colors shadow-sm"
            >
              Awesome!
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

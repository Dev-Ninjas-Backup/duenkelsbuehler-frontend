import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  name: string;
  onSubmit: (rating: number, comment: string) => void;
  onSkip: () => void;
}

export function RatingModal({ isOpen, name, onSubmit, onSkip }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center gap-5"
          >
            <h2 className="font-rozha text-3xl text-[#181D27]">Rate Your Experience</h2>
            <p className="font-work-sans text-sm text-[#414651]">
              How was your transaction with <span className="font-semibold text-[#181D27]">{name}</span>?
            </p>

            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const val = i + 1;
                const filled = val <= (hovered || rating);
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.85 }}
                    onMouseEnter={() => setHovered(val)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(val)}
                    className="focus:outline-none"
                  >
                    <svg viewBox="0 0 16 16" className="w-9 h-9 transition-colors" fill={filled ? "#F59E0B" : "#E5E7EB"}>
                      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
                    </svg>
                  </motion.button>
                );
              })}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment (optional)..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] resize-none transition-colors"
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full py-4 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors"
            >
              Submit Rating
            </motion.button>

            <button
              onClick={onSkip}
              className="font-work-sans text-sm text-[#414651] underline underline-offset-2 hover:text-[#181D27] transition-colors"
            >
              Skip
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

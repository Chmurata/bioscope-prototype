import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

export default function EpisodeTransition() {
  const { showTransition, setShowTransition, selectedDrama, currentEpisode, playEpisode } = useApp();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!showTransition) {
      setCountdown(3);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-advance
          const nextEp = currentEpisode + 1;
          if (nextEp <= (selectedDrama?.totalEpisodes || 999)) {
            playEpisode(nextEp);
          }
          setShowTransition(false);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showTransition]);

  if (!showTransition || !selectedDrama) return null;

  const nextEp = currentEpisode + 1;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          {/* Countdown ring */}
          <div className="relative w-[56px] h-[56px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="25" fill="rgba(255,255,255,0.1)" stroke="none" />
              <circle
                cx="28" cy="28" r="25"
                fill="none"
                stroke="#4085F4"
                strokeWidth="3"
                strokeDasharray="157"
                style={{
                  animation: 'countdown-ring 3s linear forwards',
                }}
              />
            </svg>
          </div>

          {/* Countdown number */}
          <motion.span
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[22px] font-bold text-white"
          >
            {countdown}
          </motion.span>

          <span className="text-[16px] font-medium text-white">Next: EP.{nextEp}</span>

          {/* Cancel button */}
          <button
            onClick={() => setShowTransition(false)}
            className="mt-2 px-5 py-2 rounded-full border border-text-dim text-[13px] font-medium text-text-secondary cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-16 left-4 right-4 z-10">
          <h3 className="text-[14px] font-bold text-white">{selectedDrama.title}</h3>
          <p className="text-[11px] text-text-muted">EP.{currentEpisode} Completed &bull; Up Next: EP.{nextEp}</p>
        </div>

        {/* Completed seekbar */}
        <div className="absolute bottom-10 left-0 right-0 h-[3px] bg-accent z-10" />
      </motion.div>
    </AnimatePresence>
  );
}

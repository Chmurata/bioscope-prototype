import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

/**
 * Tiny glassmorphic "Unlock Premium" chip with an animated shine sweep.
 * Placed just above the title block in the Player.
 */
export default function PremiumChip({ onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative overflow-hidden inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 cursor-pointer bg-white/10 backdrop-blur-md ring-1 ring-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
    >
      {/* Shine sweep */}
      <motion.span
        className="absolute inset-y-0 w-[40%] pointer-events-none"
        style={{
          background:
            'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.45) 50%, transparent 80%)',
        }}
        initial={{ x: '-120%' }}
        animate={{ x: '260%' }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
      />
      <Crown size={11} className="text-amber-300" fill="#fcd34d" />
      <span className="text-[10px] font-semibold text-white tracking-wide">Unlock Premium</span>
    </motion.button>
  );
}

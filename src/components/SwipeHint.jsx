import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

/**
 * One-time overlay that teaches "swipe up for next episode".
 * Auto-dismisses after ~3s via onDismiss (parent-controlled visibility).
 */
export default function SwipeHint({ visible, onDismiss }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onDismiss?.(), 3200);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute inset-x-0 bottom-[120px] z-30 flex justify-center"
        >
          <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 ring-1 ring-white/10">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronUp size={14} className="text-white" />
            </motion.div>
            <span className="text-[11px] font-medium text-white">
              Swipe up for next episode
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

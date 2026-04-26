import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

/**
 * Floating heart that pops at the tap coordinates for ~700ms.
 * Controlled via a `hearts` array of { id, x, y } emitted by the consumer.
 * Coordinates are relative to the nearest positioned ancestor (the Player root).
 */
export default function DoubleTapHeart({ hearts }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            className="absolute"
            style={{ left: h.x - 40, top: h.y - 40 }}
            initial={{ scale: 0, opacity: 0, rotate: -15 }}
            animate={{ scale: [0, 1.3, 1.1], opacity: [0, 1, 1, 0], rotate: [-15, 0, 10] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, times: [0, 0.3, 0.7, 1] }}
          >
            <Heart
              size={80}
              fill="#ff3b5c"
              className="text-[#ff3b5c] drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

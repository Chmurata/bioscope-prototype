import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

// Bioscope+ hero carousel.
// - Portrait cards with peek-on-both-sides (~24px visible of prev/next)
// - Drag/swipe to advance, auto-advance every AUTOPLAY_MS, resets on manual interaction
// - Active card gets overlay: title · genres · "▶ Play Now" white pill
// - Emits active slide via onActiveChange so the top bar can tint with dominant color
const CARD_W = 288;    // card width
const CARD_H = 432;    // card height (roughly 2:3)
const GAP = 8;
const STEP = CARD_W + GAP;
const AUTOPLAY_MS = 5000;
const DRAG_THRESHOLD = 60;

export default function HeroCarousel({ slides, onActiveChange, onPlay, viewportWidth = 360 }) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef(null);

  // Center offset: position active card in the middle of the viewport
  const centerX = (viewportWidth - CARD_W) / 2;

  useEffect(() => {
    onActiveChange?.(slides[index]);
  }, [index, slides, onActiveChange]);

  useEffect(() => {
    if (dragging) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [index, dragging, slides.length]);

  function handleDragEnd(_e, info) {
    setDragging(false);
    const { offset, velocity } = info;
    const threshold = Math.abs(velocity.x) > 500 ? 20 : DRAG_THRESHOLD;
    if (offset.x < -threshold && index < slides.length - 1) setIndex(index + 1);
    else if (offset.x > threshold && index > 0) setIndex(index - 1);
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: CARD_H + 28 }}>
      <motion.div
        className="flex"
        style={{ gap: GAP, paddingLeft: centerX, paddingRight: centerX }}
        animate={{ x: -index * STEP }}
        drag="x"
        dragConstraints={{ left: -(slides.length - 1) * STEP, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setDragging(true)}
        onDragEnd={handleDragEnd}
        transition={{ type: 'spring', damping: 34, stiffness: 240 }}
      >
        {slides.map((slide, i) => {
          const isActive = i === index;
          return (
            <motion.div
              key={slide.id}
              className="relative rounded-[16px] overflow-hidden shrink-0 bg-black"
              style={{ width: CARD_W, height: CARD_H }}
              animate={{ scale: isActive ? 1 : 0.92, opacity: isActive ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <img src={slide.poster} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />

              {/* Active overlay only */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 px-4">
                      <h2 className="text-[32px] font-bold text-white text-center leading-none mb-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                        {slide.title}
                      </h2>
                      <div className="flex items-center gap-2 mb-4">
                        {slide.platform && (
                          <span className="text-[11px] text-white/80">{slide.platform}</span>
                        )}
                        {slide.genres.map((g, gi) => (
                          <span key={g} className="flex items-center gap-2">
                            {(gi > 0 || slide.platform) && <span className="text-white/40 text-[11px]">·</span>}
                            <span className="text-[11px] text-white/90 underline decoration-white/40 underline-offset-2">{g}</span>
                          </span>
                        ))}
                        <span className="text-white/40 text-[11px]">·</span>
                        <span className="text-[10px] font-bold text-[#2a2a2a] bg-white/90 rounded-[3px] px-1.5 py-[1px] leading-none">{slide.rating}</span>
                      </div>
                      <button
                        onClick={() => onPlay?.(slide)}
                        className="flex items-center gap-2 bg-white rounded-full px-6 py-2.5 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                      >
                        <Play size={16} className="text-[#2a2a2a]" fill="#2a2a2a" />
                        <span className="text-[14px] font-semibold text-[#2a2a2a]">Play Now</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dot indicators */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-[4px] rounded-full transition-all ${
              i === index ? 'w-[18px] bg-white' : 'w-[4px] bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

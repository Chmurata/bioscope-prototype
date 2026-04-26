import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, Megaphone, X } from 'lucide-react';

/**
 * Full-page ad — FB Reels sponsored-ad layout.
 * - Title pill top-center (2-line ellipsis)
 * - Full-bleed creative
 * - Bottom stack: brand row -> description -> full-width CTA -> Sponsored chip
 * - Right action column: Like / Comment / Share / Save / More
 * Auto-advance after `autoAdvanceMs` (default 5000ms) or swipe to dismiss.
 */
export default function FullPageAd({ ad, onDismiss, autoAdvanceMs = 5000 }) {
  const [remaining, setRemaining] = useState(autoAdvanceMs);
  // Tracks which direction to exit toward — set by drag end or auto-advance.
  // 'up' means user swiped up (ad slides up out); 'down' means swiped down.
  const [exitDirection, setExitDirection] = useState('up');

  useEffect(() => {
    if (!ad) return;
    setExitDirection('up');
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setRemaining(Math.max(0, autoAdvanceMs - elapsed));
      if (elapsed >= autoAdvanceMs) {
        clearInterval(tick);
        onDismiss?.();
      }
    }, 100);
    return () => clearInterval(tick);
  }, [ad, autoAdvanceMs, onDismiss]);

  const progressPct = 100 - (remaining / autoAdvanceMs) * 100;

  return (
    <AnimatePresence>
      {ad && (
        <motion.div
          className="absolute inset-0 z-[45] bg-black"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: exitDirection === 'down' ? '100%' : '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 250 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.4}
          onDragEnd={(_e, info) => {
            const passedThreshold = Math.abs(info.offset.y) > 80 || Math.abs(info.velocity.y) > 400;
            if (!passedThreshold) return;
            // Negative offset = dragged up → exit upward; positive = dragged down → exit downward
            setExitDirection(info.offset.y < 0 ? 'up' : 'down');
            onDismiss?.();
          }}
        >
          {/* Background creative */}
          <img src={ad.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

          {/* Top bar — skip-ad button only (Facebook Reels-style chrome removed) */}
          <div className="absolute top-[36px] right-4 z-10">
            <button
              onClick={onDismiss}
              className="w-[26px] h-[26px] rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer"
              aria-label="Skip ad"
            >
              <X size={14} className="text-white" />
            </button>
          </div>

          {/* Title pill */}
          <div className="absolute top-[76px] left-0 right-0 z-10 px-6 flex justify-center">
            <div className="bg-white rounded-[12px] px-3 py-2 max-w-[280px] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <p className="text-[16px] font-bold text-black leading-tight line-clamp-2 text-center">
                {ad.title}
              </p>
            </div>
          </div>

          {/* Right action column */}
          <div className="absolute right-3 bottom-[170px] z-10 flex flex-col items-center gap-4">
            <ActionIcon Icon={ThumbsUp} count={ad.stats?.likes ?? '934'} />
            <ActionIcon Icon={MessageCircle} count={ad.stats?.comments ?? '37'} />
            <ActionIcon Icon={Share2} count={ad.stats?.shares ?? '18'} />
            <ActionIcon Icon={Bookmark} count={ad.stats?.saves ?? '91'} />
            <MoreHorizontal size={22} className="text-white" />
          </div>

          {/* Bottom stack */}
          <div className="absolute bottom-0 left-0 right-[54px] z-10 px-4 pb-[82px]">
            {/* Brand row */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-[30px] h-[30px] rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img src={ad.brandLogo ?? ad.image} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-[13px] font-bold text-white">{ad.brand}</span>
              {ad.verified && <span className="text-[10px] text-white/70">✓</span>}
              <span className="text-white/50">·</span>
            </div>

            {/* Description */}
            <p className="text-[12px] text-white/90 mb-3">
              {ad.description}
              <span className="text-white/50 ml-1">more</span>
            </p>

            {/* CTA button */}
            <button
              onClick={onDismiss}
              className="w-full bg-white/15 backdrop-blur-sm rounded-[4px] py-2.5 text-white font-bold text-[14px] cursor-pointer ring-1 ring-white/20"
            >
              {ad.cta}
            </button>

            {/* Sponsored chip */}
            <div className="mt-3 inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Megaphone size={10} className="text-white/80" />
              <span className="text-[10px] text-white/80 font-medium">Sponsored</span>
            </div>
          </div>

          {/* Auto-advance progress bar */}
          <div className="absolute bottom-[80px] left-0 right-0 h-[2px] bg-white/10 z-10">
            <div className="h-full bg-white/70" style={{ width: `${progressPct}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ActionIcon({ Icon, count }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon size={22} className="text-white" strokeWidth={1.8} />
      <span className="text-[10px] text-white/90 font-semibold tabular-nums">{count}</span>
    </div>
  );
}

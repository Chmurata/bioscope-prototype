import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, Megaphone, X, RotateCcw, ChevronRight } from 'lucide-react';

/**
 * Full-page sponsored ad with the three GP-requested flows:
 *   1. SKIP   — top-right `Skip in Ns` countdown → tappable `Skip Ad ›` after
 *               the skip threshold. Present on every ad.
 *   2. REPLAY — appears alongside the active Skip button (same moment the skip
 *               threshold passes — never shown disabled). Restarts the CURRENT
 *               ad's countdown. Never navigates across ads.
 *   3. STREAK — non-last ads autoplay one after another (YouTube-style): when the
 *               timer completes, onAutoFinish() advances to the next ad. The LAST
 *               ad (and a single ad) does NOT auto-advance — it rests on screen
 *               with Skip + Replay active until the user skips out. Top-left
 *               `Ad N of M` pill.
 */
export default function FullPageAd({
  ad,
  streakIndex = 0,
  streakCount = 1,
  allowSkip = true,
  allowReplay = true,
  autoAdvanceMs = 8000,
  skipAfterMs = 5000,
  onSkip,
  onAutoFinish,
}) {
  const [remaining, setRemaining] = useState(autoAdvanceMs);
  // Bumped on Replay to force the countdown effect to restart cleanly.
  const [runId, setRunId] = useState(0);
  const [exitDirection, setExitDirection] = useState('up');

  // Reset whenever a new ad/streak slot mounts.
  useEffect(() => {
    if (!ad) return;
    setRemaining(autoAdvanceMs);
    setRunId(0);
    setExitDirection('up');
  }, [ad?.id, streakIndex, autoAdvanceMs]);

  const isLast = streakIndex >= streakCount - 1;

  // Countdown driver. Non-last ads auto-advance on completion; the last ad
  // (or a single ad) just rests at 0 with Skip + Replay active.
  useEffect(() => {
    if (!ad) return;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, autoAdvanceMs - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(tick);
        if (!isLast) onAutoFinish?.();
      }
    }, 100);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad?.id, streakIndex, runId]);

  const progressPct = 100 - (remaining / autoAdvanceMs) * 100;
  const skipSecondsLeft = Math.max(0, Math.ceil((skipAfterMs - (autoAdvanceMs - remaining)) / 1000));
  const skipReady = allowSkip && skipSecondsLeft <= 0;
  // Replay surfaces at the same moment the Skip button becomes active.
  const replayReady = allowReplay && skipReady;

  const handleReplay = () => {
    setRemaining(autoAdvanceMs);
    setRunId((n) => n + 1);
  };

  const handleSkip = () => {
    setExitDirection('up');
    onSkip?.();
  };

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
            setExitDirection(info.offset.y < 0 ? 'up' : 'down');
            // Drag-to-dismiss advances the streak (same as skip / auto-finish).
            onSkip?.();
          }}
        >
          {/* Background creative */}
          <img src={ad.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />

          {/* Top-left streak pill */}
          {streakCount > 1 && (
            <div className="absolute top-[36px] left-4 z-10">
              <span className="inline-flex items-center gap-1 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Megaphone size={10} className="text-white/80" />
                <span className="text-[10px] font-semibold text-white tracking-wide">
                  Ad {streakIndex + 1} of {streakCount}
                </span>
              </span>
            </div>
          )}

          {/* Top-right skip control — countdown → tappable button */}
          {allowSkip ? (
            <div className="absolute top-[36px] right-4 z-10">
              {skipReady ? (
                <button
                  onClick={handleSkip}
                  className="inline-flex items-center gap-1 bg-black/65 backdrop-blur-sm rounded-full pl-3 pr-2.5 py-1.5 cursor-pointer ring-1 ring-white/15"
                  aria-label="Skip ad"
                >
                  <span className="text-[12px] font-semibold text-white">Skip Ad</span>
                  <ChevronRight size={14} className="text-white" strokeWidth={2.2} />
                </button>
              ) : (
                <div
                  className="inline-flex items-center bg-black/55 backdrop-blur-sm rounded-full px-3 py-1.5"
                  aria-live="polite"
                >
                  <span className="text-[12px] font-medium text-white/85 tabular-nums">
                    Skip in {skipSecondsLeft}s
                  </span>
                </div>
              )}
            </div>
          ) : (
            // Non-skippable ad still needs a manual close affordance.
            <div className="absolute top-[36px] right-4 z-10">
              <button
                onClick={handleSkip}
                className="w-[26px] h-[26px] rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer opacity-40"
                aria-label="Close ad"
                disabled
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          )}

          {/* Replay control — centered, sits directly above the title pill.
              Appears at the same moment the Skip button becomes active.
              Wrapper is pointer-events-none so it doesn't block the Skip
              button that shares this top strip. */}
          {replayReady && (
            <div className="absolute top-[36px] left-0 right-0 z-10 flex justify-center pointer-events-none">
              <button
                onClick={handleReplay}
                className="inline-flex items-center gap-1.5 bg-black/55 backdrop-blur-sm rounded-full px-3 py-1.5 cursor-pointer ring-1 ring-white/15 pointer-events-auto"
                aria-label="Replay this ad"
              >
                <RotateCcw size={13} className="text-white" strokeWidth={2.2} />
                <span className="text-[12px] font-medium text-white">Replay</span>
              </button>
            </div>
          )}

          {/* Title pill */}
          <div className="absolute top-[76px] left-0 right-0 z-10 px-6 flex justify-center">
            <div className="bg-white rounded-[12px] px-3 py-2 max-w-[280px] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <p className="text-[16px] font-bold text-black leading-tight line-clamp-2 text-center">
                {ad.title}
              </p>
            </div>
          </div>

          {/* Right action column — visual chrome only */}
          <div className="absolute right-3 bottom-[170px] z-10 flex flex-col items-center gap-4">
            <ActionIcon Icon={ThumbsUp} count={ad.stats?.likes ?? '934'} />
            <ActionIcon Icon={MessageCircle} count={ad.stats?.comments ?? '37'} />
            <ActionIcon Icon={Share2} count={ad.stats?.shares ?? '18'} />
            <ActionIcon Icon={Bookmark} count={ad.stats?.saves ?? '91'} />
            <MoreHorizontal size={22} className="text-white" />
          </div>

          {/* Bottom stack — brand row, description, CTA, sponsored chip */}
          <div className="absolute bottom-0 left-0 right-[54px] z-10 px-4 pb-[82px]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-[30px] h-[30px] rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img src={ad.brandLogo ?? ad.image} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-[13px] font-bold text-white">{ad.brand}</span>
              {ad.verified && <span className="text-[10px] text-white/70">✓</span>}
              <span className="text-white/50">·</span>
            </div>
            <p className="text-[12px] text-white/90 mb-3">
              {ad.description}
              <span className="text-white/50 ml-1">more</span>
            </p>
            <button className="w-full bg-white/15 backdrop-blur-sm rounded-[4px] py-2.5 text-white font-bold text-[14px] cursor-pointer ring-1 ring-white/20">
              {ad.cta}
            </button>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Megaphone size={10} className="text-white/80" />
              <span className="text-[10px] text-white/80 font-medium">Sponsored</span>
            </div>
          </div>

          {/* Auto-advance progress bar */}
          <div className="absolute bottom-[80px] left-0 right-0 h-[2px] bg-white/10 z-10">
            <div className="h-full bg-white/70 transition-[width] duration-100" style={{ width: `${progressPct}%` }} />
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

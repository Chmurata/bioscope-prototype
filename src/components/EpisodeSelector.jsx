import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { X, Play, Lock } from 'lucide-react';

// Premium episode check — episode is locked when the drama is premium
// and the episode number exceeds its freeEpisodes threshold.
function isEpisodePremium(drama, ep) {
  if (!drama?.isPremium) return false;
  const free = drama.freeEpisodes ?? 3;
  return ep > free;
}

// Reusable lock badge — sits bottom-right on a tile or circle
function LockBadge({ size = 12 }) {
  return (
    <div
      className="absolute top-1 left-1 w-[18px] h-[18px] rounded-full flex items-center justify-center bg-gradient-to-br from-amber-300 to-amber-500 ring-1 ring-amber-200/50 shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
      aria-label="Premium episode"
    >
      <Lock size={size - 2} strokeWidth={2.5} className="text-amber-950" />
    </div>
  );
}

// ===== V1: Numbered Grid — reel-shaped tiles, 4 per row =====
function GridSelector({ drama, episodes, currentEpisode, watchedEpisodes, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {episodes.map((ep) => {
        const isCurrent = ep === currentEpisode;
        const isWatched = watchedEpisodes?.includes(ep);
        const isLocked = isEpisodePremium(drama, ep);
        return (
          <button key={ep} onClick={() => onSelect(ep)}
            className={`relative aspect-[9/16] rounded-[8px] overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-colors
              ${isCurrent ? 'bg-accent text-white font-bold' : isWatched ? 'bg-[#2d3136] text-text-secondary' : 'bg-[#242628] text-text-dim'}
              ${isLocked && !isCurrent ? 'opacity-70' : ''}`}>
            <span className={`${isCurrent ? 'text-[16px] font-bold' : 'text-[15px]'}`}>{ep}</span>
            {isCurrent && (
              <div className="absolute bottom-1.5 left-0 right-0 flex items-end justify-center gap-[2px] h-[16px]">
                <div className="w-[2px] bg-white rounded-full wave-bar-1" />
                <div className="w-[2px] bg-white rounded-full wave-bar-2" />
                <div className="w-[2px] bg-white rounded-full wave-bar-3" />
                <div className="w-[2px] bg-white rounded-full wave-bar-4" />
                <div className="w-[2px] bg-white rounded-full wave-bar-5" />
              </div>
            )}
            {isLocked && <LockBadge />}
          </button>
        );
      })}
    </div>
  );
}

// ===== V2: Compact horizontal dots/circles =====
// Now with range pills (1–30, 31–60, …) when drama has enough episodes.
function DotsSelector({ drama, totalEpisodes, currentEpisode, watchedEpisodes, onSelect, ranges, activeRange, setActiveRange }) {
  const range = ranges.length > 1 ? ranges[Math.min(activeRange, ranges.length - 1)] : { start: 1, end: totalEpisodes };
  const visibleEps = Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i);

  return (
    <div>
      {ranges.length > 1 && (
        <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
          {ranges.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setActiveRange(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                i === activeRange ? 'bg-accent text-white' : 'bg-[#242628] text-text-muted'
              }`}
            >
              EP {r.label}
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-text-muted mb-3">Scroll to browse episodes. Tap to play.</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 items-center">
        {visibleEps.map((ep) => {
          const isCurrent = ep === currentEpisode;
          const isWatched = watchedEpisodes?.includes(ep);
          const isLocked = isEpisodePremium(drama, ep);
          return (
            <button key={ep} onClick={() => onSelect(ep)}
              className="flex-shrink-0 relative cursor-pointer"
            >
              {/* Pulsing ring behind the active circle */}
              {isCurrent && (
                <div
                  className="absolute inset-0 rounded-full bg-accent"
                  style={{ animation: 'pulse-ring 2s ease-out infinite' }}
                />
              )}

              {/* Circle */}
              <div className={`relative rounded-full flex items-center justify-center transition-all duration-200
                ${isCurrent
                  ? 'w-[44px] h-[44px] bg-accent text-white font-bold shadow-lg shadow-accent/30'
                  : isWatched
                    ? 'w-[38px] h-[38px] bg-[#2d3136] text-text-secondary'
                    : 'w-[38px] h-[38px] bg-[#242628] text-text-dim'
                }
                ${isLocked && !isCurrent ? 'opacity-75' : ''}`}
              >
                <span className={isCurrent ? 'text-[14px] font-bold' : 'text-[12px]'}>{ep}</span>

                {/* Green playing indicator dot — top right */}
                {isCurrent && (
                  <div className="absolute -top-0.5 -right-0.5 w-[10px] h-[10px] rounded-full bg-brand border-2 border-[#1a1b1f]" />
                )}

                {/* Lock — on top-left for premium episodes when not current */}
                {isLocked && !isCurrent && (
                  <div className="absolute -top-0.5 -left-0.5 w-[14px] h-[14px] rounded-full flex items-center justify-center bg-gradient-to-br from-amber-300 to-amber-500 ring-[1.5px] ring-[#1a1b1f] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                    <Lock size={8} strokeWidth={3} className="text-amber-950" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-4 text-[10px] text-text-dim">
        <div className="flex items-center gap-1.5">
          <div className="relative w-3 h-3 rounded-full bg-accent">
            <div className="absolute -top-px -right-px w-[5px] h-[5px] rounded-full bg-brand" />
          </div>
          <span>Playing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#2d3136]" />
          <span>Watched</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#242628]" />
          <span>Unwatched</span>
        </div>
      </div>
    </div>
  );
}

// Mock milestone chapter titles
const milestones = {
  1: 'The Beginning',
  10: 'The Betrayal',
  20: 'Secrets Unveiled',
  30: 'Point of No Return',
  40: 'The Reckoning',
  50: 'Dark Truths',
  60: 'Final Gambit',
  70: 'The Last Stand',
};

// Mock watch progress (percentage) for watched episodes
function getWatchProgress(ep, watchedEps, currentEp) {
  if (ep === currentEp) return Math.floor(Math.random() * 40 + 30); // 30-70% for current
  if (watchedEps?.includes(ep)) return 100;
  return 0;
}

// Bioscope brand colors from Figma Colors page
// Brand (teal): B300 #46ffff, B400 #31b3b3, B500 #2b9c9c
// Secondary (blue): S200 #657ef7, S300 #4664f5, S400 #3146ac

// ===== V3: Thumbnail cards — enhanced with pinned Now Playing, progress bars, milestones, Up Next =====
function ThumbnailSelector({ drama, currentEpisode, onSelect, ranges, activeRange, setActiveRange }) {
  const scrollRef = useRef(null);
  const { start, end } = ranges.length > 0 ? ranges[Math.min(activeRange, ranges.length - 1)] : { start: 1, end: drama.totalEpisodes };
  const visibleEps = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const nextEp = currentEpisode + 1;
  const showNowPlaying = currentEpisode >= start && currentEpisode <= end;

  useEffect(() => {
    if (scrollRef.current) {
      const target = scrollRef.current.querySelector('[data-up-next]') || scrollRef.current.querySelector('[data-current]');
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      }
    }
  }, [activeRange]);

  return (
    <div ref={scrollRef}>
      {/* Pinned "Now Playing" card */}
      {showNowPlaying && (
        <div className="mb-4">
          <button onClick={() => onSelect(currentEpisode)} data-current
            className="w-full text-left cursor-pointer rounded-[12px] overflow-hidden ring-1 ring-[#31b3b3]/40"
            style={{ background: 'linear-gradient(135deg, rgba(43,156,156,0.12) 0%, rgba(70,100,245,0.08) 100%)' }}>
            <div className="relative w-full h-[100px] bg-card">
              <img src={drama.poster} alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111618]/80 via-[#111618]/50 to-transparent" />
              <div className="absolute inset-0 flex items-center px-4 gap-4">
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(43,156,156,0.25)' }}>
                  <div className="flex items-end gap-[2px]">
                    <div className="w-[3px] rounded-full eq-bar-1" style={{ background: '#46ffff' }} />
                    <div className="w-[3px] rounded-full eq-bar-2" style={{ background: '#46ffff' }} />
                    <div className="w-[3px] rounded-full eq-bar-3" style={{ background: '#46ffff' }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#2b9c9c', color: '#ffffff' }}>NOW PLAYING</span>
                  </div>
                  <p className="text-[14px] font-bold text-white">Episode {currentEpisode}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">~2 min</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${getWatchProgress(currentEpisode, drama.watchedEpisodes, currentEpisode)}%`, background: '#31b3b3' }} />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Episode list */}
      <div className="flex flex-col gap-2">
        {visibleEps.map((ep) => {
          if (showNowPlaying && ep === currentEpisode) return null;

          const isUpNext = ep === nextEp;
          const isWatched = drama.watchedEpisodes?.includes(ep);
          const isPast = ep < currentEpisode;
          const isLocked = isEpisodePremium(drama, ep);
          const progress = getWatchProgress(ep, drama.watchedEpisodes, currentEpisode);
          const milestone = milestones[ep];

          return (
            <div key={ep}>
              {/* Milestone marker — uses brand teal */}
              {milestone && (
                <div className="flex items-center gap-2 py-2 mb-1">
                  <div className="h-px flex-1 bg-[#2a2d32]" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#46ffff' }}>
                    EP {ep} — {milestone}
                  </span>
                  <div className="h-px flex-1 bg-[#2a2d32]" />
                </div>
              )}

              <button
                onClick={() => onSelect(ep)}
                {...(isUpNext ? { 'data-up-next': true } : {})}
                className={`flex gap-3 w-full text-left cursor-pointer rounded-[8px] overflow-hidden transition-all
                  ${isUpNext
                    ? 'ring-1 ring-[#31b3b3]/30'
                    : isPast
                      ? 'opacity-50'
                      : ''
                  }`}
                style={isUpNext
                  ? { background: 'linear-gradient(135deg, rgba(43,156,156,0.08) 0%, rgba(30,32,36,1) 100%)' }
                  : { background: isPast ? '#191b1e' : '#1e2024' }
                }
              >
                <div className="w-[100px] h-[60px] flex-shrink-0 relative bg-card">
                  <img src={drama.poster} alt="" className={`w-full h-full object-cover ${isPast ? 'opacity-35' : isLocked ? 'opacity-55' : 'opacity-70'}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isLocked ? (
                      <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_2px_6px_rgba(0,0,0,0.5)] ring-1 ring-amber-200/50">
                        <Lock size={14} strokeWidth={2.5} className="text-amber-950" />
                      </div>
                    ) : isUpNext ? (
                      <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ background: 'rgba(43,156,156,0.2)' }}>
                        <Play size={14} className="ml-0.5" style={{ color: '#46ffff' }} fill="#46ffff" />
                      </div>
                    ) : (
                      <Play size={14} className="text-white/40" fill="white" />
                    )}
                  </div>
                  {progress > 0 && !isLocked && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, background: progress >= 100 ? '#2b9c9c' : '#4664f5' }} />
                    </div>
                  )}
                </div>
                <div className="flex-1 py-2 pr-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-semibold" style={{ color: isUpNext ? '#46ffff' : isPast ? '#555' : '#fff' }}>
                      Episode {ep}
                    </p>
                    {isUpNext && !isLocked && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ color: '#46ffff', background: 'rgba(70,255,255,0.1)' }}>UP NEXT</span>
                    )}
                    {isLocked && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">PREMIUM</span>
                    )}
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">~2 min</p>
                  {isWatched && progress >= 100 && (
                    <p className="text-[9px] mt-0.5" style={{ color: 'rgba(43,156,156,0.6)' }}>Watched</p>
                  )}
                  {isWatched && progress > 0 && progress < 100 && (
                    <p className="text-[9px] mt-0.5" style={{ color: 'rgba(70,100,245,0.6)' }}>{progress}% watched</p>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EpisodeSelector() {
  const { selectedDrama, showEpisodeSelector, setShowEpisodeSelector, currentEpisode, playEpisode, variants } = useApp();
  const [activeRange, setActiveRange] = useState(0);

  const ranges = useMemo(() => {
    if (!selectedDrama) return [];
    const r = [];
    for (let i = 0; i < selectedDrama.totalEpisodes; i += 30) {
      r.push({ label: `${i + 1}-${Math.min(i + 30, selectedDrama.totalEpisodes)}`, start: i + 1, end: Math.min(i + 30, selectedDrama.totalEpisodes) });
    }
    return r;
  }, [selectedDrama?.totalEpisodes]);

  const episodes = useMemo(() => {
    if (!ranges.length || activeRange >= ranges.length) return [];
    const { start, end } = ranges[activeRange];
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [ranges, activeRange]);

  if (!showEpisodeSelector || !selectedDrama) return null;

  const handleSelect = (ep) => {
    setShowEpisodeSelector(false);
    playEpisode(ep);
  };

  const variant = variants.episodeSelector;

  return (
    <AnimatePresence>
      <motion.div className="absolute inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowEpisodeSelector(false)} />

        <motion.div
          className={`absolute bottom-0 left-0 right-0 bg-[#1a1b1f] rounded-t-[16px] flex flex-col ${
            variant === 'V3' ? 'max-h-[75%]' : 'max-h-[65%]'
          }`}
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

          {/* ===== Sticky top section — never scrolls ===== */}
          <div className="flex-shrink-0">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-[40px] h-[4px] bg-text-dim rounded-full" />
            </div>

            <div className="px-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <img src={selectedDrama.poster} alt="" className="w-[40px] h-[56px] rounded-[4px] object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-white truncate">{selectedDrama.title}</h3>
                  <p className="text-[11px] text-text-muted">Dubbed &bull; {selectedDrama.views} Views</p>
                </div>
                <button onClick={() => setShowEpisodeSelector(false)}
                  className="w-[28px] h-[28px] rounded-full bg-white/10 flex items-center justify-center cursor-pointer flex-shrink-0">
                  <X size={14} className="text-white" />
                </button>
              </div>

              {/* Range pills — sticky for V1 and V3 */}
              {(variant === 'V1' || variant === 'V3') && ranges.length > 1 && (
                <div className={`flex gap-2 pb-3 overflow-x-auto no-scrollbar ${variant === 'V1' ? 'gap-5' : ''}`}>
                  {ranges.map((r, i) => (
                    variant === 'V1' ? (
                      <button key={r.label} onClick={() => setActiveRange(i)}
                        className={`text-[13px] cursor-pointer whitespace-nowrap ${i === activeRange ? 'font-bold text-white' : 'text-text-muted'}`}>
                        {r.label}
                      </button>
                    ) : (
                      <button key={r.label} onClick={() => setActiveRange(i)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                          i === activeRange ? 'bg-accent text-white' : 'bg-[#242628] text-text-muted'
                        }`}>
                        EP {r.label}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Fade edge to hint content scrolls underneath */}
            {variant === 'V3' && (
              <div className="h-[1px] bg-[#2a2d32] mx-5" />
            )}
          </div>

          {/* ===== Scrollable content area ===== */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 pt-3">
            {variant === 'V1' && (
              <GridSelector drama={selectedDrama} episodes={episodes} currentEpisode={currentEpisode}
                watchedEpisodes={selectedDrama.watchedEpisodes} onSelect={handleSelect} />
            )}

            {variant === 'V2' && (
              <DotsSelector drama={selectedDrama} totalEpisodes={selectedDrama.totalEpisodes} currentEpisode={currentEpisode}
                watchedEpisodes={selectedDrama.watchedEpisodes} onSelect={handleSelect}
                ranges={ranges} activeRange={activeRange} setActiveRange={setActiveRange} />
            )}

            {variant === 'V3' && (
              <ThumbnailSelector drama={selectedDrama} currentEpisode={currentEpisode} onSelect={handleSelect}
                ranges={ranges} activeRange={activeRange} setActiveRange={setActiveRange} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

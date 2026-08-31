import { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import RangeChip from './RangeChip';
import WatchedBadge from './WatchedBadge';
import PlayingBadge from './PlayingBadge';

// Premium gate — episode locked when drama is premium and episode > freeEpisodes.
function isLocked(drama, ep) {
  if (!drama?.isPremium) return false;
  const free = drama.freeEpisodes ?? 3;
  return ep > free;
}

function getProgressPct(ep, drama, currentEpisode, progressByDrama) {
  // Currently playing episode → use live progress
  if (ep === currentEpisode) {
    const p = progressByDrama[drama.id];
    if (p && p.episodeNumber === ep && p.totalSeconds > 0) {
      return Math.min(100, Math.round((p.secondsWatched / p.totalSeconds) * 100));
    }
    return 0;
  }
  // Fully watched → 100; partials seeded into watchedEpisodes count as fully done in prototype.
  if (drama.watchedEpisodes?.includes(ep)) return 100;
  return 0;
}

// Instagram-style 3-column edge-to-edge portrait grid of episodes for the
// combined DramaSheet. Each tile carries a state badge (Playing / Watched)
// or progress bar, with a small "EP N" label bottom-left.
export default function EpisodeGridV2({ drama, currentEpisode, progressByDrama, onSelect, onLockedTap }) {
  const total = drama?.totalEpisodes ?? 0;
  const [activeRange, setActiveRange] = useState(0);

  const ranges = useMemo(() => {
    const r = [];
    for (let i = 0; i < total; i += 30) {
      r.push({ label: `${i + 1}–${Math.min(i + 30, total)}`, start: i + 1, end: Math.min(i + 30, total) });
    }
    return r;
  }, [total]);

  const episodes = useMemo(() => {
    if (!ranges.length) return [];
    const { start, end } = ranges[Math.min(activeRange, ranges.length - 1)];
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [ranges, activeRange]);

  if (!drama) return null;

  return (
    <div>
      {ranges.length > 1 && (
        <div className="px-4 pt-4 pb-3">
          <RangeChip ranges={ranges} activeIndex={activeRange} onChange={setActiveRange} />
        </div>
      )}

      <div className="grid grid-cols-3 gap-[3px]">
        {episodes.map((ep) => {
          const locked = isLocked(drama, ep);
          // A locked (premium-gated) episode can never be "watched" — guard the
          // watched state behind !locked so the two never co-exist.
          const watched = !locked && drama.watchedEpisodes?.includes(ep) && ep !== currentEpisode;
          const isCurrent = ep === currentEpisode;
          const pct = getProgressPct(ep, drama, currentEpisode, progressByDrama);
          return (
            <button
              key={ep}
              onClick={() => (locked ? onLockedTap?.(ep) : onSelect(ep))}
              className={`relative aspect-[9/16] overflow-hidden bg-surface-dark cursor-pointer ${
                isCurrent ? 'ring-2 ring-[#46ffff] ring-inset z-10' : ''
              }`}
            >
              <img
                src={drama.poster}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Dark veil for watched tiles only — premium/locked tiles stay clean */}
              {watched && <div className="absolute inset-0 bg-black/65 pointer-events-none" />}

              {/* Lock badge top-right for premium-gated episodes */}
              {locked && (
                <div className="absolute top-1.5 right-1.5 w-[20px] h-[20px] rounded-full flex items-center justify-center bg-gradient-to-br from-amber-300 to-amber-500 ring-1 ring-amber-200/50 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                  <Lock size={10} strokeWidth={2.5} className="text-amber-950" />
                </div>
              )}

              {/* Bottom strip — episode number left, state badge right */}
              <div className="absolute inset-x-0 bottom-0 px-1.5 pt-4 pb-1.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-between gap-1">
                <span className="text-[10px] font-semibold text-white tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                  EP {ep}
                </span>
                {isCurrent ? <PlayingBadge /> : watched ? <WatchedBadge /> : null}
              </div>

              {/* Progress bar for partial (current episode only in prototype) */}
              {pct > 0 && pct < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                  <div className="h-full" style={{ width: `${pct}%`, background: '#46ffff' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

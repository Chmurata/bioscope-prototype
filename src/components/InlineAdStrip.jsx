import { ChevronRight, X } from 'lucide-react';

/**
 * Thin ad banner shown directly below the title/subtext in the Player, just above the seekbar.
 * Dismissible (per-episode memory kept by the parent).
 */
export default function InlineAdStrip({ ad, onDismiss, onCTA }) {
  if (!ad) return null;
  return (
    <div className="flex items-center gap-2 rounded-[10px] bg-black/45 backdrop-blur-md ring-1 ring-white/10 pl-2 pr-1.5 py-1.5">
      {/* Thumbnail */}
      <div className="w-[34px] h-[34px] rounded-[6px] overflow-hidden bg-black/50 flex-shrink-0">
        <img src={ad.image} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Copy */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-wider text-white/60 bg-white/10 rounded-sm px-1 py-[1px] leading-none">Ad</span>
          <span className="text-[10px] text-white/70 truncate">{ad.brand}</span>
        </div>
        <p className="text-[11px] font-semibold text-white truncate mt-0.5">{ad.headline}</p>
      </div>

      {/* CTA */}
      <button
        onClick={onCTA}
        className="flex items-center gap-0.5 bg-white text-black rounded-full px-2.5 py-1 cursor-pointer"
      >
        <span className="text-[10px] font-bold">{ad.cta}</span>
        <ChevronRight size={12} />
      </button>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="w-[20px] h-[20px] rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer shrink-0"
        aria-label="Dismiss ad"
      >
        <X size={12} className="text-white/60" />
      </button>
    </div>
  );
}

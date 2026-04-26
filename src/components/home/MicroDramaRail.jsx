import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { PremiumBadge } from '../PremiumBadge';
import { ContentLabel } from '../ContentLabel';

// Micro Drama rail — the title is tappable (routes to the MicroDrama screen) with a
// chevron next to it. Each card plays a drama directly. Restored from the earlier
// HomeScreen layout since this is the core monetization rail for the prototype.
export default function MicroDramaRail({ items, onOpenMicroDrama, onPlay }) {
  return (
    <div className="pt-7 pb-2">
      <div className="flex items-center justify-between px-4 mb-3">
        <button onClick={onOpenMicroDrama} className="flex items-center gap-1 cursor-pointer">
          <span className="text-[18px] font-bold text-white leading-none">Micro Drama</span>
          <ChevronRight size={18} className="text-white" strokeWidth={2.2} />
        </button>
        <button
          onClick={onOpenMicroDrama}
          className="flex items-center gap-1 bg-[#1E2224] ring-1 ring-white/10 rounded-[6px] px-2 py-0.5 cursor-pointer"
        >
          <span className="text-[10px] font-medium text-white">See all</span>
          <ArrowRight size={10} className="text-white" strokeWidth={2} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto overflow-y-visible no-scrollbar px-4 py-2">
        {items.map((d) => (
          <motion.button
            key={d.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPlay?.(d)}
            className="shrink-0 w-[128px] text-left cursor-pointer"
          >
            <div className="relative w-[128px] h-[180px] rounded-[8px] overflow-hidden bg-[#1E2224]">
              <img src={d.poster} alt={d.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-1.5 left-1.5">
                <span className="text-[9px] text-white bg-black/60 px-1.5 py-[1px] rounded-[3px]">{d.totalEpisodes} EP</span>
              </div>
              {d.isPremium && <PremiumBadge size="sm" />}
              <ContentLabel label={d.label} />
            </div>
            <p className="text-[12px] font-medium text-white mt-2 truncate">{d.title}</p>
            <p className="text-[10px] text-white/55 truncate">{d.genres?.[0]} · {d.views}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

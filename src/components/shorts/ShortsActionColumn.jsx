import { motion } from 'framer-motion';
import { ThumbsUp, Share2, Plus, Check, Play } from 'lucide-react';

// Right-side action column for Short items (per Bioscope production layout):
//   Like (count) · Share · My List · Play Now (white-circle CTA, no-op in demo)
export default function ShortsActionColumn({ short, liked, onToggleLike, myList, onToggleMyList }) {
  const inList = myList?.[short.id];
  return (
    <div className="flex flex-col items-center gap-5">
      <ActionItem label={short.stats?.likes ?? '0'}>
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => onToggleLike?.(short.id)}
          className="cursor-pointer"
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <ThumbsUp size={26} className="text-white" fill={liked ? 'white' : 'none'} strokeWidth={1.6} />
        </motion.button>
      </ActionItem>

      <ActionItem label="Share">
        <motion.button whileTap={{ scale: 1.3 }} className="cursor-pointer" aria-label="Share">
          <Share2 size={26} className="text-white" strokeWidth={1.6} />
        </motion.button>
      </ActionItem>

      <ActionItem label="My List">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => onToggleMyList?.(short.id)}
          className="cursor-pointer"
          aria-label={inList ? 'Remove from My List' : 'Add to My List'}
        >
          {inList
            ? <Check size={26} className="text-white" strokeWidth={2} />
            : <Plus size={26} className="text-white" strokeWidth={1.8} />}
        </motion.button>
      </ActionItem>

      {/* Play Now — demo-only, no-op */}
      <div className="flex flex-col items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          aria-label="Play now"
        >
          <Play size={20} className="text-black ml-0.5" fill="black" />
        </motion.button>
        <span className="text-[12px] font-medium text-white leading-none">Play Now</span>
      </div>
    </div>
  );
}

function ActionItem({ label, children }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-[48px] h-[48px] rounded-full bg-white/5 ring-1 ring-white/20 flex items-center justify-center transition-colors group-active:bg-white/10">
        {children}
      </div>
      <span className="text-[12px] font-medium text-white/90 leading-none">{label}</span>
    </div>
  );
}

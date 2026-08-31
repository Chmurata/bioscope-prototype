import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { ThumbsUp, Share2, ListVideo, Plus, Check } from 'lucide-react';

// Action column shown on Microdrama-tease items inside the Shorts feed.
// Mirrors the in-player MicroDramaActionColumn but routed to the global
// like/myList/episode-selector context for the active selectedDrama.
export default function MicroDramaTeaseActionColumn() {
  const { selectedDrama, liked, toggleLike, myList, toggleMyList, setShowEpisodeSelector } = useApp();

  if (!selectedDrama) return null;
  const isLiked = liked[selectedDrama.id];
  const inList = myList[selectedDrama.id];

  return (
    <div className="flex flex-col items-center gap-5">
      <Item label="83.4K">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => toggleLike(selectedDrama.id)}
          className="cursor-pointer"
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <ThumbsUp size={26} className="text-white" fill={isLiked ? 'white' : 'none'} strokeWidth={1.6} />
        </motion.button>
      </Item>
      <Item label="Share">
        <motion.button whileTap={{ scale: 1.3 }} className="cursor-pointer" aria-label="Share">
          <Share2 size={26} className="text-white" strokeWidth={1.6} />
        </motion.button>
      </Item>
      <Item label="Episodes">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => setShowEpisodeSelector(true)}
          className="cursor-pointer"
          aria-label="Open episode picker"
        >
          <ListVideo size={26} className="text-white" strokeWidth={1.6} />
        </motion.button>
      </Item>
      <Item label="My List">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => toggleMyList(selectedDrama.id)}
          className="cursor-pointer"
          aria-label={inList ? 'Remove from My List' : 'Add to My List'}
        >
          {inList
            ? <Check size={26} className="text-white" strokeWidth={2} />
            : <Plus size={26} className="text-white" strokeWidth={1.8} />}
        </motion.button>
      </Item>
    </div>
  );
}

function Item({ label, children }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-[48px] h-[48px] rounded-full bg-white/5 ring-1 ring-white/20 flex items-center justify-center transition-colors group-active:bg-white/10">
        {children}
      </div>
      <span className="text-[12px] font-medium text-white/90 leading-none">{label}</span>
    </div>
  );
}

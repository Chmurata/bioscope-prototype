import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { ThumbsUp, Share2, ListVideo, Plus, Check } from 'lucide-react';

export default function ActionColumn() {
  const { selectedDrama, liked, toggleLike, myList, toggleMyList, setShowEpisodeSelector } = useApp();

  if (!selectedDrama) return null;

  const isLiked = liked[selectedDrama.id];
  const isInList = myList[selectedDrama.id];

  const actions = [
    {
      icon: ThumbsUp,
      label: '83.4K',
      active: isLiked,
      onTap: () => toggleLike(selectedDrama.id),
      fill: isLiked,
    },
    {
      icon: Share2,
      label: 'Share',
      onTap: () => {},
    },
    {
      icon: ListVideo,
      label: 'Episodes',
      onTap: () => setShowEpisodeSelector(true),
    },
    {
      icon: isInList ? Check : Plus,
      label: 'My List',
      active: isInList,
      onTap: () => toggleMyList(selectedDrama.id),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-5">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            whileTap={{ scale: 1.3 }}
            onClick={action.onTap}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-[36px] h-[36px] rounded-full bg-black/15 backdrop-blur-md ring-1 ring-white/10 flex items-center justify-center">
              <Icon
                size={20}
                className="text-white"
                fill={action.fill ? 'white' : 'none'}
                strokeWidth={1.5}
              />
            </div>
            <span className="text-[10px] text-white">{action.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

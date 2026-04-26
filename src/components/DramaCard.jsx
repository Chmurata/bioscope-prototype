import { motion } from 'framer-motion';
import { PremiumBadge } from './PremiumBadge';
import { ContentLabel } from './ContentLabel';

export default function DramaCard({ drama, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(drama)}
      className="flex flex-col gap-[6px] w-full text-left cursor-pointer"
    >
      {/* Poster */}
      <div className="w-full aspect-[156/220] rounded-[8px] overflow-hidden bg-card relative">
        <img
          src={drama.poster}
          alt={drama.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Episode count */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-medium text-white bg-black/60 px-[6px] py-[2px] rounded-[4px]">
            {drama.totalEpisodes} Episodes
          </span>
        </div>
        {/* Premium crown (top-right) */}
        {drama.isPremium && <PremiumBadge size="sm" />}
        {/* Content label (top-left) */}
        <ContentLabel label={drama.label} />
      </div>
      {/* Title */}
      <p className="text-[12px] font-semibold text-white truncate">{drama.title}</p>
      {/* Meta */}
      <p className="text-[10px] text-text-muted truncate">{drama.genres[0]} &bull; {drama.views} Views</p>
    </motion.button>
  );
}

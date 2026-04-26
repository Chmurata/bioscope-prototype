import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import GenreFilter from '../components/GenreFilter';
import DramaCard from '../components/DramaCard';
import { PremiumBadge } from '../components/PremiumBadge';
import { ContentLabel } from '../components/ContentLabel';
import { ArrowLeft, Search, Star, Eye } from 'lucide-react';

export default function BrowseScreen() {
  const { goBack, playDrama, variants } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? dramas
    : dramas.filter(d => d.genres.some(g => g.toLowerCase().includes(filter.toLowerCase())));

  const handleCardTap = (drama) => {
    playDrama(drama);
  };

  return (
    <div className="relative w-full h-full bg-bg flex flex-col pt-[30px] pb-[90px]">
      {/* Header */}
      <div className="flex items-center h-[52px] px-4">
        <button onClick={goBack} className="cursor-pointer">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-[18px] font-bold text-white">Micro Drama</span>
        </div>
        <Search size={24} className="text-white" />
      </div>

      {/* Genre Filters */}
      <GenreFilter onFilter={setFilter} />

      {/* Content Area — switches based on variant */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-4">

        {/* ===== V1: Standard 3-Column Grid ===== */}
        {variants.browse === 'V1' && (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((drama) => (
              <DramaCard key={drama.id} drama={drama} onClick={handleCardTap} />
            ))}
          </div>
        )}

        {/* ===== V2: Featured Hero + Grid ===== */}
        {variants.browse === 'V2' && (
          <div>
            {/* Featured card — first drama gets hero treatment */}
            {filtered.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardTap(filtered[0])}
                className="w-full mb-4 rounded-[12px] overflow-hidden relative cursor-pointer"
              >
                <div className="w-full aspect-[16/10] relative">
                  <img
                    src={filtered[0].poster}
                    alt={filtered[0].title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Premium crown — top-right, Content label — top-left */}
                  {filtered[0].isPremium && <PremiumBadge size="md" />}
                  <ContentLabel label={filtered[0].label} />
                  {/* Featured badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <Star size={10} className="text-yellow-400" fill="#facc15" />
                      <span className="text-[9px] font-semibold text-white">Featured</span>
                    </div>
                  </div>
                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-[16px] font-bold text-white mb-0.5">{filtered[0].title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-text-secondary">{filtered[0].genres[0]}</span>
                      <span className="text-[11px] text-text-muted flex items-center gap-1">
                        <Eye size={10} /> {filtered[0].views}
                      </span>
                      <span className="text-[11px] text-text-muted">{filtered[0].totalEpisodes} EP</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )}
            {/* Remaining in 2-col grid */}
            <div className="grid grid-cols-2 gap-4">
              {filtered.slice(1).map((drama) => (
                <DramaCard key={drama.id} drama={drama} onClick={handleCardTap} />
              ))}
            </div>
          </div>
        )}

        {/* ===== V3: List View ===== */}
        {variants.browse === 'V3' && (
          <div className="flex flex-col gap-3">
            {filtered.map((drama) => (
              <motion.button
                key={drama.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardTap(drama)}
                className="flex gap-3 w-full text-left cursor-pointer bg-[#1a1d22] rounded-[10px] overflow-hidden"
              >
                {/* Landscape poster */}
                <div className="w-[120px] h-[80px] flex-shrink-0 relative">
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1">
                    <span className="text-[8px] text-white bg-black/70 px-1 py-0.5 rounded">
                      {drama.totalEpisodes} EP
                    </span>
                  </div>
                  {drama.isPremium && <PremiumBadge size="sm" />}
                  <ContentLabel label={drama.label} />
                </div>
                {/* Info */}
                <div className="flex-1 py-2 pr-3 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-text-muted">{drama.genres[0]}</span>
                  </div>
                  <h4 className="text-[13px] font-semibold text-white truncate mb-0.5">{drama.title}</h4>
                  <p className="text-[10px] text-text-dim line-clamp-2 leading-[14px]">
                    {drama.synopsis.slice(0, 70)}...
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] text-text-muted flex items-center gap-1">
                      <Eye size={9} /> {drama.views}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

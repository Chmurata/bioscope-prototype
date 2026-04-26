import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import { PremiumBadge } from '../components/PremiumBadge';
import { ContentLabel } from '../components/ContentLabel';
import { ArrowLeft, Play } from 'lucide-react';

function formatTimeLeft(total, watched) {
  const remaining = Math.max(0, total - watched);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  if (m > 0) return `${m}:${String(s).padStart(2, '0')} left`;
  return `${s}s left`;
}

function SectionTitle({ title }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-[18px] font-bold text-white">{title}</span>
    </div>
  );
}

// Poster card reused across all rails
function PosterCard({ drama, onClick, size = 'md' }) {
  const dims = {
    sm: 'w-[110px] h-[156px]',
    md: 'w-[128px] h-[192px]',
    lg: 'w-[160px] h-[240px]',
  }[size];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(drama)}
      className="flex-shrink-0 text-left cursor-pointer"
    >
      <div className={`${dims} rounded-[8px] overflow-hidden bg-card relative`}>
        <img src={drama.poster} alt={drama.title} className="w-full h-full object-cover" />
        {drama.isPremium && <PremiumBadge size="sm" />}
        <ContentLabel label={drama.label} />
      </div>
      <p className={`text-[12px] font-medium text-white mt-1.5 truncate ${dims.split(' ')[0]}`}>{drama.title}</p>
      <p className={`text-[10px] text-text-muted truncate ${dims.split(' ')[0]}`}>{drama.genres[0]}</p>
    </motion.button>
  );
}

export default function MicroDramaScreen() {
  const { goBack, playDrama, progressByDrama } = useApp();

  // Continue Watching — only dramas with progress
  const continueList = dramas
    .map((d) => ({ ...d, progress: progressByDrama[d.id] ?? d.progress }))
    .filter((d) => d.progress);

  const forYou = dramas.slice(0, 6);
  const trending = [dramas[1], dramas[6], dramas[3], dramas[2]].filter(Boolean);
  const newlyAdded = dramas.filter((d) => d.label === 'New');
  const exclusive = dramas.filter((d) => d.isPremium && d.label === 'Exclusive');

  return (
    <div className="relative w-full h-full">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(180deg, #1b1b1b 0%, #102835 100%)' }}
      />
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* ===== Sticky header — back button (left) + centered "Micro Drama" title ===== */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-[30px] bg-gradient-to-b from-[#1b1b1b] to-[#1b1b1b]/80 backdrop-blur-md">
        <div className="relative flex items-center px-4 h-[44px]">
          <button onClick={goBack} className="cursor-pointer z-10" aria-label="Back">
            <ArrowLeft size={22} className="text-white" strokeWidth={2} />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-white">
            Micro Drama
          </h1>
        </div>
      </div>

      <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar pt-[74px] pb-[90px]">

        {/* ===== Hero pick (top item) ===== */}
        {exclusive[0] && (
          <div className="px-4 pt-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => playDrama(exclusive[0])}
              className="w-full rounded-[14px] overflow-hidden relative cursor-pointer text-left"
            >
              <div className="w-full aspect-[16/10] relative">
                <img src={exclusive[0].poster} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                {exclusive[0].isPremium && <PremiumBadge size="md" />}
                <ContentLabel label={exclusive[0].label} />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-widest mb-1">
                    Featured microdrama
                  </p>
                  <h2 className="text-[18px] font-bold text-white leading-tight mb-1.5">{exclusive[0].title}</h2>
                  <p className="text-[11px] text-text-secondary line-clamp-2 mb-3">
                    {exclusive[0].synopsis.slice(0, 90)}…
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-white rounded-full px-3.5 py-1.5">
                    <Play size={12} className="text-[#2a2a2a]" fill="#2a2a2a" />
                    <span className="text-[12px] font-semibold text-[#2a2a2a]">Play Now</span>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        )}

        {/* ===== Continue Watching ===== */}
        {continueList.length > 0 && (
          <div className="px-4 pt-5">
            <SectionTitle title="Continue Watching" />
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {continueList.map((d) => {
                const pct = Math.min(100, Math.round((d.progress.secondsWatched / d.progress.totalSeconds) * 100));
                return (
                  <motion.button
                    key={d.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => playDrama(d)}
                    className="flex-shrink-0 w-[160px] text-left cursor-pointer"
                  >
                    <div className="w-[160px] h-[100px] rounded-[8px] overflow-hidden bg-card relative">
                      <img src={d.poster} alt={d.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 pt-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <div className="flex items-center justify-between text-[10px] font-medium text-white">
                          <span className="tabular-nums">EP {d.progress.episodeNumber}</span>
                          <span className="tabular-nums text-white/85">
                            {formatTimeLeft(d.progress.totalSeconds, d.progress.secondsWatched)}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <Play size={14} className="text-white" fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                        <div className="h-full bg-brand-light" style={{ width: `${pct}%` }} />
                      </div>
                      {d.isPremium && <PremiumBadge size="sm" />}
                      <ContentLabel label={d.label} />
                    </div>
                    <p className="text-[12px] font-medium text-white mt-1.5 w-[160px] truncate">{d.title}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== For You ===== */}
        <div className="px-4 pt-5">
          <SectionTitle title="For You" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {forYou.map((d) => (
              <PosterCard key={d.id} drama={d} onClick={playDrama} />
            ))}
          </div>
        </div>

        {/* ===== Trending Now ===== */}
        <div className="px-4 pt-5">
          <SectionTitle title="Trending Now" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {trending.map((d) => (
              <PosterCard key={d.id} drama={d} onClick={playDrama} size="sm" />
            ))}
          </div>
        </div>

        {/* ===== Newly Added ===== */}
        {newlyAdded.length > 0 && (
          <div className="px-4 pt-5">
            <SectionTitle title="Newly Added" />
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {newlyAdded.map((d) => (
                <PosterCard key={d.id} drama={d} onClick={playDrama} />
              ))}
            </div>
          </div>
        )}

        {/* ===== Exclusive on Bioscope+ ===== */}
        {exclusive.length > 0 && (
          <div className="px-4 pt-5 pb-4">
            <SectionTitle title="Exclusive on Bioscope+" />
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {dramas.filter((d) => d.isPremium).map((d) => (
                <PosterCard key={d.id} drama={d} onClick={playDrama} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

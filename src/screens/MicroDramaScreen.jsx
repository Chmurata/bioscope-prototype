import { useCallback, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import HeroCarousel from '../components/home/HeroCarousel';
import PosterRail from '../components/home/PosterRail';

// Cycle a small palette of moody tints for hero slides — matches the homepage hero feel.
const HERO_TINTS = ['rgb(42,30,61)', 'rgb(58,31,20)', 'rgb(31,58,42)', 'rgb(42,42,62)', 'rgb(61,31,31)'];

// Hero slides for the Microdrama screen — first few premium dramas, formatted to match
// the homepage HeroCarousel's slide shape (poster, title, genres, rating, platform, tint).
const heroDramas = dramas.filter((d) => d.isPremium).slice(0, 5);
const microHeroSlides = heroDramas.map((d, i) => ({
  id: `mds-${d.id}`,
  title: d.title,
  genres: d.genres.slice(0, 2),
  rating: d.maturityRating ?? (d.isPremium ? '18+' : '13+'),
  platform: 'Bioscope+ Microdrama',
  poster: d.poster,
  tint: HERO_TINTS[i % HERO_TINTS.length],
  drama: d,
}));

// Build portrait rail items from drama records — same shape PosterRail expects.
function railItems(list, opts = {}) {
  return list.map((d, i) => ({
    id: `${opts.prefix ?? 'm'}-${d.id}-${i}`,
    title: d.title,
    poster: d.poster,
    chip: d.isPremium ? 'Exclusive' : undefined,
    bottomLabel: opts.bottomLabel?.(d) ?? d.label,
    drama: d,
  }));
}

export default function MicroDramaScreen() {
  const { playDrama, progressByDrama } = useApp();
  const [, setActiveTint] = useState(microHeroSlides[0]?.tint ?? 'rgb(42,30,61)');

  const handleHeroPlay = useCallback((slide) => {
    if (slide?.drama) playDrama(slide.drama);
  }, [playDrama]);

  const handleActiveHero = useCallback((slide) => {
    if (slide?.tint) setActiveTint(slide.tint);
  }, []);

  const onCardClick = useCallback((item) => {
    if (item?.drama) playDrama(item.drama);
  }, [playDrama]);

  // Curated rails — all microdrama, all portrait.
  const continueList = dramas
    .map((d) => {
      const p = progressByDrama[d.id] ?? d.progress;
      if (!p) return null;
      const pct = p.totalSeconds > 0 ? Math.min(100, Math.round((p.secondsWatched / p.totalSeconds) * 100)) : 0;
      return { ...d, _progress: p, _pct: pct };
    })
    .filter(Boolean);
  const forYou         = dramas.slice(0, 8);
  const trending       = [dramas[1], dramas[6], dramas[3], dramas[2], dramas[8], dramas[10]].filter(Boolean);
  const newlyAdded     = dramas.filter((d) => d.label === 'New');
  const exclusive      = dramas.filter((d) => d.isPremium);
  const banglaOriginals = dramas.slice(4, 12);

  // PosterRail expects items[].poster + .title; pass through onClick via map.
  const buildRail = (items, prefix) => railItems(items, { prefix });

  return (
    <div className="relative w-full h-full bg-dark overflow-hidden">
      {/* Sticky header — centered "Micro Drama" title (top-level tab, no back) */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-[30px] bg-card/95 backdrop-blur-md">
        <div className="flex items-center justify-center px-4 h-[44px]">
          <h1 className="text-[16px] font-bold text-white">Micro Drama</h1>
        </div>
      </div>

      <div className="relative w-full h-full overflow-y-auto no-scrollbar pb-[90px]">
        <div style={{ height: 74 }} />

        {/* Hero carousel */}
        <div className="pt-3">
          <HeroCarousel slides={microHeroSlides} onActiveChange={handleActiveHero} onPlay={handleHeroPlay} />
        </div>

        {continueList.length > 0 && (
          <PosterRail
            title="Continue Watching"
            items={continueList.map((d, i) => ({
              id: `cw-${d.id}-${i}`,
              title: d.title,
              poster: d.poster,
              chip: d.isPremium ? 'Exclusive' : undefined,
              watched: d._pct >= 100,
              progressPct: d._pct,
              drama: d,
            }))}
            variant="portrait"
            seeAll={false}
            onItemClick={onCardClick}
          />
        )}

        <PosterRail
          title="For You"
          items={buildRail(forYou, 'fy')}
          variant="portrait"
          onItemClick={onCardClick}
        />

        <PosterRail
          title="Trending Now 📈"
          items={buildRail(trending, 'tr')}
          variant="portrait"
          onItemClick={onCardClick}
        />

        {newlyAdded.length > 0 && (
          <PosterRail
            title="Newly Added"
            items={buildRail(newlyAdded, 'na')}
            variant="portrait"
            onItemClick={onCardClick}
          />
        )}

        <PosterRail
          title="Exclusive on Bioscope+"
          items={buildRail(exclusive, 'ex')}
          variant="portrait"
          onItemClick={onCardClick}
        />

        <PosterRail
          title="Bangla Originals"
          items={buildRail(banglaOriginals, 'bo')}
          variant="portrait"
          onItemClick={onCardClick}
        />

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

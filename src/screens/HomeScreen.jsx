import { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import { heroSlides } from '../data/heroSlides';
import { homeRows } from '../data/homeRows';
import HeroTopBar from '../components/home/HeroTopBar';
import CategoryTabs from '../components/home/CategoryTabs';
import HeroCarousel from '../components/home/HeroCarousel';
import PromoBanner from '../components/home/PromoBanner';
import PosterRail from '../components/home/PosterRail';
import CircleRail from '../components/home/CircleRail';
import OTTPlatformsBlock from '../components/home/OTTPlatformsBlock';
import ThemedBlock from '../components/home/ThemedBlock';
import MicroDramaRail from '../components/home/MicroDramaRail';

export default function HomeScreen() {
  const { setShowSubscribe, playDrama, setScreen, SCREENS } = useApp();
  const [heroTint, setHeroTint] = useState(heroSlides[0].tint);

  const handleActiveHero = useCallback((slide) => {
    if (slide?.tint) setHeroTint(slide.tint);
  }, []);

  const handlePlay = useCallback((slide) => {
    // Route hero CTA to the first drama (fixture mapping) for prototype purposes.
    const first = dramas[0];
    if (first) playDrama(first);
  }, [playDrama]);

  return (
    <div className="relative w-full h-full bg-[#0A090B] overflow-hidden">
      {/* Top bar with dominant-color tint driven by the active hero */}
      <HeroTopBar
        tint={heroTint}
        onSubscribe={() => setShowSubscribe(true)}
      />

      {/* Scrollable content */}
      <div className="relative w-full h-full overflow-y-auto no-scrollbar pb-[90px]">
        {/* Spacer matching the top bar height (status + logo row) */}
        <div style={{ height: 84 }} />

        {/* Category tabs */}
        <CategoryTabs />

        {/* Hero carousel */}
        <div className="pt-4">
          <HeroCarousel slides={heroSlides} onActiveChange={handleActiveHero} onPlay={handlePlay} />
        </div>

        {/* Promo banner */}
        <PromoBanner />

        {/* Micro Drama — tappable header routes to the MicroDrama screen */}
        <MicroDramaRail
          items={dramas}
          onOpenMicroDrama={() => setScreen(SCREENS.MICRODRAMA)}
          onPlay={playDrama}
        />

        {/* Rows */}
        {homeRows.map((row) => {
          switch (row.variant) {
            case 'portrait':
            case 'landscape':
            case 'numbered':
              return (
                <PosterRail
                  key={row.id}
                  title={row.title}
                  items={row.items}
                  variant={row.variant}
                  seeAll={row.seeAll}
                />
              );
            case 'circle':
              return (
                <CircleRail
                  key={row.id}
                  title={row.title}
                  items={row.items}
                  seeAll={row.seeAll}
                />
              );
            case 'themed':
              return (
                <ThemedBlock
                  key={row.id}
                  title={row.title}
                  themeTitle={row.themeTitle}
                  themeGradient={row.themeGradient}
                  bgImage={row.bgImage}
                  items={row.items}
                />
              );
            case 'ott-block':
              return (
                <OTTPlatformsBlock
                  key={row.id}
                  title={row.title}
                  platforms={row.platforms}
                  cards={row.cards}
                />
              );
            default:
              return null;
          }
        })}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

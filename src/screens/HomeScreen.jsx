import { Fragment, useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import { heroSlides } from '../data/heroSlides';
import { homeRows } from '../data/homeRows';
import { POSTERS } from '../assets/posters';
import HeroTopBar from '../components/home/HeroTopBar';
import CategoryTabs from '../components/home/CategoryTabs';
import HeroCarousel from '../components/home/HeroCarousel';
import PromoBanner from '../components/home/PromoBanner';
import AdBanner from '../components/home/AdBanner';
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

  const handlePlay = useCallback(() => {
    const first = dramas[0];
    if (first) playDrama(first);
  }, [playDrama]);

  return (
    <div className="relative w-full h-full bg-[#0A090B] overflow-hidden">
      <HeroTopBar tint={heroTint} onSubscribe={() => setShowSubscribe(true)} />

      <div className="relative w-full h-full overflow-y-auto no-scrollbar pb-[90px]">
        <div style={{ height: 84 }} />

        <CategoryTabs />

        <div className="pt-4">
          <HeroCarousel slides={heroSlides} onActiveChange={handleActiveHero} onPlay={handlePlay} />
        </div>

        <PromoBanner />

        <MicroDramaRail
          items={dramas}
          onOpenMicroDrama={() => setScreen(SCREENS.MICRODRAMA)}
          onPlay={playDrama}
        />

        {/* Content rails — splice the standalone landscape ad banner between Recommended and 18 Takay */}
        {homeRows.map((row, idx, arr) => {
          const next = arr[idx + 1];
          const insertBannerAfter = row.id === 'recommended' && next?.id === '18-takay';
          return (
            <Fragment key={row.id}>
              {renderRow(row)}
              {insertBannerAfter && <AdBanner image={POSTERS.adLandscape} alt="Bioscope+ promo" />}
            </Fragment>
          );
        })}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function renderRow(row) {
  switch (row.variant) {
    case 'portrait':
    case 'landscape':
    case 'numbered':
      return (
        <PosterRail
          title={row.title}
          items={row.items}
          variant={row.variant}
          seeAll={row.seeAll}
        />
      );
    case 'circle':
      return <CircleRail title={row.title} items={row.items} seeAll={row.seeAll} />;
    case 'themed':
      return (
        <ThemedBlock
          title={row.title}
          themeTitle={row.themeTitle}
          themeGradient={row.themeGradient}
          bgImage={row.bgImage}
          items={row.items}
        />
      );
    case 'ott-block':
      return <OTTPlatformsBlock title={row.title} platforms={row.platforms} cards={row.cards} />;
    default:
      return null;
  }
}

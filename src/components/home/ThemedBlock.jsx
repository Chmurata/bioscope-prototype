import { ArrowRight } from 'lucide-react';
import { ContentLabel } from '../ContentLabel';

// Themed promo block — campaign artwork covers the ENTIRE section as one background,
// with the title row, See all pill, and poster rail all overlaid on top of it.
// Full-bleed edge-to-edge (no side margin, no rounded corners).
export default function ThemedBlock({ title, themeTitle, themeGradient, bgImage, items, onSeeAll }) {
  return (
    <div className="relative mt-8 mb-4 w-full">
      {/* Full-section background — anchor to top so the campaign title text
          at the top of the artwork never gets cropped */}
      {bgImage ? (
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: themeGradient || 'linear-gradient(180deg, #2a1259 0%, #1a0c40 100%)' }}
        />
      )}
      {/* Readability scrim over the artwork so overlaid text remains legible */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />

      {/* All content sits on top of the background */}
      <div className="relative">
        {!bgImage && themeTitle && (
          <div className="text-center pt-4">
            <span className="text-[18px] font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              {themeTitle}
            </span>
          </div>
        )}

        {/* Reserved banner area at the top — keeps the campaign artwork's
            title/character art visible before overlaid content begins */}
        <div className="h-[90px]" />

        {/* Title + See all */}
        <div className="flex items-center justify-between px-4 pt-4 pb-4">
          <h3 className="text-[18px] font-bold text-white leading-none" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            {title}
          </h3>
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 bg-black/50 ring-1 ring-white/15 backdrop-blur-sm rounded-[6px] px-2 py-0.5 cursor-pointer"
          >
            <span className="text-[10px] font-medium text-white">See all</span>
            <ArrowRight size={10} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* Poster rail */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-8">
          {items.map((it) => (
            <div
              key={it.id}
              className="shrink-0 relative rounded-[8px] overflow-hidden bg-black/40 shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
              style={{ width: 140, height: 196 }}
            >
              <img src={it.poster} alt="" className="w-full h-full object-cover" />
              {it.chip && <ContentLabel label={it.chip} position="tr" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

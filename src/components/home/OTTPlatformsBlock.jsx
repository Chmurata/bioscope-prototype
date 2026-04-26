import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ContentLabel } from '../ContentLabel';

// "All OTT Platforms" row — platform tabs on top, 2 landscape cards + "Browse X →" CTA below.
// Mimics the Bioscope+ tabbed OTT explorer at the bottom of the home feed.
export default function OTTPlatformsBlock({ title, platforms, cards, onBrowse }) {
  const [active, setActive] = useState(platforms[0]?.id);
  const selected = platforms.find((p) => p.id === active) ?? platforms[0];

  return (
    <div className="pt-7 pb-2">
      <div className="px-4 mb-3">
        <h3 className="text-[18px] font-bold text-white leading-none">{title}</h3>
      </div>

      {/* Platform tabs — overflow-y-visible so the active ring + tall white tile don't clip */}
      <div className="flex gap-2 overflow-x-auto overflow-y-visible no-scrollbar px-4 mb-3 py-1">
        {platforms.map((p) => {
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`shrink-0 flex items-center gap-2 rounded-[10px] px-3 py-2 cursor-pointer transition-colors ${
                isActive ? 'bg-white/8 ring-1 ring-white/50' : 'bg-transparent'
              }`}
            >
              <div className="w-[22px] h-[22px] rounded-[4px] overflow-hidden bg-white shrink-0">
                {p.logo ? (
                  <img src={p.logo} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span
                    className="w-full h-full flex items-center justify-center font-bold leading-none whitespace-pre text-center"
                    style={{ color: p.logoColor, fontSize: p.fs, background: p.logoBg }}
                  >
                    {p.logoText}
                  </span>
                )}
              </div>
              <span className="text-[14px] font-semibold text-white whitespace-nowrap">{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Portrait poster cards — matches the rest of the home feed and fits real Bioscope artwork */}
      <div className="flex gap-3 overflow-x-auto overflow-y-visible no-scrollbar px-4">
        {cards.map((c) => (
          <div key={c.id} className="shrink-0 relative rounded-[10px] overflow-hidden bg-[#1E2224]" style={{ width: 130, height: 184 }}>
            <img src={c.poster} alt="" className="w-full h-full object-cover" />
            {c.chip && <ContentLabel label={c.chip} position="tr" />}
          </div>
        ))}
      </div>

      {/* Browse CTA */}
      <div className="px-4 pt-3">
        <button
          onClick={() => onBrowse?.(selected.id)}
          className="w-full flex items-center justify-center gap-2 bg-[#1E2224] ring-1 ring-white/10 rounded-[10px] py-3 cursor-pointer"
        >
          <span className="text-[14px] font-semibold text-white">Browse {selected.name}</span>
          <ArrowRight size={14} className="text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

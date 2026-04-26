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

      {/* Platform tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 mb-3">
        {platforms.map((p) => {
          const isActive = p.id === active;
          const bgStyle = p.logoBg.startsWith('linear-gradient') ? { backgroundImage: p.logoBg } : { background: p.logoBg };
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`shrink-0 flex items-center gap-2 rounded-[10px] px-3 py-2 cursor-pointer transition-colors ${
                isActive ? 'bg-white/8 ring-1 ring-white/50' : 'bg-transparent'
              }`}
            >
              <div
                className="w-[22px] h-[22px] rounded-[4px] flex items-center justify-center"
                style={bgStyle}
              >
                <span className="font-bold leading-none whitespace-pre text-center" style={{ color: p.logoColor, fontSize: p.fs }}>{p.logoText}</span>
              </div>
              <span className="text-[14px] font-semibold text-white">{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Landscape cards */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {cards.map((c) => (
          <div key={c.id} className="shrink-0 relative rounded-[10px] overflow-hidden bg-[#1E2224]" style={{ width: 260, height: 146 }}>
            <img src={c.landscape ?? c.poster} alt="" className="w-full h-full object-cover" />
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

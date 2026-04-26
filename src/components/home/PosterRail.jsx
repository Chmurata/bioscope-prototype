import SectionHeader from './SectionHeader';
import { ContentLabel } from '../ContentLabel';

// Platform mini-logo renderer — small rounded square top-left of each card.
// Keys map loosely to known OTT wordmarks used in the Bioscope home.
const PLATFORM_STYLES = {
  iscreen:   { bg: '#BF1F2E', text: 'i',        color: '#FFFFFF', fs: 14 },
  hoichoi:   { bg: '#E11D48', text: 'h',        color: '#FFFFFF', fs: 13 },
  chorki:    { bg: 'linear-gradient(135deg,#F08232,#E11D48)', text: 'C', color: '#FFFFFF', fs: 14 },
  sonyliv:   { bg: '#000000', text: 'SL',       color: '#FFFFFF', fs: 9 },
  deepto:    { bg: '#0F1623', text: 'দীপ্ত',     color: '#00BBFF', fs: 10 },
  lionsgate: { bg: '#000000', text: 'LP',       color: '#F5C518', fs: 9 },
};

function PlatformTile({ platform, size = 26 }) {
  const s = PLATFORM_STYLES[platform];
  if (!s) return null;
  const bgStyle = s.bg.startsWith('linear-gradient') ? { backgroundImage: s.bg } : { background: s.bg };
  return (
    <div className="absolute top-2 left-2 z-10 rounded-[6px] flex items-center justify-center" style={{ width: size, height: size, ...bgStyle }}>
      <span className="font-bold leading-none whitespace-pre text-center" style={{ color: s.color, fontSize: s.fs }}>{s.text}</span>
    </div>
  );
}

function BottomLabel({ label }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#00BBFF] px-2 py-1">
      <span className="text-[10px] font-bold text-white">{label}</span>
    </div>
  );
}

// Horizontal scrollable rail.
// variant: 'portrait' (standard) | 'landscape' (16:9) | 'numbered' (top-10 style with large numeral)
export default function PosterRail({ title, items, variant = 'portrait', seeAll = true, onSeeAll }) {
  const config = {
    portrait:  { w: 128, h: 180, titleSize: 12 },
    landscape: { w: 160, h: 200, titleSize: 12 },
    numbered:  { w: 128, h: 192, titleSize: 13 },
  }[variant];

  return (
    <div className="pt-7 pb-2">
      <div className="px-4">
        <SectionHeader title={title} seeAll={seeAll} onSeeAll={onSeeAll} />
      </div>
      <div
        className="flex gap-3 overflow-x-auto overflow-y-visible no-scrollbar px-4 py-2"
        style={{ paddingLeft: variant === 'numbered' ? 48 : 16 }}
      >
        {items.map((it, i) => (
          <div key={it.id} className="shrink-0 relative" style={{ width: config.w }}>
            {variant === 'numbered' && (
              <span
                className="absolute -left-[40px] bottom-0 text-[120px] font-black text-white/95 leading-[0.8] pointer-events-none select-none"
                style={{ textShadow: '2px 0 0 rgba(0,0,0,0.5), -2px 0 0 rgba(0,0,0,0.5)', WebkitTextStroke: '2px rgba(0,0,0,0.55)' }}
              >
                {i + 1}
              </span>
            )}
            <div className="relative rounded-[8px] overflow-hidden bg-[#1E2224]" style={{ width: config.w, height: config.h }}>
              <img src={it.poster} alt="" className="w-full h-full object-cover" />
              {it.platform && <PlatformTile platform={it.platform} />}
              {it.chip && <ContentLabel label={it.chip} position="tr" />}
              {variant === 'landscape' && it.overlay && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                    <div className="bg-[#E11D48] text-white text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 inline-block mb-1">
                      {it.overlay}
                    </div>
                    {it.timestamp && <p className="text-[9px] text-white font-semibold leading-none">{it.timestamp}</p>}
                  </div>
                </>
              )}
              {it.bottomLabel && !it.overlay && <BottomLabel label={it.bottomLabel} />}
            </div>
            <p className="text-[13px] font-medium text-white mt-2 truncate" style={{ fontSize: config.titleSize }}>{it.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import SectionHeader from './SectionHeader';
import { ContentLabel } from '../ContentLabel';
import { OTT_LOGOS } from '../../assets/ott-logos';

// Platform key → real OTT logo. Replaces the previous CSS text-tile fallbacks.
const PLATFORM_LOGOS = {
  iscreen:   OTT_LOGOS.iscreen,
  hoichoi:   OTT_LOGOS.hoichoi,
  chorki:    OTT_LOGOS.chorki,
  sonyliv:   OTT_LOGOS.sonyliv,
  deepto:    OTT_LOGOS.deepto,
  lionsgate: OTT_LOGOS.lionsgate,
  klikk:     OTT_LOGOS.klikk,
  shemaroo:  OTT_LOGOS.shemaroo,
  epicon:    OTT_LOGOS.epicOn,
  docubay:   OTT_LOGOS.docubay,
};

function PlatformTile({ platform, size = 26 }) {
  const logo = PLATFORM_LOGOS[platform];
  if (!logo) return null;
  return (
    <div className="absolute top-2 left-2 z-10 rounded-[6px] overflow-hidden bg-white" style={{ width: size, height: size }}>
      <img src={logo} alt="" className="w-full h-full object-cover" />
    </div>
  );
}

// Bottom-corner chip — same size/shape as the top "Exclusive" badge, but uses
// the live Bioscope label color (--label-start / --label-end resolve to the same
// hsl, so it's a flat blue rather than a gradient).
function BottomLabel({ label }) {
  return (
    <span
      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 px-2 py-[4px] rounded-[3px] text-[9.5px] font-semibold tracking-wide leading-none text-white whitespace-nowrap"
      style={{ backgroundColor: 'hsl(229.71 89.74% 61.76%)' }}
    >
      {label}
    </span>
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

import { OTT_BRANDS } from '../data/plans';
import { OTT_LOGOS } from '../assets/ott-logos';

// Map subscription-plan brand keys → real OTT logos when available.
// Falls back to the CSS text tile for brands without a real logo asset.
const BRAND_LOGO = {
  hoichoi:   OTT_LOGOS.hoichoi,
  chorki:    OTT_LOGOS.chorki,
  sonyLiv:   OTT_LOGOS.sonyliv,
  deepto:    OTT_LOGOS.deepto,
  shemaroo:  OTT_LOGOS.shemaroo,
  epicOn:    OTT_LOGOS.epicOn,
  klikk:     OTT_LOGOS.klikk,
  lionsgate: OTT_LOGOS.lionsgate,
  iscreen:   OTT_LOGOS.iscreen,
};

// Grid of OTT brand tiles — used inside PlanCard and the checkout plan summary.
export default function OTTLogoStrip({ brands = [], size = 44, cols = 7 }) {
  return (
    <div className="flex gap-1 flex-wrap" style={{ maxWidth: cols * (size + 4) - 4 }}>
      {brands.map((key, i) => {
        const realLogo = BRAND_LOGO[key];
        const b = OTT_BRANDS[key];
        if (!realLogo && !b) return null;

        if (realLogo) {
          return (
            <div
              key={`${key}-${i}`}
              className="rounded-[5px] overflow-hidden shrink-0 bg-white"
              style={{ width: size, height: size }}
              title={b?.name}
            >
              <img src={realLogo} alt={b?.name ?? key} className="w-full h-full object-cover" />
            </div>
          );
        }

        // Fallback: CSS text tile for brands without an authentic logo asset
        const bgStyle = b.bg.startsWith('linear-gradient')
          ? { backgroundImage: b.bg }
          : { background: b.bg };
        const scaledFs = Math.max(5, Math.round((b.fs * size) / 44));
        return (
          <div
            key={`${key}-${i}`}
            className="rounded-[5px] flex items-center justify-center overflow-hidden shrink-0"
            style={{
              width: size,
              height: size,
              border: b.border ? `1px solid ${b.border}` : 'none',
              ...bgStyle,
            }}
            title={b.name}
          >
            <span
              className="text-center leading-none whitespace-pre"
              style={{
                color: b.color,
                fontSize: scaledFs,
                fontWeight: b.weight,
                fontStyle: b.italic ? 'italic' : 'normal',
                letterSpacing: scaledFs < 8 ? '0' : '-0.02em',
              }}
            >
              {b.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import { Clock } from 'lucide-react';
import OTTLogoStrip from './OTTLogoStrip';

// Bioscope+ plan card. Two visual variants from the production design:
//   - primary: solid navy-blue fill (Bioscope+ Super style) — used for the featured/recommended plan
//   - neutral: dark grey card (Bioscope+ Bangla style) — used for the rest
// Layout: title row · clock+duration+price row · subtitle · 3 poster thumbnails · OTT grid.
// No radio, no save chip, no old price — selection is carried by the card ring.
export default function PlanCard({ plan, selected, onSelect }) {
  const isPrimary = plan.variant === 'primary';

  const baseBg = isPrimary
    ? 'bg-[linear-gradient(135deg,#1E2A6B_0%,#111A42_40%,#0A0F28_75%,#050813_100%)]'
    : 'bg-[#1E2224]';

  const ring = selected
    ? 'ring-1 ring-[#00BBFF]/60 shadow-[0_0_0_1px_rgba(0,187,255,0.1),0_10px_30px_rgba(0,187,255,0.18)]'
    : 'ring-1 ring-white/8';

  return (
    <button
      onClick={() => onSelect?.(plan.id)}
      className={`w-full text-left rounded-[16px] px-4 pt-4 pb-4 relative cursor-pointer transition-all ${baseBg} ${ring}`}
    >
      {/* Ribbon "Recommended" — Figma spec: 4/4/0/4 corners, overhangs 5px past the card's right edge,
          drop-shadow -4px 2px 6px rgba(0,0,0,0.5), plus a small folded-tail triangle behind the bottom-right corner. */}
      {plan.badge && (
        <>
          <div
            className="absolute z-20 pointer-events-none bg-white px-2 flex items-center"
            style={{
              top: 22,
              right: -5,
              height: 17,
              borderRadius: '4px 4px 0 4px',
              boxShadow: '-4px 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            <span className="text-[9px] font-medium text-[#25323D] whitespace-nowrap leading-none">
              {plan.badge}
            </span>
          </div>
          {/* Folded tail triangle — tucked under the bottom-right corner of the pill */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              top: 39,
              right: -5,
              width: 5,
              height: 6,
              background: '#7A7A7A',
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            }}
          />
        </>
      )}

      {/* Title — Figma: 18px/700/lh 28, pr reserve for the ribbon */}
      <h3 className="text-[18px] font-bold text-white leading-[28px] pr-[108px]">{plan.title}</h3>

      {/* Duration + Price row — Figma: duration 14/400/#D2D6DB, price 18/700/white */}
      <div className="flex items-center justify-between mt-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-[#D2D6DB]" strokeWidth={1.75} />
          <span className="text-[14px] text-[#D2D6DB] font-normal leading-[20px]">{plan.duration}</span>
        </div>
        <span className="text-[18px] font-bold text-white tabular-nums leading-[28px]">৳{plan.price}</span>
      </div>

      {/* Subtitle — Figma: 12px/400/#FFFFFF/lh 18 */}
      <p className="text-[12px] text-white/90 mb-2 leading-[18px]">{plan.subtitle}</p>

      {/* Poster thumbnails (optional) */}
      {plan.posters?.length > 0 && (
        <div className="flex gap-1 mb-2">
          {plan.posters.slice(0, 3).map((src, i) => (
            <div key={i} className="w-[60px] h-[34px] rounded-[4px] overflow-hidden bg-black/30 shrink-0">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* OTT logo row — Figma: 26×26 tiles, gap 4, single row */}
      {plan.ottBrands?.length > 0 && (
        <OTTLogoStrip brands={plan.ottBrands} size={26} cols={10} />
      )}
    </button>
  );
}

import { OTT_BRANDS } from '../data/plans';

// Grid of OTT brand tiles — matches the Bioscope+ plan card style:
// square rounded tiles (~44×44) with the brand's real wordmark rendered in CSS.
// Used inside PlanCard and the checkout plan summary.
export default function OTTLogoStrip({ brands = [], size = 44, cols = 7 }) {
  return (
    <div className="flex gap-1 flex-wrap" style={{ maxWidth: cols * (size + 4) - 4 }}>
      {brands.map((key, i) => {
        const b = OTT_BRANDS[key];
        if (!b) return null;
        const bgStyle = b.bg.startsWith('linear-gradient')
          ? { backgroundImage: b.bg }
          : { background: b.bg };
        // Scale text down proportionally when tile size shrinks
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

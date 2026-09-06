import { BRAND_ACCENTS } from '../data/vouchers';

const FALLBACK_ACCENT = '#4664F5';
const tint = (hex, alpha) => `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;

// One brand chip for every voucher surface: a tinted dark tile carrying the real
// logo. The logos are drawn for dark grounds, so a white tile is wrong for them.
export default function VoucherBrandMark({ brand, logo, size = 48, radius = 12, className = '' }) {
  const hex = BRAND_ACCENTS[brand] || FALLBACK_ACCENT;
  return (
    <div
      className={`flex items-center justify-center shrink-0 ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: tint(hex, 0.18) }}
    >
      {logo ? (
        <img
          src={logo}
          alt={brand}
          className="object-contain"
          style={{ width: Math.round(size * 0.64), height: Math.round(size * 0.64) }}
        />
      ) : (
        <span className="text-[11px] font-bold text-white">{brand}</span>
      )}
    </div>
  );
}

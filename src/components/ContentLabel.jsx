/**
 * Shared content-corner label pill. Used across home rails (home page) AND
 * microdrama cards — one component, one size, one set of rules.
 *
 * - "Exclusive" renders in the Bioscope cyan (#73F5FD on dark text), matching
 *   the Figma design system for the platform's signature chip.
 * - Other labels ("New", "Popular", "Trending") keep their semantic colors.
 * - Position defaults to top-left (microdrama style), but home rails pass
 *   `position="tr"` to anchor top-right.
 */

const LABEL_STYLES = {
  Exclusive: 'bg-[#73F5FD] text-[#0A090B]',
  New:       'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
  Popular:   'bg-gradient-to-br from-rose-500 to-rose-600 text-white',
  Trending:  'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white',
};

const POSITIONS = {
  tl: 'top-1.5 left-1.5',
  tr: 'top-1.5 right-1.5',
  bl: 'bottom-1.5 left-1.5',
  br: 'bottom-1.5 right-1.5',
};

export function ContentLabel({ label, position = 'tr', className = '' }) {
  if (!label) return null;
  const style = LABEL_STYLES[label] ?? 'bg-white/90 text-black';
  const pos = POSITIONS[position] ?? POSITIONS.tl;
  return (
    <span
      className={`absolute ${pos} px-2 py-[4px] rounded-[3px] text-[9.5px] font-semibold tracking-wide leading-none ${style} ${className}`}
      aria-label={label}
    >
      {label}
    </span>
  );
}

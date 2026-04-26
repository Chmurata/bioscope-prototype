// Standalone full-width ad/promo banner that lives BETWEEN content rails.
// Used for the Bioscope landscape ad artwork (the one that's a banner, not a content thumbnail).
// Mirrors the visual treatment of PromoBanner — full-bleed image, rounded, edge inset.
export default function AdBanner({ image, onClick, alt = '' }) {
  if (!image) return null;
  return (
    <div className="px-4 pt-5">
      <button
        type="button"
        onClick={onClick}
        className="block w-full rounded-[12px] overflow-hidden cursor-pointer"
        aria-label={alt || 'Promotional banner'}
      >
        <img src={image} alt={alt} className="w-full h-auto object-cover" />
      </button>
    </div>
  );
}

// Cyan "Playing" pill — used on the currently active episode tile.
// Brand teal #46ffff matches the See more / accent color used elsewhere.
export default function PlayingBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold leading-none px-1.5 py-[3px] rounded-[5px] text-[#062a2a]"
      style={{ background: '#46ffff' }}
    >
      <span
        className="w-[5px] h-[5px] rounded-full bg-[#062a2a]"
        style={{ animation: 'pulse 1.4s ease-in-out infinite' }}
      />
      Playing
    </span>
  );
}

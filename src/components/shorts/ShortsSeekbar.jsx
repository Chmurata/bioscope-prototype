// Thin pause-only seekbar pinned to the bottom of the canvas.
// Cyan fill, light grey track, small white circular scrubber at the playhead.
export default function ShortsSeekbar({ progress = 0 }) {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div className="absolute left-0 right-0 bottom-0 px-3 pb-2 z-30 pointer-events-none">
      <div className="relative h-[3px] rounded-full bg-white/25">
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full"
          style={{ width: `${pct}%`, background: '#46ffff' }}
        />
        <div
          className="absolute -top-[3.5px] w-[10px] h-[10px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
    </div>
  );
}

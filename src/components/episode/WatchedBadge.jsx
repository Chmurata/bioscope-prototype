// FB-style "Watched" pill. Used on watched episode tiles (sm) and on the
// home Continue Watching rail card when a drama hits 100% (md).
export default function WatchedBadge({ size = 'sm' }) {
  const cls = size === 'md'
    ? 'text-[10px] px-2 py-1 rounded-md'
    : 'text-[9px] px-1.5 py-[3px] rounded-[5px]';
  return (
    <span className={`bg-black/75 backdrop-blur-sm text-white font-medium leading-none ${cls}`}>
      Watched
    </span>
  );
}

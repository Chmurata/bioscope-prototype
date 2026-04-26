import SectionHeader from './SectionHeader';
import { ContentLabel } from '../ContentLabel';

// Horizontal rail of circular tiles — used for Live TV channels and Unlimited Entertainment OTTs.
// Each item: white circle with brand text/logo + floating "Exclusive" chip above it.
export default function CircleRail({ title, items, seeAll = true, onSeeAll, size = 88 }) {
  return (
    <div className="pt-7 pb-2">
      <div className="px-4">
        <SectionHeader title={title} seeAll={seeAll} onSeeAll={onSeeAll} />
      </div>
      <div className="flex gap-4 overflow-x-auto overflow-y-visible no-scrollbar px-4 pt-5 pb-2">
        {items.map((it) => (
          <div key={it.id} className="shrink-0 flex flex-col items-center" style={{ width: size + 8 }}>
            <div className="relative">
              {it.chip && (
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 px-2 py-[4px] rounded-[3px] text-[9.5px] font-semibold tracking-wide leading-none bg-[#73F5FD] text-[#0A090B]"
                >
                  {it.chip}
                </span>
              )}
              <div
                className="rounded-full flex items-center justify-center overflow-hidden bg-white"
                style={{ width: size, height: size }}
              >
                {it.logo ? (
                  <img src={it.logo} alt={it.title} className="w-full h-full object-cover" />
                ) : (
                  <span
                    className="font-bold leading-tight text-center whitespace-pre"
                    style={{ color: it.logoColor, fontSize: it.logoFs }}
                  >
                    {it.logoText}
                  </span>
                )}
              </div>
            </div>
            <p className="text-[12px] font-medium text-white text-center mt-2 truncate w-full">{it.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

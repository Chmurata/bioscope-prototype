import { ArrowRight } from 'lucide-react';

// Section header: left title (optionally with emoji/icon) + right "See all →" pill.
export default function SectionHeader({ title, onSeeAll, seeAll = true }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[18px] font-bold text-white leading-none">{title}</h3>
      {seeAll && (
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1.5 bg-[#1E2224] ring-1 ring-white/10 rounded-[8px] px-3 py-1.5 cursor-pointer"
        >
          <span className="text-[12px] font-medium text-white">See all</span>
          <ArrowRight size={12} className="text-white" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

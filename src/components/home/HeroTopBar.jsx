import bioscopeLogo from '../../assets/bioscope-logo.svg';
import crownIcon from '../../assets/crown.svg';
import { Search } from 'lucide-react';

// Sticky top bar for the home screen.
// Background gradient blends from the current hero's tint color at the top to transparent below,
// creating the "dominant color halo" effect seen in the Bioscope+ app.
export default function HeroTopBar({ tint = '#3a2c2c', onSubscribe, onSearch }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      {/* Tint gradient backdrop — 160px tall, fades to transparent */}
      <div
        className="absolute top-0 left-0 right-0 h-[180px]"
        style={{
          background: `linear-gradient(180deg, ${tint} 0%, ${tint}00 100%)`,
          transition: 'background 0.6s ease',
        }}
      />
      {/* Content row */}
      <div className="relative flex items-center justify-between px-4 pt-11 pb-3 pointer-events-auto">
        <img src={bioscopeLogo} alt="Bioscope+" className="h-[22px] w-auto" />
        <div className="flex items-center gap-3">
          <button onClick={onSearch} className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer" aria-label="Search">
            <Search size={20} className="text-white" strokeWidth={2.2} />
          </button>
          <button
            onClick={onSubscribe}
            className="flex items-center gap-1.5 bg-[#FFCF60] rounded-[10px] px-3 py-1.5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
          >
            <img src={crownIcon} alt="" className="w-[18px] h-[18px]" />
            <span className="text-[14px] font-semibold text-[#2a2a2a] leading-none">Subscribe</span>
          </button>
        </div>
      </div>
    </div>
  );
}

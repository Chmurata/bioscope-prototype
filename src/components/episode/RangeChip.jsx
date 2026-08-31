import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Instagram-style filter chip — left-aligned pill that opens a floating menu
// of episode ranges (e.g. "EP 1–30", "EP 31–60", "EP 61–90"). Single select.
export default function RangeChip({ ranges, activeIndex, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Click-outside close.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!ranges || ranges.length === 0) return null;
  const current = ranges[Math.min(activeIndex, ranges.length - 1)];

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 bg-[#242628] ring-1 ring-white/10 rounded-full px-3 h-[28px] cursor-pointer"
      >
        <span className="text-[12px] font-medium text-white leading-none">EP {current.label}</span>
        <ChevronDown size={12} className={`text-white transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={2.2} />
      </button>

      {open && (
        <div className="absolute left-0 top-[34px] z-50 min-w-[140px] bg-card rounded-[10px] ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden">
          {ranges.map((r, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={r.label}
                onClick={() => { onChange(i); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left cursor-pointer ${active ? 'bg-white/5' : 'hover:bg-white/[0.03]'}`}
              >
                <span className={`text-[12px] ${active ? 'text-white font-semibold' : 'text-text-secondary'}`}>EP {r.label}</span>
                {active && <Check size={14} className="text-white" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

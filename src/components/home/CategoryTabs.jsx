import { useState } from 'react';

// Horizontal scrollable category pills: Home / Movies / Shows / Sports / Free TV
// Active = white pill with black text. Inactive = transparent with white text.
const DEFAULT_TABS = ['Home', 'Movies', 'Shows', 'Sports', 'Free TV'];

export default function CategoryTabs({ tabs = DEFAULT_TABS, value, onChange }) {
  const [internal, setInternal] = useState(tabs[0]);
  const active = value ?? internal;
  const set = (t) => { setInternal(t); onChange?.(t); };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            onClick={() => set(t)}
            className={`shrink-0 rounded-[6px] px-3 py-1 cursor-pointer transition-colors ${
              isActive ? 'bg-white' : 'bg-black/25'
            }`}
          >
            <span
              className={`text-[12px] leading-none ${
                isActive ? 'text-[#2a2a2a] font-semibold' : 'text-white font-medium'
              }`}
            >
              {t}
            </span>
          </button>
        );
      })}
    </div>
  );
}

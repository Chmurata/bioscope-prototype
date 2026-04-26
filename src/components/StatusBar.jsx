export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 h-[30px] bg-transparent relative z-10">
      <span className="text-[12px] font-semibold text-white">11:11</span>
      <div className="flex items-center gap-1">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <rect x="0" y="6" width="3" height="4" rx="0.5" fill="white" />
          <rect x="4" y="4" width="3" height="6" rx="0.5" fill="white" />
          <rect x="8" y="2" width="3" height="8" rx="0.5" fill="white" />
          <rect x="12" y="0" width="3" height="10" rx="0.5" fill="white" />
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="white" strokeWidth="1" />
          <rect x="19" y="3" width="2" height="4" rx="1" fill="white" opacity="0.4" />
          <rect x="2" y="2" width="12" height="6" rx="1" fill="white" />
        </svg>
      </div>
    </div>
  );
}

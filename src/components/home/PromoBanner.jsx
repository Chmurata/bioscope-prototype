// Thin purple promo strip below the hero.
// Renders a Bangla marketing line with a small phone illustration on the right.
export default function PromoBanner() {
  return (
    <div className="px-4 pt-3">
      <div className="relative w-full h-[62px] rounded-[10px] overflow-hidden bg-[linear-gradient(90deg,#2E1065_0%,#4C1D95_60%,#6D28D9_100%)] flex items-center justify-between px-3">
        <div className="flex flex-col leading-tight">
          <span className="text-[12px] font-semibold text-white">প্যাক আপনার,</span>
          <span className="text-[12px] font-semibold text-white">পছন্দও আপনার!</span>
          <span className="text-[8px] text-white/70 mt-0.5">সাবস্ক্রাইব করুন সেরা প্যাকে</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-[42px] h-[52px] rounded-[8px] bg-black/40 ring-1 ring-white/15 flex items-center justify-center">
            <div className="w-[30px] h-[40px] rounded-[4px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500" />
          </div>
          <div className="bg-white rounded-[6px] px-2 py-1 ml-1">
            <span className="text-[9px] font-semibold text-black leading-none">কাস্টমাইজ করুন</span>
          </div>
        </div>
      </div>
    </div>
  );
}

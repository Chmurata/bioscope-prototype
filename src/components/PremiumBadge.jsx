import { Crown } from "lucide-react";

/**
 * Golden crown premium badge overlay for drama thumbnails.
 * Renders at absolute top-right of a relatively-positioned poster wrapper.
 */
export function PremiumBadge({ size = "md", className = "" }) {
  const dims = {
    sm: { box: "w-5 h-5", icon: 12 },
    md: { box: "w-6 h-6", icon: 14 },
    lg: { box: "w-7 h-7", icon: 16 },
  }[size];

  return (
    <div
      className={`absolute top-0.5 right-0.5 ${dims.box} rounded-full flex items-center justify-center bg-black/15 backdrop-blur-md ring-1 ring-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${className}`}
      aria-label="Premium content"
    >
      <Crown
        size={dims.icon}
        strokeWidth={2}
        className="text-amber-300"
        fill="#fcd34d"
      />
    </div>
  );
}

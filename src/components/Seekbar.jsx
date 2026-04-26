import { useEffect, useState, useRef } from 'react';

export default function Seekbar({ duration = 15000, onComplete, isPlaying, onSeek }) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimeRef.current = Date.now() - (progress / 100) * duration;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        onComplete?.();
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(pct);
    startTimeRef.current = Date.now() - (pct / 100) * duration;
    onSeek?.(pct);
  };

  // Reset when isPlaying changes to true with progress at 0
  useEffect(() => {
    if (isPlaying && progress >= 100) {
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  }, [isPlaying]);

  return (
    <div className="w-full h-[3px] bg-white/20 cursor-pointer" onClick={handleClick}>
      <div
        className="h-full bg-accent rounded-full relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-accent rounded-full shadow-lg" />
      </div>
    </div>
  );
}

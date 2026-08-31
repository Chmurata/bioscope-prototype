import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Settings, Cast, PictureInPicture, Play, Pause, Maximize, RotateCcw, RotateCw, X, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LongFormPlayer({ 
  src, 
  poster, 
  title, 
  playing, 
  onPlayPause, 
  onBack,
  onOpenSettings,
  endTime, // e.g., 40s for preview
  onBoundaryReached
}) {
  const videoRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const { orientation } = useApp();
  
  const activeFullscreen = isFullscreen || orientation === 'landscape';
  
  const hideTimerRef = useRef(null);

  const resetHideTimer = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  };

  useEffect(() => {
    if (playing) {
      videoRef.current?.play().catch(e => console.error("Playback failed", e));
      resetHideTimer();
    } else {
      videoRef.current?.pause();
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [playing]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    if (endTime && current >= endTime) {
      videoRef.current.pause();
      onBoundaryReached?.();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const skip = (delta) => {
    if (videoRef.current) {
      let newTime = videoRef.current.currentTime + delta;
      if (newTime < 0) newTime = 0;
      if (endTime && newTime >= endTime) newTime = endTime - 0.1;
      if (newTime > duration) newTime = duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      resetHideTimer();
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    onPlayPause(!playing);
    resetHideTimer();
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const targetLimit = endTime || duration;
    const newTime = percentage * targetLimit;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
    resetHideTimer();
  };

  const progressPercent = (currentTime / (endTime || duration || 1)) * 100;

  const showWarning = endTime && (endTime - currentTime <= 5) && (currentTime < endTime);

  if (isPip) {
    return (
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        <span className="text-white/50 text-[14px]">Playing in Picture-in-Picture</span>
        
        {/* Floating Mini Player (Simulated PiP) */}
        <div className="fixed bottom-[80px] right-4 w-[160px] aspect-video bg-black rounded-lg shadow-2xl overflow-hidden z-[100] ring-1 ring-white/20">
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover pointer-events-none"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => onBoundaryReached?.()}
            muted // typical for auto PiP, but we'll leave it as is
          />
          <button 
            onClick={() => setIsPip(false)}
            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-black overflow-hidden group select-none transition-all ${activeFullscreen ? 'absolute inset-0 z-[100] !h-full !w-full flex flex-col justify-center' : 'w-full aspect-video'}`}
      onClick={resetHideTimer}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => onBoundaryReached?.()} // Normal end triggers the same boundary check
      />

      {/* Approach to end warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full z-15 pointer-events-none border border-white/10"
          >
            <span className="text-[12px] font-bold text-amber">Preview ends in {Math.ceil(endTime - currentTime)}s</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chrome Overlay */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Top Chrome */}
            <div className={`relative z-20 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)] mt-2 ${activeFullscreen ? 'px-[max(env(safe-area-inset-left),1rem)]' : ''}`}>
              <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="cursor-pointer">
                <ArrowLeft size={24} className="text-white drop-shadow-md" />
              </button>
              <div className="flex items-center gap-4">
                <button onClick={(e) => { e.stopPropagation(); setIsPip(true); }} className="cursor-pointer" aria-label="Picture in Picture">
                  <PictureInPicture size={20} className="text-white drop-shadow-md" />
                </button>
                <button className="cursor-pointer" aria-label="Cast">
                  <Cast size={20} className="text-white drop-shadow-md" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onOpenSettings(); }} className="cursor-pointer">
                  <Settings size={20} className="text-white drop-shadow-md" />
                </button>
              </div>
            </div>

            {/* Center Chrome */}
            <div className="relative z-20 flex items-center justify-center gap-8">
              <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="cursor-pointer rounded-full p-2 bg-black/30 hover:bg-black/50 transition-colors">
                <RotateCcw size={28} className="text-white" />
              </button>
              <button onClick={togglePlay} className="cursor-pointer rounded-full p-3 bg-white/10 backdrop-blur-md ring-1 ring-white/20 hover:bg-white/20 transition-colors">
                {playing ? <Pause size={36} className="text-white" fill="white" /> : <Play size={36} className="text-white" fill="white" className="ml-1" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="cursor-pointer rounded-full p-2 bg-black/30 hover:bg-black/50 transition-colors">
                <RotateCw size={28} className="text-white" />
              </button>
            </div>

            {/* Bottom Chrome */}
            <div className="relative z-20 px-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-white tabular-nums drop-shadow-md">
                  {formatTime(currentTime)} / {formatTime(endTime || duration)}
                </span>
                <button onClick={(e) => { e.stopPropagation(); setIsFullscreen(!isFullscreen); }} className="cursor-pointer" aria-label="Fullscreen">
                  {activeFullscreen ? <Minimize size={18} className="text-white drop-shadow-md" /> : <Maximize size={18} className="text-white drop-shadow-md" />}
                </button>
              </div>
              
              {/* Seekbar */}
              <div 
                className="w-full h-[6px] bg-white/30 rounded-full relative cursor-pointer group/seek"
                onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handleSeek(e); }}
                onPointerMove={(e) => { if (e.buttons === 1) handleSeek(e); }}
              >
                {endTime && duration > endTime && (
                  <div 
                    className="absolute top-0 bottom-0 bg-white/20 pointer-events-none"
                    style={{ left: `${(endTime / duration) * 100}%`, right: 0 }}
                  />
                )}
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-cyan rounded-full pointer-events-none"
                  style={{ width: `${progressPercent}%` }}
                />
                <div 
                  className="absolute top-1/2 -mt-[6px] w-[12px] h-[12px] bg-white ring-2 ring-cyan rounded-full pointer-events-none transition-transform group-hover/seek:scale-125"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

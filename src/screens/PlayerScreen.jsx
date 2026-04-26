import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { subtitleLines } from '../data/dramas';
import ActionColumn from '../components/ActionColumn';
import EpisodeSelector from '../components/EpisodeSelector';
import EpisodeTransition from '../components/EpisodeTransition';
import Seekbar from '../components/Seekbar';
import DoubleTapHeart from '../components/DoubleTapHeart';
import PlayerSettingsSheet from '../components/PlayerSettingsSheet';
import PremiumChip from '../components/PremiumChip';
import InlineAdStrip from '../components/InlineAdStrip';
import FullPageAd from '../components/FullPageAd';
import { inlineAds, fullPageAds } from '../data/ads';
import { useDoubleTap } from '../hooks/useDoubleTap';
import { ArrowLeft, Settings, FastForward, Play, Pause, ChevronRight, ThumbsUp, Share2, ListVideo, Plus, Check } from 'lucide-react';

const EPISODE_TOTAL_SECONDS = 120; // 2 min per episode (matches fixture seed)
const SWIPE_THRESHOLD = 90;        // px dragged up/down before episode switch triggers
const SWIPE_VELOCITY = 400;        // fallback: flick past this velocity also triggers

export default function PlayerScreen() {
  const {
    selectedDrama, currentEpisode, isPlaying, setIsPlaying,
    goBack, setShowDetail, setShowTransition, variants,
    liked, toggleLike, ensureLiked, myList, toggleMyList,
    setShowEpisodeSelector, playEpisode,
    tickProgress,
    setShowSubscribe,
  } = useApp();

  const [showPlayPause, setShowPlayPause] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hearts, setHearts] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inlineAdDismissed, setInlineAdDismissed] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [activeFullAd, setActiveFullAd] = useState(null);
  // Speed cycles: 0 = normal (icon + "Speed"), 1 = "1x", 2 = "2x", back to 0.
  const [speedIndex, setSpeedIndex] = useState(0);
  const cycleSpeed = () => setSpeedIndex((i) => (i + 1) % 3);

  // Reset dismissal per episode so user sees the ad again on new episodes
  useEffect(() => { setInlineAdDismissed(false); }, [currentEpisode]);

  const inlineAd = inlineAds[currentEpisode % inlineAds.length];
  const hideTimerRef = useRef(null);
  const playerRef = useRef(null);

  // Subtitle ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSubtitleIndex(prev => (prev + 1) % subtitleLines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-play when episode changes
  useEffect(() => { setIsPlaying(true); }, [currentEpisode, setIsPlaying]);

  // V3: auto-hide controls after 3s
  useEffect(() => {
    if (variants.player === 'V3' && controlsVisible) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
      return () => clearTimeout(hideTimerRef.current);
    }
  }, [controlsVisible, variants.player]);

  // Progress tick — increments 1s every second while playing, writes to context
  useEffect(() => {
    if (!isPlaying || !selectedDrama) return;
    const id = setInterval(() => {
      tickProgress(selectedDrama.id, currentEpisode, EPISODE_TOTAL_SECONDS, 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, selectedDrama, currentEpisode, tickProgress]);

  // Single-tap: toggle play/pause + (V3) reveal controls
  const handleSingleTap = useCallback(() => {
    if (variants.player === 'V3') {
      setControlsVisible(true);
      if (!controlsVisible) return;
    }
    setIsPlaying(prev => !prev);
    setShowPlayPause(true);
    setTimeout(() => setShowPlayPause(false), 650);
  }, [variants.player, controlsVisible, setIsPlaying]);

  // Double-tap: like + pop a heart at the tap location
  const handleDoubleTap = useCallback((event) => {
    if (!selectedDrama || !playerRef.current) return;
    const rect = playerRef.current.getBoundingClientRect();
    const x = (event.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (event.clientY ?? rect.top + rect.height / 2) - rect.top;
    const id = Date.now() + Math.random();
    setHearts(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 750);
    ensureLiked(selectedDrama.id);
  }, [selectedDrama, ensureLiked]);

  const gestureHandler = useDoubleTap({
    onSingleTap: handleSingleTap,
    onDoubleTap: handleDoubleTap,
  });

  // Shared episode-nav logic — used by swipe (drag) and keyboard arrows.
  // Every 3rd advance shows a full-page ad before moving to the next episode.
  const goNextEpisode = useCallback(() => {
    if (!selectedDrama || currentEpisode >= selectedDrama.totalEpisodes) return;
    const nextCount = swipeCount + 1;
    setSwipeCount(nextCount);
    if (nextCount % 3 === 0) {
      const ad = fullPageAds[(nextCount / 3 - 1) % fullPageAds.length];
      setActiveFullAd({ ad, pendingEpisode: currentEpisode + 1 });
      setIsPlaying(false);
    } else {
      playEpisode(currentEpisode + 1);
    }
  }, [selectedDrama, currentEpisode, playEpisode, swipeCount, setIsPlaying]);

  const goPrevEpisode = useCallback(() => {
    if (currentEpisode > 1) playEpisode(currentEpisode - 1);
  }, [currentEpisode, playEpisode]);

  // Swipe up → next episode, swipe down → previous (within same drama)
  const handleDragEnd = useCallback((_event, info) => {
    const dy = info.offset.y;
    const vy = info.velocity.y;
    const crossedUp = dy < -SWIPE_THRESHOLD || vy < -SWIPE_VELOCITY;
    const crossedDown = dy > SWIPE_THRESHOLD || vy > SWIPE_VELOCITY;
    if (crossedUp) goNextEpisode();
    else if (crossedDown) goPrevEpisode();
  }, [goNextEpisode, goPrevEpisode]);

  // Arrow Up → next episode, Arrow Down → previous. Skips when modals are open
  // (episode selector / full-page ad / settings) or when typing in an input.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      if (e.key === 'ArrowUp') goNextEpisode();
      else goPrevEpisode();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNextEpisode, goPrevEpisode]);

  const handleFullAdDismiss = useCallback(() => {
    if (activeFullAd?.pendingEpisode) {
      playEpisode(activeFullAd.pendingEpisode);
    }
    setActiveFullAd(null);
  }, [activeFullAd, playEpisode]);

  const handleSeekComplete = () => {
    setIsPlaying(false);
    setShowTransition(true);
  };

  if (!selectedDrama) return null;

  const isLiked = liked[selectedDrama.id];
  const isInList = myList[selectedDrama.id];
  const variant = variants.player;

  return (
    <div ref={playerRef} className="relative w-full h-full bg-black overflow-hidden">
      {/* Background poster — draggable surface behind overlays */}
      <motion.div
        className="absolute inset-0 z-[12]"
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.35}
        onDragEnd={handleDragEnd}
        onPointerUp={gestureHandler}
      >
        <img src={selectedDrama.poster} alt="" className="w-full h-full object-cover pointer-events-none" />
      </motion.div>

      {/* ===== V1: TikTok Style ===== */}
      {variant === 'V1' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-[36px]">
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="cursor-pointer"><ArrowLeft size={24} className="text-white" /></button>
              <span className="text-[14px] font-semibold text-white">EP.{currentEpisode}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={cycleSpeed}
                className="flex items-center gap-1 bg-black/45 backdrop-blur-md ring-1 ring-white/10 rounded-[12px] px-2 py-1 cursor-pointer"
                aria-label="Cycle playback speed"
              >
                <FastForward size={12} className="text-white" />
                <span className="text-[12px] font-medium text-white tabular-nums">
                  {speedIndex === 0 ? 'Speed' : `Speed ${speedIndex === 1 ? '1x' : '2x'}`}
                </span>
              </button>
              <button onClick={() => setSettingsOpen(true)} className="cursor-pointer" aria-label="Player settings">
                <Settings size={22} className="text-white" />
              </button>
            </div>
          </div>

          <div className="absolute right-3 bottom-[140px] z-20"><ActionColumn /></div>

          <div className="absolute bottom-[16px] left-4 right-[60px] z-20">
            <div className="mb-1.5">
              <PremiumChip onClick={() => setShowSubscribe(true)} />
            </div>
            <button onClick={() => setShowDetail(true)} className="flex items-center gap-1 cursor-pointer mb-1">
              <span className="text-[15px] font-bold text-white">{selectedDrama.title}</span>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
            <p className="text-[12px] text-text-muted mb-2">EP.{currentEpisode} | {selectedDrama.totalEpisodes} Episodes</p>
            {!inlineAdDismissed && (
              <InlineAdStrip
                ad={inlineAd}
                onDismiss={() => setInlineAdDismissed(true)}
                onCTA={() => setInlineAdDismissed(true)}
              />
            )}
          </div>
        </>
      )}

      {/* ===== V2: YouTube Shorts Style ===== */}
      {variant === 'V2' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[260px] bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-[36px]">
            <button onClick={goBack} className="cursor-pointer"><ArrowLeft size={22} className="text-white" /></button>
            <span className="text-[13px] font-medium text-white/80">EP.{currentEpisode} of {selectedDrama.totalEpisodes}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={cycleSpeed}
                className="flex items-center gap-1 bg-black/45 backdrop-blur-md ring-1 ring-white/10 rounded-[12px] px-2 py-1 cursor-pointer"
                aria-label="Cycle playback speed"
              >
                <FastForward size={11} className="text-white" />
                <span className="text-[11px] font-medium text-white tabular-nums">
                  {speedIndex === 0 ? 'Speed' : `Speed ${speedIndex === 1 ? '1x' : '2x'}`}
                </span>
              </button>
              <button onClick={() => setSettingsOpen(true)} className="cursor-pointer" aria-label="Player settings">
                <Settings size={20} className="text-white" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-[16px] left-4 right-4 z-20">
            <div className="mb-1.5">
              <PremiumChip onClick={() => setShowSubscribe(true)} />
            </div>
            <button onClick={() => setShowDetail(true)} className="cursor-pointer text-left mb-2 flex items-center gap-1">
              <h3 className="text-[17px] font-bold text-white leading-tight">{selectedDrama.title}</h3>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
            {!inlineAdDismissed && (
              <div className="mb-3">
                <InlineAdStrip
                  ad={inlineAd}
                  onDismiss={() => setInlineAdDismissed(true)}
                  onCTA={() => setInlineAdDismissed(true)}
                />
              </div>
            )}

            <div className="flex items-center gap-5">
              <button onClick={() => toggleLike(selectedDrama.id)} className="flex items-center gap-1.5 cursor-pointer">
                <ThumbsUp size={18} className="text-white" fill={isLiked ? 'white' : 'none'} strokeWidth={1.5} />
                <span className="text-[11px] text-white">83.4K</span>
              </button>
              <button className="flex items-center gap-1.5 cursor-pointer">
                <Share2 size={18} className="text-white" strokeWidth={1.5} />
                <span className="text-[11px] text-white">Share</span>
              </button>
              <button onClick={() => setShowEpisodeSelector(true)} className="flex items-center gap-1.5 cursor-pointer">
                <ListVideo size={18} className="text-white" strokeWidth={1.5} />
                <span className="text-[11px] text-white">Episodes</span>
              </button>
              <button onClick={() => toggleMyList(selectedDrama.id)} className="flex items-center gap-1.5 cursor-pointer">
                {isInList ? <Check size={18} className="text-white" /> : <Plus size={18} className="text-white" strokeWidth={1.5} />}
                <span className="text-[11px] text-white">Save</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== V3: Minimal ===== */}
      {variant === 'V3' && (
        <AnimatePresence>
          {controlsVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[15] pointer-events-none"
            >
              <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute top-[36px] left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
                <button onClick={goBack} className="cursor-pointer"><ArrowLeft size={20} className="text-white/80" /></button>
                <span className="text-[12px] text-white/60">EP.{currentEpisode}</span>
                <button onClick={() => setShowEpisodeSelector(true)} className="cursor-pointer">
                  <ListVideo size={20} className="text-white/80" />
                </button>
              </div>

              <div className="absolute bottom-[16px] left-4 right-4 z-20 pointer-events-auto">
                <p className="text-[13px] font-semibold text-white/90">{selectedDrama.title}</p>
                <p className="text-[10px] text-white/40">Tap for controls</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Play/pause feedback icon */}
      <div className="absolute inset-0 z-[16] flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {showPlayPause && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[56px] h-[56px] rounded-full bg-black/45 ring-1 ring-white/15 flex items-center justify-center backdrop-blur-md">
              {isPlaying ? <Pause size={24} className="text-white" fill="white" /> : <Play size={24} className="text-white ml-1" fill="white" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Double-tap hearts */}
      <DoubleTapHeart hearts={hearts} />

      {/* Subtitle */}
      {isPlaying && (
        <motion.div key={subtitleIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className={`absolute z-20 text-center pointer-events-none ${variant === 'V2' ? 'bottom-[180px] left-4 right-4' : 'bottom-[200px] left-8 right-16'}`}>
          <span className="text-[14px] font-medium text-white drop-shadow-lg bg-black/30 px-3 py-1 rounded-lg">
            {subtitleLines[subtitleIndex]}
          </span>
        </motion.div>
      )}

      {/* Seekbar */}
      <div className="absolute bottom-[8px] left-0 right-0 z-20">
        <Seekbar duration={15000} isPlaying={isPlaying} onComplete={handleSeekComplete} />
      </div>

      <EpisodeSelector />
      <EpisodeTransition />
      <PlayerSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <FullPageAd ad={activeFullAd?.ad} onDismiss={handleFullAdDismiss} />
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { subtitleTracks } from '../data/dramas';
import ActionColumn from '../components/ActionColumn';
import EpisodeTransition from '../components/EpisodeTransition';
import Seekbar from '../components/Seekbar';
import DoubleTapHeart from '../components/DoubleTapHeart';
import PlayerSettingsSheet from '../components/PlayerSettingsSheet';
import PremiumChip from '../components/PremiumChip';
import InlineAdStrip from '../components/InlineAdStrip';
import FullPageAd from '../components/FullPageAd';
import { inlineAds, fullPageAds } from '../data/ads';
import { useDoubleTap } from '../hooks/useDoubleTap';
import { ArrowLeft, Settings, Captions, CaptionsOff, Play, Pause, ChevronRight, ThumbsUp, Share2, ListVideo, Plus, Check } from 'lucide-react';

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
    pendingAdRequest, consumeAdRequest,
  } = useApp();

  const [showPlayPause, setShowPlayPause] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hearts, setHearts] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inlineAdDismissed, setInlineAdDismissed] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  // Ad streak state:
  //   { ads: [<ad>...], index, allowSkip, allowReplay, pendingEpisode }
  // pendingEpisode is null when triggered from the dev panel (no advance after).
  const [adStreak, setAdStreak] = useState(null);
  // Player settings — lifted from PlayerSettingsSheet so the top pill (CC) can
  // toggle subtitles directly and the sheet stays in sync.
  const [cc, setCc] = useState('English');          // 'Off' | 'English' | 'Bangla' | 'Hindi' — subtitles ON by default
  const [audio, setAudio] = useState('Bangla (Original)');
  const [quality, setQuality] = useState('Auto');
  const [speed, setSpeed] = useState('1x');         // '0.5x' | '1x' | '1.25x' | '1.5x' | '2x'

  const subtitlesOn = cc !== 'Off';
  // Top pill cycles: English → Bangla → Hindi → Off → English …
  const CC_CYCLE = ['English', 'Bangla', 'Hindi', 'Off'];
  const cycleSubtitles = () => {
    const i = CC_CYCLE.indexOf(cc);
    const next = CC_CYCLE[(i + 1) % CC_CYCLE.length];
    setCc(next);
  };

  // Reset dismissal per episode so user sees the ad again on new episodes
  useEffect(() => { setInlineAdDismissed(false); }, [currentEpisode]);

  const inlineAd = inlineAds[currentEpisode % inlineAds.length];
  const hideTimerRef = useRef(null);
  const playerRef = useRef(null);

  // Subtitle ticker
  useEffect(() => {
    if (!isPlaying) return;
    // Use the English track's length as the canonical line count — all tracks
    // are kept parallel so the index can index into any of them.
    const interval = setInterval(() => {
      setSubtitleIndex(prev => (prev + 1) % subtitleTracks.English.length);
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
      // Organic in-feed ad — single, skip + replay allowed by default.
      const ad = fullPageAds[(nextCount / 3 - 1) % fullPageAds.length];
      setAdStreak({
        ads: [ad],
        index: 0,
        allowSkip: true,
        allowReplay: true,
        pendingEpisode: currentEpisode + 1,
      });
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

  // Dev-panel triggered ad streak. Reads pendingAdRequest from context, builds
  // a streak of the requested length, and clears the request.
  useEffect(() => {
    if (!pendingAdRequest) return;
    const ads = Array.from({ length: pendingAdRequest.count }, (_, i) =>
      fullPageAds[i % fullPageAds.length]
    );
    setAdStreak({
      ads,
      index: 0,
      allowSkip: pendingAdRequest.allowSkip,
      allowReplay: pendingAdRequest.allowReplay,
      pendingEpisode: null,
    });
    setIsPlaying(false);
    consumeAdRequest();
  }, [pendingAdRequest, consumeAdRequest, setIsPlaying]);

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

  // Advance within the streak. After the last ad → resume the pending episode
  // (organic flow) or just dismiss (dev-panel trigger with no pendingEpisode).
  const advanceAdStreak = useCallback(() => {
    setAdStreak((s) => {
      if (!s) return null;
      const nextIndex = s.index + 1;
      if (nextIndex >= s.ads.length) {
        if (s.pendingEpisode != null) playEpisode(s.pendingEpisode);
        return null;
      }
      return { ...s, index: nextIndex };
    });
  }, [playEpisode]);

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
        className="absolute inset-0 z-[12] select-none"
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.18}
        dragMomentum={false}
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
                onClick={cycleSubtitles}
                className="flex items-center gap-1 bg-black/15 backdrop-blur-md ring-1 ring-white/10 rounded-[12px] px-2 py-1 cursor-pointer"
                aria-label={subtitlesOn ? `Switch subtitles — currently ${cc}` : 'Turn on subtitles'}
              >
                {subtitlesOn
                  ? <Captions size={12} className="text-white" />
                  : <CaptionsOff size={12} className="text-white/70" />}
                <span className={`text-[12px] font-medium tabular-nums ${subtitlesOn ? 'text-white' : 'text-white/70'}`}>
                  {subtitlesOn ? cc : 'CC Off'}
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
                onClick={cycleSubtitles}
                className="flex items-center gap-1 bg-black/15 backdrop-blur-md ring-1 ring-white/10 rounded-[12px] px-2 py-1 cursor-pointer"
                aria-label={subtitlesOn ? `Switch subtitles — currently ${cc}` : 'Turn on subtitles'}
              >
                {subtitlesOn
                  ? <Captions size={11} className="text-white" />
                  : <CaptionsOff size={11} className="text-white/70" />}
                <span className={`text-[11px] font-medium tabular-nums ${subtitlesOn ? 'text-white' : 'text-white/70'}`}>
                  {subtitlesOn ? cc : 'CC Off'}
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

            <div className="flex items-center justify-between">
              <ActionBtn 
                icon={<ThumbsUp size={20} className={isLiked ? "text-cyan" : "text-white"} fill={isLiked ? "var(--color-cyan)" : "none"} strokeWidth={1.5} />}
                label="83.4K"
                onClick={() => toggleLike(selectedDrama.id)}
              />
              <ActionBtn 
                icon={<Share2 size={20} className="text-white" strokeWidth={1.5} />}
                label="Share"
                onClick={() => {}}
              />
              <ActionBtn 
                icon={<ListVideo size={20} className="text-white" strokeWidth={1.5} />}
                label="Episodes"
                onClick={() => setShowEpisodeSelector(true)}
              />
              <ActionBtn 
                icon={isInList ? <Check size={20} className="text-cyan" /> : <Plus size={20} className="text-white" strokeWidth={1.5} />}
                label="Save"
                onClick={() => toggleMyList(selectedDrama.id)}
              />
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
              className="w-[56px] h-[56px] rounded-full bg-black/20 ring-1 ring-white/15 flex items-center justify-center backdrop-blur-md">
              {isPlaying ? <Pause size={24} className="text-white" fill="white" /> : <Play size={24} className="text-white ml-1" fill="white" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Double-tap hearts */}
      <DoubleTapHeart hearts={hearts} />

      {/* Subtitle — only renders when CC is on. The line keyed by cc+index so
          a language switch animates the new translation in. */}
      {isPlaying && subtitlesOn && (
        <motion.div
          key={`${cc}-${subtitleIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute z-20 text-center pointer-events-none ${variant === 'V2' ? 'bottom-[180px] left-4 right-4' : 'bottom-[200px] left-8 right-16'}`}
        >
          <span className="text-[14px] font-medium text-white drop-shadow-lg bg-black/30 px-3 py-1 rounded-lg">
            {subtitleTracks[cc]?.[subtitleIndex]}
          </span>
        </motion.div>
      )}

      {/* Seekbar */}
      <div className="absolute bottom-[8px] left-0 right-0 z-20">
        <Seekbar duration={15000} isPlaying={isPlaying} onComplete={handleSeekComplete} />
      </div>

      <EpisodeTransition />
      <PlayerSettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        audio={audio} onAudioChange={setAudio}
        quality={quality} onQualityChange={setQuality}
        speed={speed} onSpeedChange={setSpeed}
      />
      <FullPageAd
        ad={adStreak ? adStreak.ads[adStreak.index] : null}
        streakIndex={adStreak?.index ?? 0}
        streakCount={adStreak?.ads.length ?? 1}
        allowSkip={adStreak?.allowSkip ?? true}
        allowReplay={adStreak?.allowReplay ?? true}
        onSkip={advanceAdStreak}
        onAutoFinish={advanceAdStreak}
      />
    </div>
  );
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-[48px] h-[48px] rounded-full bg-white/5 ring-1 ring-white/20 flex items-center justify-center transition-colors group-active:bg-white/10">
        {icon}
      </div>
      <span className="text-[12px] text-white/90 font-medium">{label}</span>
    </button>
  );
}

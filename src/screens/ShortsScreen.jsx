import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { subtitleTracks } from '../data/dramas';
import { buildShortsPlaylist } from '../data/shortsPlaylist';
import ShortCaption from '../components/shorts/ShortCaption';
import ShortsActionColumn from '../components/shorts/ShortsActionColumn';
import MicroDramaTeaseActionColumn from '../components/shorts/MicroDramaTeaseActionColumn';
import ShortsSeekbar from '../components/shorts/ShortsSeekbar';
import PremiumChip from '../components/PremiumChip';
import PlayerSettingsSheet from '../components/PlayerSettingsSheet';
import { Play, ChevronRight, Settings, Captions, CaptionsOff } from 'lucide-react';

const CC_CYCLE = ['English', 'Bangla', 'Hindi', 'Off'];

const SWIPE_THRESHOLD = 90;
const SWIPE_VELOCITY = 600;

// Shorts tab feed. Vertical-swipe playlist mixing Short clips and Microdrama
// teases (every 3rd item). Bottom navbar stays mounted; this screen sits
// inside the regular shell — not a full-bleed player replacement.
export default function ShortsScreen() {
  const {
    setSelectedDrama, setCurrentEpisode,
    liked, toggleLike, myList, toggleMyList,
    setShowSubscribe, setShowDetail,
  } = useApp();

  const playlist = useMemo(() => buildShortsPlaylist({ teaseEvery: 3 }), []);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0–100 for ShortsSeekbar
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [localLiked, setLocalLiked] = useState({});
  const [localList, setLocalList] = useState({});
  const ticker = useRef(null);

  // Player settings — only used when the current item is a microdrama tease.
  const [cc, setCc] = useState('English');
  const [audio, setAudio] = useState('Bangla (Original)');
  const [quality, setQuality] = useState('Auto');
  const [speed, setSpeed] = useState('1x');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const subtitlesOn = cc !== 'Off';
  const cycleSubtitles = () => {
    const i = CC_CYCLE.indexOf(cc);
    setCc(CC_CYCLE[(i + 1) % CC_CYCLE.length]);
  };

  const item = playlist[index] ?? null;

  // Push the active microdrama into global selectedDrama so DramaSheet,
  // toggleLike, and toggleMyList stay context-aware on tease items.
  useEffect(() => {
    if (item?.kind === 'microdrama') {
      setSelectedDrama(item.drama);
      setCurrentEpisode(item.episode);
    }
  }, [item, setSelectedDrama, setCurrentEpisode]);

  // Mock playback progress — fills the seekbar over ~15s, loops.
  useEffect(() => {
    setProgress(0);
    if (!isPlaying) return;
    const start = Date.now();
    ticker.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = (elapsed / 15000) * 100;
      setProgress(pct >= 100 ? 0 : pct);
    }, 100);
    return () => clearInterval(ticker.current);
  }, [index, isPlaying]);

  // Subtitle ticker — only used on microdrama teases.
  useEffect(() => {
    if (item?.kind !== 'microdrama' || !isPlaying) return;
    const i = setInterval(() => {
      setSubtitleIndex((p) => (p + 1) % subtitleTracks.English.length);
    }, 3000);
    return () => clearInterval(i);
  }, [item, isPlaying]);

  const goNext = () => {
    if (index < playlist.length - 1) setIndex(index + 1);
  };
  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const onDragEnd = (_e, info) => {
    const dy = info.offset.y;
    const vy = info.velocity.y;
    if (dy < -SWIPE_THRESHOLD || vy < -SWIPE_VELOCITY) goNext();
    else if (dy > SWIPE_THRESHOLD || vy > SWIPE_VELOCITY) goPrev();
  };

  // Keyboard nav — ArrowUp = next, ArrowDown = previous.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      if (e.key === 'ArrowUp') goNext();
      else goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!item) return null;
  const isShort = item.kind === 'short';
  const drama = item.kind === 'microdrama' ? item.drama : null;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Top chrome — only on microdrama teases (CC toggle + Settings).
          Mirrors the in-player chrome so settings stay consistent. */}
      {!isShort && (
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-end gap-3 px-4 pt-[40px] pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
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
      )}

      {/* Card stack — full-bleed from y:0 down to the bottom navbar.
          The outer motion.div is the STABLE drag surface (its key never changes
          across playlist items, so framer-motion's drag state isn't reset on
          every advance). The inner AnimatePresence handles the slide-in /
          slide-out of the actual content per item. */}
      <motion.div
        className="absolute top-0 bottom-[90px] left-0 right-0 select-none"
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        onTap={() => setIsPlaying((p) => !p)}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
          >
            {/* Background creative */}
            <img
              src={isShort ? item.short.cover : drama.poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/45 pointer-events-none" />

            {/* Pause indicator — matches the microdrama player's circle button */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-[56px] h-[56px] rounded-full bg-black/20 ring-1 ring-white/15 flex items-center justify-center backdrop-blur-md">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right action column */}
            <div className="absolute right-3 bottom-[28px] z-20" onPointerDown={(e) => e.stopPropagation()}>
              {isShort ? (
                <ShortsActionColumn
                  short={item.short}
                  liked={localLiked[item.short.id]}
                  onToggleLike={(id) => setLocalLiked((s) => ({ ...s, [id]: !s[id] }))}
                  myList={localList}
                  onToggleMyList={(id) => setLocalList((s) => ({ ...s, [id]: !s[id] }))}
                />
              ) : (
                <MicroDramaTeaseActionColumn />
              )}
            </div>

            {/* Bottom-left caption / title block */}
            <div
              className="absolute left-4 bottom-[28px] right-[72px] z-10"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {isShort ? (
                <ShortCaption title={item.short.title} hashtags={item.short.hashtags} />
              ) : (
                <div>
                  <div className="mb-1.5">
                    {drama.isPremium && <PremiumChip onClick={() => setShowSubscribe(true)} />}
                  </div>
                  <button
                    onClick={() => setShowDetail(true)}
                    className="flex items-center gap-1 cursor-pointer mb-1"
                  >
                    <span className="text-[16px] font-bold text-white">{drama.title}</span>
                    <ChevronRight size={16} className="text-text-muted" />
                  </button>
                  <p className="text-[12px] text-text-muted">
                    EP.{item.episode} | {drama.totalEpisodes} Episodes
                  </p>
                </div>
              )}
            </div>

            {/* Subtitle ticker — microdrama teases only, gated on CC selection */}
            {!isShort && isPlaying && subtitlesOn && (
              <motion.div
                key={`${cc}-${subtitleIndex}-${drama.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute z-10 text-center pointer-events-none bottom-[150px] left-8 right-16"
              >
                <span className="text-[13px] font-medium text-white drop-shadow-lg bg-black/30 px-3 py-1 rounded-lg">
                  {subtitleTracks[cc]?.[subtitleIndex]}
                </span>
              </motion.div>
            )}

            {/* Pause-only seekbar */}
            {!isPlaying && <ShortsSeekbar progress={progress} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Player settings sheet — shared with the microdrama player */}
      <PlayerSettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        audio={audio} onAudioChange={setAudio}
        quality={quality} onQualityChange={setQuality}
        speed={speed} onSpeedChange={setSpeed}
      />
    </div>
  );
}

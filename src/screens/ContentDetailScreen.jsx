import { useState, useMemo, useEffect, useRef } from 'react';
import { ThumbsUp, Plus, Share2, ChevronDown, ChevronRight, Play, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import LongFormPlayer from '../components/LongFormPlayer';
import PaywallSheet from '../components/PaywallSheet';
import PlayerSettingsSheet from '../components/PlayerSettingsSheet';
import { packs } from '../data/packs';

export default function ContentDetailScreen() {
  const { 
    selectedDrama, 
    goBack, 
    subscription, 
    rentals,
    liked, toggleLike,
    myList, toggleMyList,
    setPaywallContext, SCREENS
  } = useApp();

  const [playing, setPlaying] = useState(true); // Auto-play if there's video
  const [paywallOrigin, setPaywallOrigin] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const [explicitMode, setExplicitMode] = useState(null);

  // Determine play mode based on FIXTURES.md §3
  const playState = useMemo(() => {
    if (!selectedDrama) return null;
    
    const isFree = !selectedDrama.isPaywalled;
    const isCoveredBySub = subscription && selectedDrama.packs.includes(subscription.packId);
    const isRented = rentals.includes(selectedDrama.id);
    const entitled = isFree || isCoveredBySub || isRented;

    if (explicitMode === 'trailer') {
      return { mode: 'trailer', src: '/video/trailer.mp4', endTime: null, origin: 'trailer-end', entitled };
    }
    
    if (entitled) {
      return { mode: 'content', src: '/video/feature.mp4', endTime: null, entitled };
    }
    
    if (selectedDrama.hasPreview) {
      // Preview cut at 40s (as per fixture docs)
      return { mode: 'preview', src: '/video/feature.mp4', endTime: 40, origin: 'preview-end', entitled };
    }
    
    if (selectedDrama.hasTrailer) {
      return { mode: 'trailer', src: '/video/trailer.mp4', endTime: null, origin: 'trailer-end', entitled };
    }
    
    // Nothing to play
    return { mode: 'none', entitled };
  }, [selectedDrama, subscription, rentals, explicitMode]);

  const hasShownTrailerPaywallRef = useRef(false);

  useEffect(() => {
    setExplicitMode(null);
    hasShownTrailerPaywallRef.current = false;
  }, [selectedDrama?.id]);

  const handleBoundaryReached = () => {
    if (playState.origin) {
      if (playState.origin === 'trailer-end') {
        if (!hasShownTrailerPaywallRef.current) {
          hasShownTrailerPaywallRef.current = true;
          setPaywallOrigin(playState.origin);
        }
      } else {
        setPaywallOrigin(playState.origin);
      }
    }
  };

  const handlePlayTap = () => {
    if (playState.mode === 'none') {
      setPaywallOrigin('locked-tap');
    } else {
      setPlaying(true);
    }
  };

  if (!selectedDrama) return null;

  const isLiked = liked[selectedDrama.id];
  const isInList = myList[selectedDrama.id];

  // Find recommended pack for this content
  const contentPacks = selectedDrama.packs ? packs.filter(p => selectedDrama.packs.includes(p.id)) : [];
  const recommendedPack = contentPacks.find(p => p.recommended) || contentPacks[0];

  // The round action button is the pinned player's transport. A title with a
  // preview shows Preview and keeps its trailer in the rail below; a title with
  // only a trailer shows Trailer here and gets no rail.
  const transportMode = selectedDrama.hasPreview ? 'preview' : selectedDrama.hasTrailer ? 'trailer' : null;
  const transportLive = transportMode !== null && playState.mode === transportMode && playing;
  const showTrailerRail = selectedDrama.hasPreview && selectedDrama.hasTrailer;

  const runTransport = () => {
    if (!transportMode) return;
    if (transportLive) {
      setPlaying(false);
      return;
    }
    setExplicitMode(transportMode === 'trailer' ? 'trailer' : null);
    setPlaying(true);
  };

  return (
    <div className="absolute inset-0 bg-dark flex flex-col overflow-hidden z-50 pt-[max(env(safe-area-inset-top),var(--spacing-topsafe))]">
      
      {/* Player Section (Pinned to top) */}
      <div className="w-full shrink-0 relative bg-black aspect-video flex items-center justify-center">
        {playState.mode === 'none' ? (
          <>
            <img src={selectedDrama.backdrop} className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
            
            {/* Nav back button for no-video state */}
            <button onClick={goBack} className="absolute top-[calc(env(safe-area-inset-top,1rem)+1rem)] left-4 z-20 cursor-pointer w-10 h-10 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <button 
              onClick={handlePlayTap}
              className="relative z-10 w-[64px] h-[64px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
            >
              <Play size={32} className="text-black ml-1" fill="currentColor" />
            </button>
          </>
        ) : (
          <LongFormPlayer 
            src={playState.src}
            title={selectedDrama.title}
            playing={playing}
            onPlayPause={setPlaying}
            onBack={goBack}
            onOpenSettings={() => setSettingsOpen(true)}
            endTime={playState.endTime}
            onBoundaryReached={handleBoundaryReached}
          />
        )}
      </div>

      {/* Detail Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-4 pt-5 pb-8">
          
          {/* Centered Meta Block */}
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-[28px] font-bold text-white leading-tight mb-2">
              {selectedDrama.title}
            </h1>
            
            <div className="flex items-center gap-1.5 mb-2">
              {selectedDrama.genres.map((g, i) => (
                <div key={g} className="flex items-center gap-1.5">
                  <span className="text-[13px] text-white/80 border-b border-white/40 pb-0.5 cursor-pointer hover:text-white">
                    {g}
                  </span>
                  {i < selectedDrama.genres.length - 1 && (
                    <span className="text-white/40 text-[10px]">•</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-[13px] text-white/80">{selectedDrama.duration}</span>
              <div className="flex items-center gap-1.5">
                {selectedDrama.badges.map(b => (
                  <span key={b} className="text-[11px] font-bold text-white/70 border border-white/20 rounded-[4px] px-1.5 py-0.5">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Area */}
          <div className="mb-6">
            {/* Primary Action (Play or Subscribe) */}
            {!playState.entitled && selectedDrama.isPaywalled && recommendedPack ? (
              <button 
                onClick={() => setPaywallContext({ origin: 'locked-tap', content: selectedDrama, initialPackId: recommendedPack.id })}
                className="w-full h-[48px] bg-[image:var(--gradient-subscribe)] rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <Crown size={20} className="text-black" />
                <span className="text-[16px] font-bold text-black">Subscribe</span>
              </button>
            ) : (
              <button 
                onClick={handlePlayTap}
                className="w-full h-[48px] bg-white rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <Play size={20} className="text-black" fill="currentColor" />
                <span className="text-[16px] font-bold text-black">
                  Play Now
                </span>
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between px-2 mb-8">
            <ActionBtn 
              icon={<ThumbsUp size={20} strokeWidth={1.5} className={isLiked ? "text-cyan" : "text-white"} fill={isLiked ? "var(--color-cyan)" : "none"} />} 
              label={selectedDrama.likes} 
              onClick={() => toggleLike(selectedDrama.id)} 
            />
            <ActionBtn 
              active={transportLive}
              disabled={!transportMode}
              icon={transportLive
                ? <CirclePauseIcon size={20} className="text-black" />
                : <CirclePlayIcon size={20} className="text-white" />}
              label={transportMode === 'trailer' ? 'Trailer' : 'Preview'}
              onClick={runTransport}
            />
            <ActionBtn 
              icon={<Plus size={20} strokeWidth={1.5} className={isInList ? "text-cyan" : "text-white"} />} 
              label="My List" 
              onClick={() => toggleMyList(selectedDrama.id)} 
            />
            <ActionBtn icon={<Share2 size={20} strokeWidth={1.5} className="text-white" />} label="Share" onClick={() => {}} />
          </div>

          {/* Synopsis Expander */}
          <div className="mb-8 border-t border-white/10 pt-4">
            <AnimatePresence initial={false}>
              {seeMore ? (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-[13px] text-white/80 leading-[20px] mb-3">
                    {selectedDrama.synopsis}
                  </p>
                  <p className="text-[13px] text-white/60 mb-1">
                    <span className="text-white/40">Cast: </span>{selectedDrama.cast}
                  </p>
                  <p className="text-[13px] text-white/60">
                    <span className="text-white/40">Director: </span>John Doe
                  </p>
                </motion.div>
              ) : (
                <p className="text-[13px] text-white/80 leading-[20px] line-clamp-2">
                  {selectedDrama.synopsis}
                </p>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setSeeMore(!seeMore)}
              className="flex items-center justify-center gap-1.5 w-full mt-3 py-1 cursor-pointer text-[14px] text-cyan font-medium"
            >
              See more <ChevronDown size={16} className={`transition-transform ${seeMore ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Trailers & Clips — only when the preview owns the round button */}
          {showTrailerRail && (
            <div className="mb-8">
              <h3 className="text-[18px] font-bold text-white mb-4">Trailers & Clips</h3>
              <div className="w-[160px]">
                <div className="relative w-full aspect-video rounded-[8px] overflow-hidden bg-white/5 ring-1 ring-white/10">
                  <img src={selectedDrama.backdrop} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CirclePlayIcon size={30} className="text-white" />
                  </div>
                </div>
                <span className="block text-[12px] font-medium text-white/90 mt-2 truncate">
                  {selectedDrama.title} Trailer
                </span>
              </div>
            </div>
          )}

          {/* More Like This */}
          <div>
            <h3 className="text-[18px] font-bold text-white mb-4">More like this</h3>
            <div className="grid grid-cols-3 gap-3">
              {selectedDrama.moreLikeThis.map(item => (
                <div key={item.id} className="flex flex-col gap-2 cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-[8px] overflow-hidden bg-white/5">
                    <img src={item.poster} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <span className="text-[12px] font-medium text-white/90 text-center truncate px-1">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      <PaywallSheet 
        origin={paywallOrigin} 
        content={selectedDrama}
        onClose={() => {
          // Rule 2 of M1c: dismissing after a completed trailer or preview must
          // return to the detail page. Leaving the player mounted parks the user
          // on a dead final frame with nothing to do.
          setPaywallOrigin(null);
          setExplicitMode(null);
        }}
      />

      {/* Standard Settings Sheet (dummy state functions for demo) */}
      <PlayerSettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        audio="Bangla (Original)" onAudioChange={() => {}}
        quality="Auto" onQualityChange={() => {}}
        speed="1x" onSpeedChange={() => {}}
      />

    </div>
  );
}

// Transport mark — a play glyph inside the ring at rest, a pause glyph inside
// the same ring while the clip runs. Strokes use currentColor so the icon flips
// to black when the button inverts to white.
function CirclePlayIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M11.97 22C17.4928 22 21.97 17.5228 21.97 12C21.97 6.47715 17.4928 2 11.97 2C6.44712 2 1.96997 6.47715 1.96997 12C1.96997 17.5228 6.44712 22 11.97 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.73999 12.2296V10.5596C8.73999 8.47964 10.21 7.62964 12.01 8.66964L13.46 9.50964L14.91 10.3496C16.71 11.3896 16.71 13.0896 14.91 14.1296L13.46 14.9696L12.01 15.8096C10.21 16.8496 8.73999 15.9996 8.73999 13.9196V12.2296Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CirclePauseIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M11.97 2C6.44997 2 1.96997 6.48 1.96997 12C1.96997 17.52 6.44997 22 11.97 22C17.49 22 21.97 17.52 21.97 12C21.97 6.48 17.5 2 11.97 2ZM10.72 15.03C10.72 15.51 10.52 15.7 10.01 15.7H8.70997C8.19997 15.7 7.99997 15.51 7.99997 15.03V8.97C7.99997 8.49 8.19997 8.3 8.70997 8.3H9.99997C10.51 8.3 10.71 8.49 10.71 8.97V15.03H10.72ZM16 15.03C16 15.51 15.8 15.7 15.29 15.7H14C13.49 15.7 13.29 15.51 13.29 15.03V8.97C13.29 8.49 13.49 8.3 14 8.3H15.29C15.8 8.3 16 8.49 16 8.97V15.03Z" fill="currentColor" />
    </svg>
  );
}

function ActionBtn({ icon, label, onClick, active = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-2 group ${disabled ? 'cursor-default opacity-40' : 'cursor-pointer'}`}
    >
      <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-colors ${
        active
          ? 'bg-white ring-1 ring-white group-active:bg-white/85'
          : disabled
            ? 'bg-white/5 ring-1 ring-white/10'
            : 'bg-white/5 ring-1 ring-white/20 group-active:bg-white/10'
      }`}>
        {icon}
      </div>
      <span className="text-[12px] text-white/90 font-medium">{label}</span>
    </button>
  );
}

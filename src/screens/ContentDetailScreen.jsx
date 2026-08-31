import { useState, useMemo, useEffect, useRef } from 'react';
import { ThumbsUp, Film, Plus, Share2, Download, ChevronDown, ChevronRight, Play, Crown } from 'lucide-react';
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

  return (
    <div className="absolute inset-0 bg-dark flex flex-col overflow-hidden z-50">
      
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
              className="relative z-10 w-[64px] h-[64px] rounded-full bg-cyan flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,187,255,0.4)]"
            >
              <Play size={32} className="text-dark ml-1" fill="currentColor" />
            </button>
          </>
        ) : (
          <LongFormPlayer 
            src={playState.src}
            poster={selectedDrama.backdrop}
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
          <div className="mb-6 space-y-3">
            {/* Primary Action (Play or Subscribe) */}
            {!playState.entitled && selectedDrama.isPaywalled && recommendedPack ? (
              <>
                <button 
                  onClick={() => setPaywallContext({ origin: 'locked-tap', content: selectedDrama, initialPackId: recommendedPack.id })}
                  className="w-full h-[48px] bg-[image:var(--gradient-subscribe)] rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <Crown size={20} className="text-black" />
                  <span className="text-[16px] font-bold text-black">Subscribe</span>
                </button>
                {/* Simulated Rent Button based on mock */}
                <button
                  className="w-full h-[48px] bg-white rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <span className="text-[16px] font-bold text-black">Rent for TK 99</span>
                </button>
              </>
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

            {/* Secondary Action (Free Preview or Rent) */}
            {!playState.entitled && selectedDrama.hasPreview && (
              <button 
                onClick={handlePlayTap}
                className="w-full h-[48px] bg-white rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <span className="text-[16px] font-bold text-black">
                  Watch Free Preview
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
              icon={<Film size={20} strokeWidth={1.5} className="text-white" />} 
              label="Trailer" 
              onClick={() => {
                setExplicitMode('trailer');
                setPlaying(true);
              }} 
            />
            <ActionBtn 
              icon={<Plus size={20} strokeWidth={1.5} className={isInList ? "text-cyan" : "text-white"} />} 
              label="My List" 
              onClick={() => toggleMyList(selectedDrama.id)} 
            />
            <ActionBtn icon={<Share2 size={20} strokeWidth={1.5} className="text-white" />} label="Share" onClick={() => {}} />
            <ActionBtn icon={<Download size={20} strokeWidth={1.5} className="text-white" />} label="Download" onClick={() => {}} />
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

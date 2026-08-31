import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import EpisodeGridV2 from './episode/EpisodeGridV2';

// Brand teal accent — matches the See more / Playing badge tokens.
const ACCENT = '#46ffff';

// Snap translateY values (% of sheet height). Sheet is a full-height container
// pushed down from the top — higher value = more of it tucked below the viewport.
//   HALF     → ~70% visible (default rest)
//   EXPANDED → ~80% visible (capped; reached by scrolling inside Episodes)
const HALF = 30;
const EXPANDED = 20;
// Drag thresholds (px)
const CLOSE_THRESHOLD = 140;       // drag down past this from HALF → close
const EXPAND_THRESHOLD = 40;       // drag up past this from HALF → EXPANDED
const COLLAPSE_THRESHOLD = 40;     // drag down past this from EXPANDED → HALF

// Build the structured "label: value" rows used in the Details tab. Mirrors the
// production Bioscope detail layout — missing fields collapse rather than show empty.
function buildDetailRows(drama) {
  const castNames = (drama.cast ?? []).map((c) => c.name);
  return [
    { label: 'Genres',            values: drama.genres ?? [],                                                   linked: true },
    { label: 'Content-providers', values: [drama.contentProvider ?? 'Hoichoi'],                                 linked: true },
    { label: 'Directors',         values: drama.directors ?? ['Mainak Bhaumik'],                                linked: true },
    { label: 'Casts',             values: castNames,                                                            linked: true },
    { label: 'Producers',         values: drama.producers ?? ['Nandy Movies'],                                  linked: true },
    { label: 'Runtime',           values: [drama.runtime ?? (drama.totalEpisodes ? `${drama.totalEpisodes * 2} min total` : '2hr')] },
    { label: 'Release Date',      values: [drama.releaseDate ?? '2025-01-01'] },
    { label: 'Maturity Rating',   values: [drama.maturityRating ?? (drama.isPremium ? 'Adults Only' : '13+')] },
  ].filter((r) => r.values.length > 0);
}

function DetailRow({ label, values, linked }) {
  return (
    <div className="flex gap-2 mb-3">
      <span className="text-[12px] text-text-muted shrink-0">{label}:</span>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {values.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className={`text-[12px] text-white ${linked ? 'underline underline-offset-2 decoration-white/40' : ''}`}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

function DetailsTab({ drama, onPlay, userState, onSelectDrama }) {
  const [expanded, setExpanded] = useState(true);
  const rows = useMemo(() => buildDetailRows(drama), [drama]);
  const moreLikeThis = useMemo(() => dramas.filter((d) => d.id !== drama.id).slice(0, 5), [drama.id]);

  return (
    <div className="px-5 pt-1 pb-8">
      {/* Synopsis paragraph — clamped to 3 lines when collapsed */}
      <p className={`text-[12px] text-white leading-[18px] mb-4 ${expanded ? '' : 'line-clamp-3'}`}>
        {drama.synopsis}
      </p>

      {expanded && rows.map((r) => (
        <DetailRow key={r.label} label={r.label} values={r.values} linked={r.linked} />
      ))}

      <div className="mb-5">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1 cursor-pointer mt-1"
        >
          <span className="text-[13px] font-semibold" style={{ color: ACCENT }}>
            {expanded ? 'See less' : 'See more'}
          </span>
          {expanded
            ? <ChevronUp size={14} style={{ color: ACCENT }} />
            : <ChevronDown size={14} style={{ color: ACCENT }} />}
        </button>
      </div>

      <button
        onClick={onPlay}
        className="w-full h-[44px] bg-white rounded-[8px] flex items-center justify-center gap-2 cursor-pointer"
      >
        <Play size={14} className="text-[#2a2a2a]" fill="#2A2A2A" />
        <span className="text-[14px] font-semibold text-[#2a2a2a]">
          {userState === 'returning' ? `Continue EP.${drama.currentEpisode || 1}` : 'Play EP.1'}
        </span>
      </button>

      <div className="flex gap-3 overflow-x-auto no-scrollbar mt-5">
        {moreLikeThis.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelectDrama?.(d)}
            className="flex-shrink-0 w-[90px] text-left cursor-pointer"
          >
            <div className="w-[90px] h-[127px] rounded-[6px] overflow-hidden bg-card">
              <img src={d.poster} alt={d.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-[9px] text-text-secondary mt-1 truncate">{d.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Combined Details + Episodes sheet. Replaces the legacy DetailSheet and
// EpisodeSelector. Half-sheet by default; auto-expands to full-screen when
// the user opens Episodes or drags up.
export default function DramaSheet() {
  const {
    selectedDrama, currentEpisode, playEpisode, userState, selectDrama,
    progressByDrama, setShowSubscribe,
    showDetail, showEpisodeSelector, setShowDetail, setShowEpisodeSelector,
  } = useApp();

  // Sheet is open if either trigger is on; tab follows whichever was set.
  const open = showDetail || showEpisodeSelector;
  const initialTab = showEpisodeSelector ? 'episodes' : 'details';
  const [tab, setTab] = useState(initialTab);
  // Snap state — 'half' or 'expanded'. Default is 'half' on both tabs.
  const [snap, setSnap] = useState('half');
  const controls = useAnimation();
  const scrollRef = useRef(null);

  const snapTo = (next) => {
    setSnap(next);
    controls.start({
      y: `${next === 'expanded' ? EXPANDED : HALF}%`,
      transition: { type: 'spring', damping: 32, stiffness: 320 },
    });
  };

  // On open / reopen, reset the tab and snap-state from the trigger source.
  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setSnap('half');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Whenever the snap state OR open state changes, animate to the right Y.
  useEffect(() => {
    if (!open) return;
    controls.start({
      y: `${snap === 'expanded' ? EXPANDED : HALF}%`,
      transition: { type: 'spring', damping: 32, stiffness: 320 },
    });
  }, [snap, open, controls]);

  // Switching tabs resets to half + scrolls content back to top, so the new
  // tab doesn't inherit a half-scrolled state from the previous one.
  const onChangeTab = (next) => {
    setTab(next);
    setSnap('half');
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  // When content is scrolled (Episodes tab) while sheet is at half, expand it.
  const onContentScroll = () => {
    if (snap === 'half' && scrollRef.current && scrollRef.current.scrollTop > 0) {
      snapTo('expanded');
    }
  };

  const close = () => {
    setShowDetail(false);
    setShowEpisodeSelector(false);
  };

  const onPlay = () => {
    if (!selectedDrama) return;
    playEpisode(userState === 'returning' ? (selectedDrama.currentEpisode || 1) : 1);
  };

  const onSelectEp = (ep) => playEpisode(ep);
  const onSelectDrama = (d) => { selectDrama(d); setTab('details'); };

  // Drag-end snap rules:
  //   from HALF    : drag down past threshold → close; drag up → expanded
  //   from EXPANDED: drag down past threshold → half; further drag down → close
  // Velocity acts as an accelerator for the same transitions.
  const onDragEnd = (_e, info) => {
    const dy = info.offset.y;
    const vy = info.velocity.y;
    const flickDown = vy > 700;
    const flickUp = vy < -500;

    if (snap === 'half') {
      if (dy > CLOSE_THRESHOLD || flickDown) { close(); return; }
      if (dy < -EXPAND_THRESHOLD || flickUp) { snapTo('expanded'); return; }
      snapTo('half'); // rest back
      return;
    }
    // snap === 'expanded'
    if (dy > CLOSE_THRESHOLD * 1.6) { close(); return; }
    if (dy > COLLAPSE_THRESHOLD || flickDown) { snapTo('half'); return; }
    snapTo('expanded'); // rest back
  };

  if (!selectedDrama) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drama-sheet-root"
          className="absolute inset-0 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Scrim */}
          <div className="absolute inset-0 bg-black/55" onClick={close} />

          {/* Sheet — full-height container; visible portion controlled via translateY */}
          <motion.div
            className="absolute inset-x-0 bottom-0 top-0 bg-card rounded-t-[16px] overflow-hidden flex flex-col"
            initial={{ y: '100%' }}
            animate={controls}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.4 }}
            onDragEnd={onDragEnd}
          >
            {/* ===== Sticky header — handle + drama header + tabs ===== */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-[40px] h-[4px] bg-text-dim rounded-full" />
              </div>

              <div className="px-5">
                <div className="flex items-center gap-3 mb-3">
                  <img src={selectedDrama.poster} alt="" className="w-[40px] h-[56px] rounded-[4px] object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold text-white truncate">{selectedDrama.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[9px] font-bold text-white px-[6px] py-[2px] rounded-[3px] ${
                          selectedDrama.status === 'Completed' ? 'bg-badge-completed'
                          : selectedDrama.status === 'New' ? 'bg-accent'
                          : 'bg-badge-ongoing'
                        }`}
                      >
                        {selectedDrama.status}
                      </span>
                      <span className="text-[11px] text-text-muted">{selectedDrama.totalEpisodes} EP · {selectedDrama.views} Views</span>
                    </div>
                  </div>
                  <button
                    onClick={close}
                    className="w-[28px] h-[28px] rounded-full bg-white/10 flex items-center justify-center cursor-pointer flex-shrink-0"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Tab row — underline-style indicator */}
              <div className="flex px-5 border-b border-white/10 mt-1">
                {['details', 'episodes'].map((t) => {
                  const active = tab === t;
                  return (
                    <button
                      key={t}
                      onClick={() => onChangeTab(t)}
                      className="relative px-3 py-2.5 cursor-pointer"
                    >
                      <span className={`text-[13px] capitalize ${active ? 'text-white font-semibold' : 'text-text-muted font-medium'}`}>
                        {t}
                      </span>
                      {active && (
                        <motion.div
                          layoutId="dramaSheetTabUnderline"
                          className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-white"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===== Scrollable content area ===== */}
            <div
              ref={scrollRef}
              onScroll={onContentScroll}
              className="flex-1 overflow-y-auto no-scrollbar overscroll-contain"
            >
              {tab === 'details' ? (
                <DetailsTab
                  drama={selectedDrama}
                  onPlay={onPlay}
                  userState={userState}
                  onSelectDrama={onSelectDrama}
                />
              ) : (
                <EpisodeGridV2
                  drama={selectedDrama}
                  currentEpisode={currentEpisode}
                  progressByDrama={progressByDrama}
                  onSelect={onSelectEp}
                  onLockedTap={() => { close(); setShowSubscribe(true); }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import { X, ChevronRight, ChevronDown, ChevronUp, Play, Eye, Clock } from 'lucide-react';

// Bioscope app uses a teal accent for the See more / See less toggle.
const ACCENT = '#46ffff';

// Build the structured detail rows shown when the synopsis is expanded.
// Genres + Casts come from the drama record; the rest are placeholders so the
// prototype mirrors the production layout 1:1 across every drama.
function buildDetailRows(drama) {
  const castNames = (drama.cast ?? []).map((c) => c.name);
  return [
    { label: 'Genres', values: drama.genres ?? [], linked: true },
    { label: 'Content-providers', values: [drama.contentProvider ?? 'Hoichoi'], linked: true },
    { label: 'Directors', values: drama.directors ?? ['Mainak Bhaumik'], linked: true },
    { label: 'Casts', values: castNames, linked: true },
    { label: 'Producers', values: drama.producers ?? ['Nandy Movies'], linked: true },
    { label: 'Runtime', values: [drama.runtime ?? `${drama.totalEpisodes ? drama.totalEpisodes * 2 + ' min total' : '2hr'}`] },
    { label: 'Release Date', values: [drama.releaseDate ?? '2025-01-01'] },
    { label: 'Maturity Rating', values: [drama.maturityRating ?? (drama.isPremium ? 'Adults Only' : '13+')] },
  ].filter((row) => row.values.length > 0);
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

function SynopsisBlock({ drama }) {
  const [expanded, setExpanded] = useState(true);
  const rows = useMemo(() => buildDetailRows(drama), [drama]);

  return (
    <div className="mb-5">
      {expanded && (
        <>
          <p className="text-[12px] text-white leading-[18px] mb-4">{drama.synopsis}</p>
          {rows.map((r) => (
            <DetailRow key={r.label} label={r.label} values={r.values} linked={r.linked} />
          ))}
        </>
      )}
      <div className="flex justify-center">
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
    </div>
  );
}

function EpisodeGrid({ drama, currentEpisode, onSelect }) {
  const [activeRange, setActiveRange] = useState(0);

  const ranges = useMemo(() => {
    const r = [];
    for (let i = 0; i < drama.totalEpisodes; i += 30) {
      r.push({ label: `${i + 1}-${Math.min(i + 30, drama.totalEpisodes)}`, start: i + 1, end: Math.min(i + 30, drama.totalEpisodes) });
    }
    return r;
  }, [drama.totalEpisodes]);

  const episodes = useMemo(() => {
    if (!ranges.length) return [];
    const { start, end } = ranges[Math.min(activeRange, ranges.length - 1)];
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [ranges, activeRange]);

  return (
    <div>
      <div className="flex gap-5 mb-4">
        {ranges.map((r, i) => (
          <button key={r.label} onClick={() => setActiveRange(i)}
            className={`text-[13px] cursor-pointer ${i === activeRange ? 'font-bold text-white' : 'text-text-muted'}`}>
            {r.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {episodes.map((ep) => {
          const isCurrent = ep === currentEpisode;
          const isWatched = drama.watchedEpisodes?.includes(ep);
          return (
            <button key={ep} onClick={() => onSelect(ep)}
              className={`h-[44px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors
                ${isCurrent ? 'bg-accent text-white font-bold' : isWatched ? 'bg-[#2d3136] text-text-secondary' : 'bg-[#242628] text-text-dim'}`}>
              {isCurrent ? (
                <div className="flex items-end gap-[2px]">
                  <span className="text-[14px] font-bold mr-1">{ep}</span>
                  <div className="w-[2px] bg-white rounded-full eq-bar-1" />
                  <div className="w-[2px] bg-white rounded-full eq-bar-2" />
                  <div className="w-[2px] bg-white rounded-full eq-bar-3" />
                </div>
              ) : <span className="text-[14px]">{ep}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SynopsisContent({ drama, moreLikeThis, onPlay, userState, onSelectDrama }) {
  return (
    <div>
      <SynopsisBlock drama={drama} />
      <button onClick={onPlay}
        className="w-full h-[44px] bg-accent rounded-[8px] flex items-center justify-center gap-2 cursor-pointer">
        <Play size={14} className="text-white" fill="white" />
        <span className="text-[14px] font-semibold text-white">
          {userState === 'returning' ? `Continue EP.${drama.currentEpisode || 1}` : 'Play EP.1'}
        </span>
      </button>
      <div className="flex gap-3 overflow-x-auto no-scrollbar mt-5">
        {moreLikeThis.map((d) => (
          <button key={d.id} onClick={() => onSelectDrama?.(d)} className="flex-shrink-0 w-[90px] text-left cursor-pointer">
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

// ===== V1: Standard half-sheet =====
function DetailV1({ drama, moreLikeThis, onClose, onPlay, userState, onSelectDrama }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-sheet rounded-t-[16px] max-h-[75%] overflow-y-auto no-scrollbar"
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-[40px] h-[4px] bg-text-dim rounded-full" />
      </div>
      <div className="px-5 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <img src={drama.poster} alt="" className="w-[44px] h-[62px] rounded-[4px] object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold text-white truncate">{drama.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-bold text-white px-[6px] py-[2px] rounded-[3px] ${drama.status === 'Completed' ? 'bg-badge-completed' : drama.status === 'New' ? 'bg-badge-new' : 'bg-badge-ongoing'}`}>{drama.status}</span>
              <span className="text-[11px] text-text-muted">{drama.views} Views</span>
            </div>
          </div>
          <button onClick={onClose} className="w-[28px] h-[28px] rounded-full bg-white/10 flex items-center justify-center cursor-pointer flex-shrink-0">
            <X size={14} className="text-white" />
          </button>
        </div>
        <SynopsisContent drama={drama} moreLikeThis={moreLikeThis} onPlay={onPlay} userState={userState} onSelectDrama={onSelectDrama} />
      </div>
    </motion.div>
  );
}

// ===== V2: Full sheet with blurred poster hero =====
function DetailV2({ drama, moreLikeThis, onClose, onPlay, userState, onSelectDrama }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-sheet rounded-t-[16px] max-h-[90%] overflow-y-auto no-scrollbar"
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

      {/* Hero poster with blur */}
      <div className="relative w-full h-[180px] overflow-hidden rounded-t-[16px]">
        <img src={drama.poster} alt="" className="w-full h-full object-cover scale-110 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-sheet" />
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-4 w-[30px] h-[30px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer z-10">
          <X size={14} className="text-white" />
        </button>
        {/* Centered poster */}
        <div className="absolute bottom-[-30px] left-5 flex items-end gap-3 z-10">
          <img src={drama.poster} alt="" className="w-[60px] h-[84px] rounded-[6px] object-cover shadow-xl border-2 border-sheet" />
          <div className="pb-1">
            <h3 className="text-[16px] font-bold text-white drop-shadow-lg">{drama.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] font-bold text-white px-[6px] py-[2px] rounded-[3px] ${drama.status === 'Completed' ? 'bg-badge-completed' : drama.status === 'New' ? 'bg-badge-new' : 'bg-badge-ongoing'}`}>{drama.status}</span>
              <span className="text-[10px] text-text-secondary flex items-center gap-1"><Eye size={10} />{drama.views}</span>
              <span className="text-[10px] text-text-secondary flex items-center gap-1"><Clock size={10} />{drama.totalEpisodes} EP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-10 pb-6">
        <SynopsisContent drama={drama} moreLikeThis={moreLikeThis} onPlay={onPlay} userState={userState} onSelectDrama={onSelectDrama} />
      </div>
    </motion.div>
  );
}

// ===== V3: Card stack with stacked sections =====
function DetailV3({ drama, moreLikeThis, onClose, onPlay, userState, onSelectDrama }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 max-h-[85%] overflow-y-auto no-scrollbar"
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

      {/* Close pill */}
      <div className="flex justify-center mb-2">
        <button onClick={onClose} className="flex items-center gap-1.5 bg-[#2a2d36] rounded-full px-3 py-1.5 cursor-pointer">
          <X size={12} className="text-text-secondary" />
          <span className="text-[11px] text-text-secondary">Close</span>
        </button>
      </div>

      {/* Card 1: Header info */}
      <div className="bg-sheet mx-2 rounded-[14px] p-4 mb-2">
        <div className="flex items-center gap-3">
          <img src={drama.poster} alt="" className="w-[50px] h-[70px] rounded-[6px] object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-white">{drama.title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[9px] font-bold text-white px-[6px] py-[2px] rounded-[3px] ${drama.status === 'Completed' ? 'bg-badge-completed' : drama.status === 'New' ? 'bg-badge-new' : 'bg-badge-ongoing'}`}>{drama.status}</span>
              {drama.genres.map(g => (
                <span key={g} className="text-[10px] text-text-muted">{g}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-text-dim flex items-center gap-1"><Eye size={10} />{drama.views}</span>
              <span className="text-[10px] text-text-dim">{drama.totalEpisodes} Episodes</span>
            </div>
          </div>
        </div>
        {/* Play CTA */}
        <button onClick={onPlay}
          className="w-full h-[40px] bg-accent rounded-[8px] flex items-center justify-center gap-2 cursor-pointer mt-3">
          <Play size={13} className="text-white" fill="white" />
          <span className="text-[13px] font-semibold text-white">
            {userState === 'returning' ? `Continue EP.${drama.currentEpisode || 1}` : 'Play EP.1'}
          </span>
        </button>
      </div>

      {/* Card 2: Synopsis + cast */}
      <div className="bg-sheet mx-2 rounded-[14px] p-4 mb-2">
        <p className="text-[12px] text-text-secondary leading-[18px]">{drama.synopsis}</p>
        <div className="flex gap-4 mt-4">
          {drama.cast.map((c) => (
            <div key={c.name} className="flex items-center gap-2">
              <div className="w-[24px] h-[24px] rounded-full bg-[#3a3a40]" />
              <div>
                <p className="text-[11px] font-medium text-white">{c.name}</p>
                <p className="text-[9px] text-text-muted">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: More Like This */}
      <div className="bg-sheet mx-2 rounded-[14px] p-4 mb-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {moreLikeThis.map((d) => (
            <button key={d.id} onClick={() => onSelectDrama?.(d)} className="flex-shrink-0 w-[80px] text-left cursor-pointer">
              <div className="w-[80px] h-[113px] rounded-[6px] overflow-hidden bg-card">
                <img src={d.poster} alt={d.title} className="w-full h-full object-cover" />
              </div>
              <p className="text-[9px] text-text-secondary mt-1 truncate">{d.title}</p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function DetailSheet() {
  const { selectedDrama, setShowDetail, playEpisode, userState, variants, selectDrama } = useApp();

  if (!selectedDrama) return null;

  const moreLikeThis = dramas.filter(d => d.id !== selectedDrama.id).slice(0, 5);
  const variant = variants.detail;

  const onPlay = () => playEpisode(userState === 'returning' ? (selectedDrama.currentEpisode || 1) : 1);
  const onClose = () => setShowDetail(false);
  const onSelectDrama = (d) => { selectDrama(d); };

  const sharedProps = {
    drama: selectedDrama, moreLikeThis,
    onClose, onPlay, userState, onSelectDrama,
  };

  return (
    <AnimatePresence>
      <motion.div className="absolute inset-0 z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        {variant === 'V1' && <DetailV1 {...sharedProps} />}
        {variant === 'V2' && <DetailV2 {...sharedProps} />}
        {variant === 'V3' && <DetailV3 {...sharedProps} />}
      </motion.div>
    </AnimatePresence>
  );
}

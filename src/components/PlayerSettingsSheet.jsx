import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Captions, Globe2, Gauge } from 'lucide-react';

const CC_OPTIONS = ['Off', 'English', 'Bangla', 'Hindi'];
const AUDIO_OPTIONS = ['Bangla (Original)', 'English (Dubbed)', 'Hindi (Dubbed)'];
const QUALITY_OPTIONS = ['Auto', '1080p', '720p', '480p', '360p'];

function Row({ icon: Icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer text-left"
    >
      <Icon size={18} className="text-white/70 shrink-0" />
      <span className="flex-1 text-[14px] font-medium text-white">{label}</span>
      <span className="text-[12px] text-text-muted">{value}</span>
      <span className="text-white/40 text-[18px] leading-none">›</span>
    </button>
  );
}

function Picker({ title, options, value, onPick, onBack }) {
  return (
    <div>
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
        <button onClick={onBack} className="text-white/70 cursor-pointer text-[18px] leading-none">‹</button>
        <span className="text-[14px] font-semibold text-white">{title}</span>
      </div>
      <div className="py-1">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => { onPick(opt); onBack(); }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="flex-1 text-left text-[13px] text-white">{opt}</span>
              {active && <Check size={15} className="text-amber-300" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PlayerSettingsSheet({ open, onClose }) {
  const [cc, setCc] = useState('Off');
  const [audio, setAudio] = useState('Bangla (Original)');
  const [quality, setQuality] = useState('Auto');
  const [view, setView] = useState('root'); // 'root' | 'cc' | 'audio' | 'quality'

  function close() {
    setView('root');
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={close} />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-[#1a1b1f] rounded-t-[16px] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-[40px] h-[4px] bg-white/20 rounded-full" />
            </div>

            {view === 'root' && (
              <>
                <div className="flex items-center justify-between px-5 py-2">
                  <span className="text-[15px] font-bold text-white">Player settings</span>
                  <button onClick={close} className="w-[28px] h-[28px] rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                    <X size={14} className="text-white" />
                  </button>
                </div>
                <div className="py-1 pb-4">
                  <Row icon={Captions} label="Subtitles / CC" value={cc} onClick={() => setView('cc')} />
                  <Row icon={Globe2} label="Audio" value={audio} onClick={() => setView('audio')} />
                  <Row icon={Gauge} label="Video quality" value={quality} onClick={() => setView('quality')} />
                </div>
              </>
            )}

            {view === 'cc' && <Picker title="Subtitles / CC" options={CC_OPTIONS} value={cc} onPick={setCc} onBack={() => setView('root')} />}
            {view === 'audio' && <Picker title="Audio" options={AUDIO_OPTIONS} value={audio} onPick={setAudio} onBack={() => setView('root')} />}
            {view === 'quality' && <Picker title="Video quality" options={QUALITY_OPTIONS} value={quality} onPick={setQuality} onBack={() => setView('root')} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

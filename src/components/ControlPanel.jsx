import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, SCREENS } from '../contexts/AppContext';
import { dramas } from '../data/dramas';
import { Settings, X } from 'lucide-react';

const screenButtons = [
  { label: 'Home', screen: SCREENS.HOME },
  { label: 'Browse', screen: SCREENS.BROWSE },
  { label: 'Player', screen: SCREENS.PLAYER },
];

const variantSections = [
  { key: 'browse', label: 'Browse Layout', options: ['V1', 'V2', 'V3'], descriptions: ['Grid', 'Featured', 'List'] },
  { key: 'detail', label: 'Detail Sheet', options: ['V1', 'V2', 'V3'], descriptions: ['Standard', 'Full', 'Cards'] },
  { key: 'player', label: 'Player Style', options: ['V1', 'V2', 'V3'], descriptions: ['TikTok', 'YT Shorts', 'Minimal'] },
  { key: 'episodeSelector', label: 'Episode Selector', options: ['V1', 'V2', 'V3'], descriptions: ['Grid', 'Dots', 'Thumbs'] },
];

export default function ControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    screen, setScreen,
    selectedDrama, setSelectedDrama,
    currentEpisode, setCurrentEpisode,
    setIsPlaying, setShowDetail, setShowEpisodeSelector, setShowTransition,
    variants, setVariant,
    userState, setUserState,
  } = useApp();

  const jumpToScreen = (s) => {
    if (s === SCREENS.PLAYER && !selectedDrama) {
      setSelectedDrama(dramas[0]);
    }
    setShowDetail(false);
    setShowEpisodeSelector(false);
    setShowTransition(false);
    setScreen(s);
  };

  return (
    <>
      {/* Floating toggle button — outside phone frame */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-[9999] w-[44px] h-[44px] rounded-full bg-accent shadow-lg flex items-center justify-center cursor-pointer hover:bg-accent-light transition-colors"
      >
        {isOpen ? <X size={20} className="text-white" /> : <Settings size={20} className="text-white" />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-5 z-[9998] w-[280px] max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar bg-[#1e2028] border border-[#2e3038] rounded-xl shadow-2xl"
          >
            <div className="p-4">
              <h3 className="text-[14px] font-bold text-white mb-4">Demo Control Panel</h3>

              {/* Screen Navigation */}
              <div className="mb-5">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Navigate</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {screenButtons.map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => jumpToScreen(btn.screen)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                        screen === btn.screen
                          ? 'bg-accent text-white'
                          : 'bg-[#2a2d36] text-text-secondary hover:bg-[#33363f]'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => { if (!selectedDrama) setSelectedDrama(dramas[0]); setShowDetail(true); }}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer bg-[#2a2d36] text-text-secondary hover:bg-[#33363f]"
                  >
                    Detail Sheet
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedDrama) setSelectedDrama(dramas[0]);
                      if (screen !== SCREENS.PLAYER) setScreen(SCREENS.PLAYER);
                      setShowEpisodeSelector(true);
                    }}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer bg-[#2a2d36] text-text-secondary hover:bg-[#33363f]"
                  >
                    Episode Selector
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedDrama) setSelectedDrama(dramas[0]);
                      if (screen !== SCREENS.PLAYER) setScreen(SCREENS.PLAYER);
                      setShowTransition(true);
                    }}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer bg-[#2a2d36] text-text-secondary hover:bg-[#33363f]"
                  >
                    Transition
                  </button>
                </div>
              </div>

              {/* Variant Sections */}
              {variantSections.map((sec) => (
                <div key={sec.key} className="mb-4">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">{sec.label}</span>
                  <div className="flex gap-1.5 mt-2">
                    {sec.options.map((opt, i) => (
                      <button
                        key={opt}
                        onClick={() => setVariant(sec.key, opt)}
                        className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-medium cursor-pointer transition-colors ${
                          variants[sec.key] === opt
                            ? 'bg-accent text-white'
                            : 'bg-[#2a2d36] text-text-secondary hover:bg-[#33363f]'
                        }`}
                      >
                        {sec.descriptions[i]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="h-px bg-border my-3" />

              {/* State Controls */}
              <div className="mb-4">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Drama</span>
                <select
                  value={selectedDrama?.id || ''}
                  onChange={(e) => {
                    const d = dramas.find(d => d.id === Number(e.target.value));
                    if (d) setSelectedDrama(d);
                  }}
                  className="mt-2 w-full bg-[#2a2d36] text-text-secondary text-[11px] rounded-md px-2 py-1.5 border-none outline-none"
                >
                  <option value="">Select drama...</option>
                  {dramas.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Episode: {currentEpisode}</span>
                <input
                  type="range"
                  min={1}
                  max={selectedDrama?.totalEpisodes || 73}
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                  className="mt-2 w-full accent-accent"
                />
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">User State</span>
                <div className="flex gap-2 mt-2">
                  {['new', 'returning'].map((state) => (
                    <button
                      key={state}
                      onClick={() => setUserState(state)}
                      className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium cursor-pointer capitalize transition-colors ${
                        userState === state
                          ? 'bg-accent text-white'
                          : 'bg-[#2a2d36] text-text-secondary hover:bg-[#33363f]'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { createContext, useContext, useState } from 'react';
import { demoLocker } from '../data/vouchers';
import { dramas } from '../data/dramas';

const AppContext = createContext();

// Seed progress from fixture data so Continue Watching is populated on first paint.
const SEED_PROGRESS = dramas.reduce((acc, d) => {
  if (d.progress) acc[d.id] = { ...d.progress };
  return acc;
}, {});

export const SCREENS = {
  HOME: 'home',
  BROWSE: 'browse',
  SHORTS: 'shorts',
  MICRODRAMA: 'microdrama',
  PLAYER: 'player',
  CONTENT_DETAIL: 'content-detail',
  PACK_CATALOGUE: 'pack-catalogue',
  VOUCHER_STORE: 'voucher-store',
  PROFILE: 'profile',
  PAYMENT: 'payment'
};

const DEFAULT_VARIANTS = {
  browse: 'V1',
  player: 'V1',
};

export function AppProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [selectedDrama, setSelectedDrama] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [paywallContext, setPaywallContext] = useState(null); // { origin, content }
  const [showMySubscriptions, setShowMySubscriptions] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null); // { packId, type: 'segment'|'timer', label: string, discount: number, expiresAt?: number }
  
  // Vouchers state
  const [ownedVouchers, setOwnedVouchers] = useState(demoLocker);
  const [voucherTab, setVoucherTab] = useState('store'); // 'store' | 'mine'
  const [showTransition, setShowTransition] = useState(false);
  const [liked, setLiked] = useState({});
  const [myList, setMyList] = useState({});
  const [variants, setVariants] = useState(DEFAULT_VARIANTS);
  const [userState, setUserState] = useState('new'); // 'new' | 'returning'
  const [screenHistory, setScreenHistory] = useState([SCREENS.HOME]);
  const [progressByDrama, setProgressByDrama] = useState(SEED_PROGRESS);
  const [swipeHintSeen, setSwipeHintSeen] = useState(false);
  const [subscription, setSubscription] = useState(null); // { packId, expiresLabel }
  const [rentals, setRentals] = useState([]);
  const [carrierKnown, setCarrierKnown] = useState(true);
  const [orientation, setOrientation] = useState('portrait');
  // Pending ad-streak request from the dev panel. PlayerScreen reads this
  // and kicks off the streak; it's cleared by consumeAdRequest() once handled.
  const [pendingAdRequest, setPendingAdRequest] = useState(null);

  // Queue an ad streak (count + skip/replay flags). Routes to PlayerScreen if
  // the user isn't already there; otherwise the in-screen handler picks it up.
  const triggerAdStreak = ({ count = 1, allowSkip = true, allowReplay = true } = {}) => {
    setPendingAdRequest({ count, allowSkip, allowReplay });
    if (screen !== SCREENS.PLAYER) navigate(SCREENS.PLAYER);
  };
  const consumeAdRequest = () => setPendingAdRequest(null);

  // Advances the playback progress for the active drama/episode by `deltaSeconds`.
  // If the tick would exceed totalSeconds, clamps at the cap (PlayerScreen handles auto-advance).
  const tickProgress = (dramaId, episodeNumber, totalSeconds, deltaSeconds = 1) => {
    setProgressByDrama((prev) => {
      const current = prev[dramaId];
      const sameEpisode = current && current.episodeNumber === episodeNumber;
      const base = sameEpisode ? current.secondsWatched : 0;
      const nextWatched = Math.min(totalSeconds, base + deltaSeconds);
      return {
        ...prev,
        [dramaId]: { episodeNumber, secondsWatched: nextWatched, totalSeconds },
      };
    });
  };

  // Force-like (used by double-tap to ensure idempotent "like" — never toggles off).
  const ensureLiked = (dramaId) => {
    setLiked((prev) => (prev[dramaId] ? prev : { ...prev, [dramaId]: true }));
  };

  const navigate = (newScreen) => {
    setScreenHistory(prev => [...prev, newScreen]);
    setScreen(newScreen);
  };

  const goBack = () => {
    // Clean up player state when leaving
    if (screen === SCREENS.PLAYER) {
      setIsPlaying(false);
      setShowTransition(false);
      setShowEpisodeSelector(false);
      setShowDetail(false);
    }

    if (screenHistory.length > 1) {
      // Pop back to the last non-player screen if current is player
      let newHistory = [...screenHistory];
      newHistory.pop(); // remove current
      // Skip duplicate entries
      while (newHistory.length > 1 && newHistory[newHistory.length - 1] === SCREENS.PLAYER) {
        newHistory.pop();
      }
      setScreenHistory(newHistory);
      setScreen(newHistory[newHistory.length - 1]);
    }
  };

  const selectDrama = (drama) => {
    setSelectedDrama(drama);
    setCurrentEpisode(userState === 'returning' ? (drama.currentEpisode || 5) : 1);
    setShowDetail(true);
  };

  // Tap-to-play: no DetailSheet friction. Selects the drama and goes straight to Player.
  // If the drama already has a current episode (returning user or continue-watching), start there.
  const playDrama = (drama) => {
    const startEpisode = drama.currentEpisode || 1;
    setSelectedDrama(drama);
    setCurrentEpisode(startEpisode);
    setShowDetail(false);
    setShowEpisodeSelector(false);
    setIsPlaying(true);
    if (screen !== SCREENS.PLAYER) {
      navigate(SCREENS.PLAYER);
    }
  };

  const playEpisode = (episodeNum) => {
    setCurrentEpisode(episodeNum);
    setShowDetail(false);
    setShowEpisodeSelector(false);
    setIsPlaying(true);
    // Only push PLAYER to history if we're not already on it
    if (screen !== SCREENS.PLAYER) {
      navigate(SCREENS.PLAYER);
    }
  };

  const toggleLike = (dramaId) => {
    setLiked(prev => ({ ...prev, [dramaId]: !prev[dramaId] }));
  };

  const toggleMyList = (dramaId) => {
    setMyList(prev => ({ ...prev, [dramaId]: !prev[dramaId] }));
  };

  const setVariant = (key, value) => {
    setVariants(prev => ({ ...prev, [key]: value }));
  };

  const setShowSubscribe = (open) => {
    if (open) navigate(SCREENS.PACK_CATALOGUE);
  };

  const value = {
    screen, setScreen: navigate, goBack,
    selectedDrama, setSelectedDrama, selectDrama, playDrama,
    currentEpisode, setCurrentEpisode, playEpisode,
    isPlaying, setIsPlaying,
    showDetail, setShowDetail,
    showEpisodeSelector, setShowEpisodeSelector,
    paywallContext, setPaywallContext,
    showMySubscriptions, setShowMySubscriptions,
    activeCampaign, setActiveCampaign,
    ownedVouchers, setOwnedVouchers,
    voucherTab, setVoucherTab,
    liked, toggleLike, ensureLiked,
    myList, toggleMyList,
    variants, setVariant,
    userState, setUserState,
    progressByDrama, tickProgress,
    showTransition, setShowTransition,
    swipeHintSeen, setSwipeHintSeen,
    subscription, setSubscription,
    rentals, setRentals,
    carrierKnown, setCarrierKnown,
    orientation, setOrientation,
    showSubscribe: setShowSubscribe,
    setShowSubscribe,
    pendingAdRequest, triggerAdStreak, consumeAdRequest,
    SCREENS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

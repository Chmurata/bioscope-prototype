import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp, SCREENS } from './contexts/AppContext';
import PhoneFrame from './components/PhoneFrame';
import StatusBar from './components/StatusBar';
import BottomNavbar from './components/BottomNavbar';
import HomeScreen from './screens/HomeScreen';
import BrowseScreen from './screens/BrowseScreen';
import MicroDramaScreen from './screens/MicroDramaScreen';
import PlayerScreen from './screens/PlayerScreen';
import DetailSheet from './components/DetailSheet';
import SubscribeSheet from './components/SubscribeSheet';
import ControlPanel from './components/ControlPanel';

function ScreenRouter() {
  const { screen, showDetail, showSubscribe, setShowSubscribe } = useApp();

  const isPlayer = screen === SCREENS.PLAYER;

  return (
    <div className="relative w-full h-full bg-[#0A090B]">

      {/* ===== Shell: Status bar + content + navbar — always mounted ===== */}
      <div className="relative w-full h-full" style={{ visibility: isPlayer ? 'hidden' : 'visible' }}>

        {/* Status bar — static, z-20 so it floats above content */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <StatusBar />
        </div>

        {/* Content area — screens crossfade so there's no blank frame between them.
            Dropping mode="wait" lets exit + enter overlap, which removes the visible flash
            that shows the parent bg during the gap. */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence>
            {screen === SCREENS.HOME && (
              <motion.div
                key="home"
                className="absolute inset-0 bg-[#0A090B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <HomeScreen />
              </motion.div>
            )}
            {screen === SCREENS.BROWSE && (
              <motion.div
                key="browse"
                className="absolute inset-0 bg-[#0A090B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <BrowseScreen />
              </motion.div>
            )}
            {screen === SCREENS.MICRODRAMA && (
              <motion.div
                key="microdrama"
                className="absolute inset-0 bg-[#0A090B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <MicroDramaScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom navbar — absolute, overlaps content for glassmorphic blur */}
        <BottomNavbar />
      </div>

      {/* ===== Player — slides over everything ===== */}
      <AnimatePresence>
        {isPlayer && (
          <motion.div
            key="player"
            className="absolute inset-0 z-30"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <PlayerScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Sheet overlay */}
      {showDetail && <DetailSheet />}

      {/* Global Subscribe Sheet */}
      <SubscribeSheet open={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="h-screen overflow-hidden flex items-center justify-center bg-[#1a1a1a]">
        <PhoneFrame>
          <ScreenRouter />
        </PhoneFrame>
        <ControlPanel />
      </div>
    </AppProvider>
  );
}

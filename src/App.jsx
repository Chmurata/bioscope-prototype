import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp, SCREENS } from './contexts/AppContext';
import PhoneFrame from './components/PhoneFrame';
import StatusBar from './components/StatusBar';
import BottomNavbar from './components/BottomNavbar';
import HomeScreen from './screens/HomeScreen';
import BrowseScreen from './screens/BrowseScreen';
import MicroDramaScreen from './screens/MicroDramaScreen';
import ShortsScreen from './screens/ShortsScreen';
import PlayerScreen from './screens/PlayerScreen';
import ContentDetailScreen from './screens/ContentDetailScreen';
import PackCatalogueScreen from './screens/PackCatalogueScreen';
import VoucherStorefrontScreen from './screens/VoucherStorefrontScreen';
import ProfileScreen from './screens/ProfileScreen';
import PaymentSubscriptionScreen from './screens/PaymentSubscriptionScreen';
import DramaSheet from './components/DramaSheet';
import PaywallSheet from './components/PaywallSheet';
import MySubscriptionsSheet from './components/MySubscriptionsSheet';
import ControlPanel from './components/ControlPanel';

function ScreenRouter() {
  const { 
    screen, 
    showDetail, setShowDetail,
    showEpisodeSelector, setShowEpisodeSelector,
    paywallContext, setPaywallContext,
    showMySubscriptions, setShowMySubscriptions
  } = useApp();

  const isPlayer = screen === SCREENS.PLAYER;
  const slideConfig = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
  };

  return (
    <div className="relative w-full h-full bg-dark">

      {/* ===== Shell: content + navbar — always mounted ===== */}
      <div className="relative w-full h-full" style={{ visibility: isPlayer ? 'hidden' : 'visible' }}>

        {/* Content area — screens crossfade so there's no blank frame between them.
            Dropping mode="wait" lets exit + enter overlap, which removes the visible flash
            that shows the parent bg during the gap. */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence>
            {screen === SCREENS.HOME && (
              <motion.div
                key="home"
                className="absolute inset-0 bg-dark"
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
                className="absolute inset-0 bg-dark"
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
                className="absolute inset-0 bg-dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <MicroDramaScreen />
              </motion.div>
            )}
            {screen === SCREENS.SHORTS && (
              <motion.div
                key="shorts"
                className="absolute inset-0 bg-dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <ShortsScreen />
              </motion.div>
            )}
            {screen === SCREENS.PROFILE && (
              <motion.div
                key="profile"
                className="absolute inset-0 bg-dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <ProfileScreen />
              </motion.div>
            )}
            {screen === SCREENS.VOUCHER_STORE && (
              <motion.div key="voucher-store" className="absolute inset-0 z-40 bg-dark" {...slideConfig}>
                <VoucherStorefrontScreen />
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

      <AnimatePresence>
        {screen === SCREENS.CONTENT_DETAIL && (
          <motion.div
            key="content-detail"
            className="absolute inset-0 z-[45]"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <ContentDetailScreen />
          </motion.div>
        )}
        
        {screen === SCREENS.PAYMENT && (
          <motion.div
            key="payment"
            className="absolute inset-0 z-[45]"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <PaymentSubscriptionScreen />
          </motion.div>
        )}

        {screen === SCREENS.PACK_CATALOGUE && (
          <motion.div
            key="pack-catalogue"
            className="absolute inset-0 z-[45]"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <PackCatalogueScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <DramaSheet 
        open={showDetail || showEpisodeSelector} 
        onClose={() => {
          setShowDetail(false);
          setShowEpisodeSelector(false);
        }} 
      />

      <MySubscriptionsSheet 
        open={showMySubscriptions}
        onClose={() => setShowMySubscriptions(false)}
      />

      {/* Status bar — hoisted out of the shell and above every screen, overlay and
          sheet, so it behaves like the real device chrome. Screens that render over
          the shell (content detail, pack catalogue) sit at z-45; sheets at z-100/110;
          this stays above all of them. */}
      <div className="absolute top-0 left-0 right-0 z-[200] pointer-events-none">
        <StatusBar />
      </div>

      {/* Global Paywall */}
      {paywallContext && (
        <PaywallSheet
          origin={paywallContext.origin}
          content={paywallContext.content}
          initialPackId={paywallContext.initialPackId}
          onClose={() => setPaywallContext(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="h-screen overflow-hidden flex items-center justify-center bg-card">
        <PhoneFrame>
          <ScreenRouter />
        </PhoneFrame>
        <ControlPanel />
      </div>
    </AppProvider>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, SCREENS } from '../contexts/AppContext';
import { content } from '../data/content';
import { demoLocker } from '../data/vouchers';
import { Settings, X, RotateCcw } from 'lucide-react';

/**
 * Demo panel. Organised as FLOWS, not as spec IDs — each button sets up all the
 * state a scenario needs and drops you at its starting screen, with a plain
 * description of what you are about to see.
 *
 * Scoped to the Q4 work only. Microdrama, Shorts and Live TV are out of scope
 * and deliberately absent.
 */

const find = (id) => content.find((c) => c.id === id);

const buildGroups = (a) => [
    {
      group: 'Watching & paying',
      flows: [
        { title: 'Preview, then paywall',
          desc: 'Seoul Vibe. Free preview runs, warns near the end, then asks you to subscribe or rent.',
          go: () => a.openContent('seoul-vibe') },
        { title: 'Trailer, then paywall',
          desc: 'The Bike Riders. No preview exists, so the trailer plays and the paywall follows it.',
          go: () => a.openContent('bike-riders') },
        { title: 'Nothing to play',
          desc: 'Love Rosie. Locked with no preview and no trailer — paywall opens straight from the page.',
          go: () => a.openContent('love-rosie') },
        { title: 'Paywall, straight away',
          desc: 'Seoul Vibe with the paywall already open. Subscribing unlocks everything; renting lives under See all packs.',
          go: () => { const c = find('seoul-vibe'); a.setSelectedDrama(c); a.setScreen(SCREENS.CONTENT_DETAIL); a.setPaywallContext({ origin: 'locked-tap', content: c }); } },
        { title: 'Subscribe-only title',
          desc: 'Nishiddho has no preview, so the page shows Subscribe on its own.',
          go: () => { const c = find('bangla-original'); a.setSelectedDrama(c); a.setScreen(SCREENS.CONTENT_DETAIL); a.setPaywallContext({ origin: 'locked-tap', content: c }); } },
      ],
    },
    {
      group: 'Choosing a pack',
      flows: [
        { title: 'Browse all packs',
          desc: '11 packs. Filter by how long they last and which platforms they cover.',
          go: () => a.setScreen(SCREENS.PACK_CATALOGUE) },
      ],
    },
    {
      group: 'Vouchers',
      flows: [
        { title: 'Buy a Netflix voucher',
          desc: 'Shop, product, disclosure, payment, then the code.',
          go: () => a.setScreen(SCREENS.VOUCHER_STORE) },
      ],
    },
    {
      group: 'Offers & discounts',
      flows: [
        { title: 'Discount for your operator',
          desc: 'Standard shows 20% off because you are on Grameenphone.',
          go: () => { a.setActiveCampaign({ packId: 'standard', type: 'segment', label: 'GP Users save 20%', discount: 20 }); a.setScreen(SCREENS.PACK_CATALOGUE); } },
        { title: 'Flash sale, ticking',
          desc: 'Duo Binge, 10 minutes on the clock.',
          go: () => { a.setActiveCampaign({ packId: 'duo-binge', type: 'timer', label: 'Flash Sale', discount: 30, expiresAt: Date.now() + 600000 }); a.setScreen(SCREENS.PACK_CATALOGUE); } },
        { title: 'Sale ends while you are paying',
          desc: 'A flash sale that expires one second from now, mid-checkout.',
          go: () => { a.setActiveCampaign({ packId: 'duo-binge', type: 'timer', label: 'Flash Sale', discount: 30, expiresAt: Date.now() + 1000 }); a.setScreen(SCREENS.PACK_CATALOGUE); } },
        { title: 'Late-night offer — starts later',
          desc: 'Midnight deal not open yet. Shown, but the price has not dropped.',
          go: () => { a.setActiveCampaign({ packId: 'super', type: 'window', windowState: 'upcoming', label: 'Midnight offer', discount: 25, windowLabel: '12:00 AM – 2:00 AM' }); a.setScreen(SCREENS.PACK_CATALOGUE); } },
        { title: 'Late-night offer — live now',
          desc: 'Inside its hours, so the discount applies.',
          go: () => { a.setActiveCampaign({ packId: 'super', type: 'window', windowState: 'active', label: 'Midnight offer', discount: 25, windowLabel: '12:00 AM – 2:00 AM' }); a.setScreen(SCREENS.PACK_CATALOGUE); } },
        { title: 'Late-night offer — over',
          desc: 'Window closed. Badge greys out and the full price returns.',
          go: () => { a.setActiveCampaign({ packId: 'super', type: 'window', windowState: 'ended', label: 'Midnight offer', discount: 25, windowLabel: '12:00 AM – 2:00 AM' }); a.setScreen(SCREENS.PACK_CATALOGUE); } },
      ],
    },
  ];


export default function ControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const app = useApp();
  const {
    setScreen, setSelectedDrama, selectedDrama,
    subscription, setSubscription, setRentals,
    setCarrierKnown, setOrientation,
    setPaywallContext, setShowMySubscriptions,
    setActiveCampaign, setOwnedVouchers,
  } = app;

  // Every flow starts from a known-clean state so scenarios never bleed together.
  const base = () => {
    setPaywallContext(null);
    setShowMySubscriptions(false);
    setActiveCampaign(null);
    setRentals([]);
    setSubscription(null);
    setCarrierKnown(true);
    setOrientation('portrait');
  };

  const run = (flow) => {
    base();
    flow.go();
    setLastRun(flow.title);
  };

  const openContent = (id) => {
    setSelectedDrama(find(id));
    setScreen(SCREENS.CONTENT_DETAIL);
  };

  const GROUPS = buildGroups({ openContent, setSelectedDrama, setScreen, setPaywallContext, setSubscription, setOrientation, setShowMySubscriptions, setOwnedVouchers, setActiveCampaign, setCarrierKnown });

  const reset = () => { base(); setOwnedVouchers(demoLocker); setSelectedDrama(null); setScreen(SCREENS.HOME); setLastRun(null); };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-[9999] h-[36px] px-3 rounded-full bg-accent shadow-lg flex items-center gap-1.5 cursor-pointer hover:bg-accent-light transition-colors"
      >
        {isOpen ? <X size={16} className="text-white" /> : <Settings size={16} className="text-white" />}
        <span className="text-[11px] font-bold text-white tracking-wide">DEMO</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-5 z-[9998] w-[330px] max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar bg-card border border-[#2e3038] rounded-xl shadow-2xl"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Pick a flow</h3>
                <button onClick={reset} className="flex items-center gap-1 text-[10px] text-text-muted hover:text-white cursor-pointer">
                  <RotateCcw size={11} /> Start over
                </button>
              </div>

              <div className="mb-4 rounded-lg bg-black/30 px-3 py-2">
                <p className="text-[10px] text-text-muted leading-relaxed">
                  {lastRun
                    ? <>Showing <span className="text-white font-semibold">{lastRun}</span>{selectedDrama ? <> · {selectedDrama.title}</> : null}{subscription ? <> · subscribed</> : <> · not subscribed</>}</>
                    : 'Nothing running. Pick a flow below and it will set everything up and take you there.'}
                </p>
              </div>

              {GROUPS.map((g) => (
                <div key={g.group} className="mb-5">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-[0.1em] block mb-2">{g.group}</span>
                  <div className="flex flex-col gap-1.5">
                    {g.flows.map((f) => (
                      <button
                        key={f.title}
                        onClick={() => run(f)}
                        className={`text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                          lastRun === f.title ? 'bg-accent' : 'bg-[#2a2d36] hover:bg-[#33363f]'
                        }`}
                      >
                        <span className={`block text-[12px] font-semibold ${lastRun === f.title ? 'text-white' : 'text-white/90'}`}>
                          {f.title}
                        </span>
                        <span className={`block text-[10px] leading-snug mt-0.5 ${lastRun === f.title ? 'text-white/75' : 'text-text-muted'}`}>
                          {f.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

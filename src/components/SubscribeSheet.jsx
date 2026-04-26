import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Clock, Plus, ArrowRight, Crown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PLANS, FLEXIPLAN } from '../data/plans';
import { PAYMENT_PREVIEW } from '../data/paymentMethods';
import PlanCard from './PlanCard';
import OTTLogoStrip from './OTTLogoStrip';
import PaymentMethodList from './PaymentMethodList';
import crownIcon from '../assets/crown.svg';

// Bioscope+ subscription flow, redesigned from production screenshots.
// Stages: plans -> checkout -> payment -> processing -> success
export default function SubscribeSheet({ open, onClose }) {
  const { setIsVip } = useApp();
  const [stage, setStage] = useState('plans');
  const [selectedPlanId, setSelectedPlanId] = useState('super');
  const [paymentId, setPaymentId] = useState('bkash');

  useEffect(() => {
    if (!open) return;
    setStage('plans');
    setSelectedPlanId('super');
    setPaymentId('bkash');
  }, [open]);

  // Tap-to-advance: selecting a plan commits and routes straight to checkout,
  // matching the production mobile pattern (no bottom continue button on the plans screen).
  function handlePlanSelect(planId) {
    setSelectedPlanId(planId);
    setStage('checkout');
  }

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId);

  function close() {
    onClose();
    setTimeout(() => setStage('plans'), 300);
  }

  function handlePay() {
    setStage('processing');
    setTimeout(() => {
      setIsVip?.(true);
      setStage('success');
    }, 1400);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80" onClick={close} />

          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-[#0A090B] rounded-t-[20px] overflow-hidden h-[95%] flex flex-col ring-1 ring-white/5"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 320 }}
          >
            {/* ───────── Plans stage ───────── */}
            {stage === 'plans' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0">
                  <button
                    onClick={close}
                    className="w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    aria-label="Back"
                  >
                    <ArrowLeft size={20} className="text-white" strokeWidth={2} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
                  <h1 className="text-[26px] font-bold text-white mb-5">Choose Your Plan</h1>

                  {/* Flexiplan hero — Figma: 328×122 card, #212628/#373A3D 1px, r16, p16, gap 16 */}
                  <div className="rounded-[16px] bg-[#212628] ring-1 ring-[#373A3D] p-4 mb-3 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <img src={crownIcon} alt="" className="w-[44px] h-[44px] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[18px] font-bold text-white leading-[28px]">{FLEXIPLAN.title}</h3>
                        <p className="text-[12px] font-normal text-white leading-[18px] mt-0.5">{FLEXIPLAN.description}</p>
                      </div>
                    </div>
                    {/* Create Package — Figma: h30, r8, bg white, 12/500/#2A2A2A, plus 16×16 #2A2A2A, gap 8 */}
                    <button className="w-full h-[30px] bg-white rounded-[8px] flex items-center justify-center gap-2 cursor-pointer">
                      <Plus size={16} strokeWidth={2} className="text-[#2A2A2A]" />
                      <span className="text-[12px] font-medium text-[#2A2A2A] leading-[18px]">{FLEXIPLAN.cta}</span>
                    </button>
                  </div>

                  {/* "Or" divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[12px] text-white/50">Or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Plan cards — tap to commit + advance to checkout */}
                  <div className="space-y-3">
                    {PLANS.map((p) => (
                      <PlanCard
                        key={p.id}
                        plan={p}
                        selected={selectedPlanId === p.id}
                        onSelect={handlePlanSelect}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ───────── Checkout stage ───────── */}
            {stage === 'checkout' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0">
                  <button
                    onClick={() => setStage('plans')}
                    className="w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    aria-label="Back"
                  >
                    <ArrowLeft size={20} className="text-white" strokeWidth={2} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
                  <h1 className="text-[26px] font-bold text-white mb-5">Checkout</h1>

                  {/* Plan summary card — mirrors the selected plan's look */}
                  <div className="rounded-[16px] bg-[#1E2224] ring-1 ring-white/8 px-4 pt-4 pb-4 mb-5">
                    <h3 className="text-[20px] font-bold text-white leading-tight mb-3">{selectedPlan.title}</h3>

                    <div className="flex items-center gap-1.5 mb-3">
                      <Clock size={14} className="text-white/85" strokeWidth={2} />
                      <span className="text-[13px] text-white/85 font-medium">{selectedPlan.duration}</span>
                    </div>

                    <p className="text-[12px] text-white/70 mb-3 leading-snug">{selectedPlan.subtitle}</p>

                    {selectedPlan.posters?.length > 0 && (
                      <div className="flex gap-1.5 mb-3">
                        {selectedPlan.posters.slice(0, 3).map((src, i) => (
                          <div key={i} className="w-[76px] h-[44px] rounded-[6px] overflow-hidden bg-black/30 shrink-0">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedPlan.ottBrands?.length > 0 && (
                      <OTTLogoStrip brands={selectedPlan.ottBrands} size={38} cols={7} />
                    )}
                  </div>

                  {/* Select Payment Method — collapsed row */}
                  <h4 className="text-[15px] font-bold text-white mb-3">Select Payment Method</h4>
                  <button
                    onClick={() => setStage('payment')}
                    className="w-full flex items-center gap-2 rounded-[10px] bg-transparent ring-1 ring-[#00BBFF] px-3 py-3 mb-6 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                      {PAYMENT_PREVIEW.map((p, i) => (
                        <div
                          key={i}
                          className="h-[22px] min-w-[34px] px-1.5 rounded-[3px] flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ background: p.bg }}
                        >
                          {p.logo ? (
                            <img src={p.logo} alt="" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="font-bold leading-none" style={{ color: p.color, fontSize: p.size }}>
                              {p.wordmark}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="w-[20px] h-[20px] rounded-full bg-[#00BBFF] flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#0A090B]" strokeWidth={3} />
                    </div>
                  </button>
                </div>

                {/* Sticky amount + continue */}
                <div className="shrink-0 bg-[#212628]">
                  <div className="flex flex-col gap-3 px-3 py-3">
                    {/* Amount Payable row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-white leading-[20px]">Amount Payable</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[14px] font-light text-[#9DA4AE] line-through tabular-nums leading-[20px]">
                          ৳{Math.round(selectedPlan.price * 1.5)}
                        </span>
                        <span className="text-[14px] font-bold text-white tabular-nums leading-[20px]">
                          ৳{selectedPlan.price}
                        </span>
                      </div>
                    </div>
                    {/* Proceed to Payment — Figma: 320×40, r8, bg white, 14/500/#2A2A2A, arrow right 16×16 #2A2A2A */}
                    <button
                      onClick={() => setStage('payment')}
                      className="w-full h-[40px] bg-white rounded-[8px] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="text-[14px] font-medium text-[#2A2A2A] leading-[20px]">Proceed to Payment</span>
                      <ArrowRight size={16} strokeWidth={2} className="text-[#2A2A2A]" />
                    </button>
                    {/* Terms — Figma: 10/400 centered */}
                    <p className="text-[10px] font-normal text-[#9DA4AE] text-center leading-[14px]">
                      By continuing you are agreeing to our <span className="text-[#00BBFF]">Terms & condition</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ───────── Payment method stage ───────── */}
            {stage === 'payment' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Header — kept dark */}
                <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0 bg-[#0A090B]">
                  <button
                    onClick={() => setStage('checkout')}
                    className="w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    aria-label="Back"
                  >
                    <ArrowLeft size={20} className="text-white" strokeWidth={2} />
                  </button>
                </div>

                {/* White body */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-6 bg-white">
                  <PaymentMethodList value={paymentId} onChange={setPaymentId} />
                </div>

                {/* Sticky bottom — same button pattern as other pages (white, r8, #2A2A2A text) */}
                <div className="shrink-0 bg-white px-4 pt-3 pb-5 border-t border-black/5">
                  <button
                    onClick={handlePay}
                    className="w-full h-[40px] bg-white ring-1 ring-[#D2D6DB] rounded-[8px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="text-[14px] font-medium text-[#2A2A2A] leading-[20px]">
                      Continue to pay ৳{selectedPlan.price}
                    </span>
                    <ArrowRight size={16} strokeWidth={2} className="text-[#2A2A2A]" />
                  </button>
                </div>
              </div>
            )}

            {/* ───────── Processing ───────── */}
            {stage === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center px-5">
                <div className="relative">
                  <div className="w-[56px] h-[56px] rounded-full border-[3px] border-[#00BBFF]/20 border-t-[#00BBFF] animate-spin" />
                </div>
                <p className="text-[15px] font-semibold text-white mt-5">Processing payment…</p>
                <p className="text-[12px] text-white/55 mt-1">Securing your subscription</p>
              </div>
            )}

            {/* ───────── Success ───────── */}
            {stage === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="relative w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#73F5FD] to-[#00BBFF] flex items-center justify-center shadow-[0_10px_32px_rgba(0,187,255,0.55)]"
                >
                  <Crown size={40} className="text-[#0A090B]" fill="#0A090B" strokeWidth={2} />
                  <motion.div
                    className="absolute inset-0 rounded-full ring-2 ring-[#73F5FD]/60"
                    animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                </motion.div>
                <h3 className="text-[22px] font-bold text-white mt-5">You're Premium!</h3>
                <p className="text-[13px] text-white/60 mt-1.5 text-center max-w-[280px]">
                  {selectedPlan.title} is active. All microdramas unlocked — ad-free, HD, downloadable.
                </p>

                <div className="w-full mt-6 rounded-[12px] bg-[#1E2224] ring-1 ring-white/8 px-4 py-3 space-y-2">
                  {['Ad-free playback', 'Full HD + multi-audio', 'Offline downloads'].map((perk) => (
                    <div key={perk} className="flex items-center gap-2.5">
                      <div className="w-[18px] h-[18px] rounded-full bg-[#00DF00]/20 flex items-center justify-center">
                        <Check size={11} className="text-[#00DF00]" strokeWidth={3} />
                      </div>
                      <span className="text-[13px] text-white/90">{perk}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={close}
                  className="w-full mt-6 bg-white text-[#0A090B] font-semibold text-[15px] rounded-full py-3.5 cursor-pointer"
                >
                  Start watching
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

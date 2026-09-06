import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Crown, ArrowRight, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { packs } from '../data/packs';
import PackCard from './PackCard';
import PaymentMethodList from './PaymentMethodList';
import { PAYMENT_PREVIEW } from '../data/paymentMethods';

const FRAMING = {
  'preview-end': "You've watched the free preview",
  'trailer-end': "Trailer finished; the content is paywalled",
  'locked-tap': "Unlock to start watching",
  'generic': "Choose Your Plan"
};

export default function PaywallSheet({ origin, content, initialPackId, onClose }) {
  const { setSubscription, rentals, setRentals, setScreen, SCREENS, activeCampaign, carrierKnown } = useApp();
  const [stage, setStage] = useState('prompt'); // prompt, packs, rent-checkout, sub-checkout, payment, processing, success
  const [selectedPackId, setSelectedPackId] = useState(null);
  const [paymentId, setPaymentId] = useState('bkash');
  const [failureKind, setFailureKind] = useState(null); // 'limit' | 'declined'
  // Ticking clock kept in state so expiry is derived from a value, not from a
  // Date.now() call during render.
  const [nowTick, setNowTick] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const [isRentFlow, setIsRentFlow] = useState(false);

  const [autoRenew, setAutoRenew] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [carrierError, setCarrierError] = useState(null);

  // Discount / Campaign State
  const [discountOpen, setDiscountOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Check for campaign expiry mid-checkout
  useEffect(() => {
    if (stage === 'sub-checkout' && activeCampaign?.type === 'timer' && activeCampaign.packId === selectedPackId) {
      if (activeCampaign.expiresAt && activeCampaign.expiresAt <= Date.now()) {
        setToastMessage('Offer expired. The price has been updated.');
        setTimeout(() => setToastMessage(null), 5000);
      }
    }
  }, [stage, activeCampaign, selectedPackId]);
  
  useEffect(() => {
    if (origin) {
      if (initialPackId) {
        setStage('sub-checkout');
        setSelectedPackId(initialPackId);
        setPaymentId('balance');
      } else {
        setStage(origin === 'generic' ? 'packs' : 'prompt');
        setSelectedPackId(null);
        setPaymentId('bkash');
      }
      setIsRentFlow(false);
      setAutoRenew(false);
      setMobileNumber('');
      setOtp('');
      setCarrierError(null);
      setDiscountOpen(false);
      setCouponInput('');
      setAppliedCoupon(null);
      setCouponError(null);
      setToastMessage(null);
    }
  }, [origin, initialPackId]);

  if (!origin) return null;

  // Filter packs for this content
  const eligiblePacks = packs.filter(p => p.eligible);
  const contentPacks = content 
    ? eligiblePacks.filter(p => content.packs.includes(p.id))
    : eligiblePacks;

  // Sort: recommended first. The sheet is a shortcut, not the catalogue —
  // it shows the two strongest options and sends the rest to the pack page.
  const MAX_SHEET_PACKS = 2;
  const displayPacks = [...contentPacks]
    .sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0))
    .slice(0, MAX_SHEET_PACKS);

  const handleSubscribeClick = () => {
    if (origin === 'generic') {
      // Should route to M2 pack page, but for now we just show packs here
      setStage('packs');
    } else {
      setStage('packs');
    }
  };

  // Rent is offered inside the pack sheet, not on the paywall prompt.
  const handleRentClick = () => {
    setIsRentFlow(true);
    setStage('rent-checkout');
  };

  const handlePackSelect = (packId) => {
    setSelectedPackId(packId);
    setIsRentFlow(false);
    setStage('sub-checkout');
  };

  const handlePay = () => {
    if (paymentId === 'balance') {
      setStage('carrier-1');
      return;
    }
    
    executePayment();
  };

  const isValidNumber = /^1[3-9]\d{8}$/.test(mobileNumber);

  // Demo triggers: ...99999 exhausts the monthly spending limit (a hard stop the
  // user cannot top up out of), ...88888 is an ordinary carrier decline (retryable).
  const handleCarrierOtpRequest = () => {
    if (mobileNumber === '1799999999') {
      setFailureKind('limit');
      setStage('carrier-failed');
      return;
    }
    if (mobileNumber === '1788888888') {
      setFailureKind('declined');
      setStage('carrier-failed');
      return;
    }
    if (isValidNumber) {
      setStage('carrier-2');
    }
  };

  const handleCarrierConfirm = () => {
    if (otp === '0000') {
      setCarrierError('Incorrect OTP entered');
      return;
    }
    setCarrierError(null);
    executePayment();
  };

  const executePayment = () => {
    setStage('processing');
    setTimeout(() => {
      if (isRentFlow) {
        setRentals([...rentals, content.id]);
      } else {
        setSubscription({ packId: selectedPackId, expiresLabel: 'Expires in 30 days', autoRenew });
      }
      setStage('success');
    }, 1400);
  };

  const handleSuccessClose = () => {
    onClose();
    if (origin === 'generic') {
      setScreen(SCREENS.HOME);
    }
  };

  const isCompact = stage === 'prompt' || stage === 'packs';
  const selectedPack = packs.find(p => p.id === selectedPackId);
  
  // R2: Determine allowed methods based on pack.payWith and carrierKnown
  let allowedMethods = selectedPack?.payWith || ['bkash', 'nagad', 'card'];
  if (!carrierKnown) {
    allowedMethods = allowedMethods.filter(m => m !== 'balance');
  }

  // Calculate final pricing
  const basePrice = selectedPack?.price || 0;
  let finalPrice = basePrice;
  let activeDiscountLabel = null;
  let discountAmount = 0;

  if (appliedCoupon) {
    discountAmount = appliedCoupon.discount;
    finalPrice = Math.max(0, basePrice - discountAmount);
    activeDiscountLabel = `Coupon (${appliedCoupon.code})`;
  } else if (activeCampaign && activeCampaign.packId === selectedPackId) {
    const isExpired = activeCampaign.expiresAt && activeCampaign.expiresAt <= nowTick;
    if (!isExpired) {
      discountAmount = activeCampaign.discount;
      finalPrice = Math.max(0, basePrice - discountAmount);
      activeDiscountLabel = activeCampaign.label;
    }
  }

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'VALID50') {
      setAppliedCoupon({ code, discount: 50 });
      setCouponError(null);
      setCouponInput('');
      setDiscountOpen(false);
    } else if (code === 'EXPIRED') {
      setCouponError('This coupon code has expired.');
    } else if (code === 'NOT_ELIGIBLE') {
      setCouponError('This coupon is not valid for the selected pack.');
    } else {
      setCouponError('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

        <motion.div
          className={`absolute bottom-0 left-0 right-0 bg-dark rounded-t-[20px] ring-1 ring-white/5 overflow-hidden flex flex-col ${isCompact ? 'max-h-[85%]' : 'h-[95%]'}`}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 320 }}
        >
          
          {/* 1. Initial Prompt */}
          {stage === 'prompt' && (
            <div className="p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[14px] text-cyan font-semibold mb-1">{FRAMING[origin]}</p>
                  <h2 className="text-[22px] font-bold text-white">{content?.title}</h2>
                </div>
                <button onClick={onClose} className="p-1 cursor-pointer bg-white/10 rounded-full">
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button 
                  onClick={handleSubscribeClick}
                  className="w-full h-[52px] bg-[image:var(--gradient-subscribe)] rounded-[12px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,153,0,0.3)]"
                >
                  <Crown size={20} className="text-black" strokeWidth={2.5} />
                  <span className="text-[16px] font-bold text-black">Subscribe to Unlock</span>
                </button>
              </div>
              
              <div className="mt-4 flex justify-center">
                <button onClick={handleSubscribeClick} className="text-[13px] text-white/50 hover:text-white cursor-pointer transition-colors">
                  See all packs
                </button>
              </div>
            </div>
          )}

          {/* 2. Compact Packs Sheet */}
          {stage === 'packs' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0">
                <button onClick={() => origin === 'generic' ? onClose() : setStage('prompt')} className="p-1 cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <span className="text-[16px] font-bold text-white">Select a Pack</span>
                <div className="w-[32px]" />
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
                {content?.rentPrice && (
                  <button
                    onClick={handleRentClick}
                    className="w-full flex items-center gap-3 rounded-[12px] bg-surface-dark ring-1 ring-white/10 px-4 py-3 text-left cursor-pointer active:scale-[0.99] transition-transform"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="block text-[15px] font-bold text-white leading-[20px]">Rent this title</span>
                      <span className="block text-[12px] text-white/60 leading-[16px] mt-0.5">48 hours from first play</span>
                    </div>
                    <span className="text-[18px] font-bold text-white tabular-nums leading-none shrink-0">৳{content.rentPrice}</span>
                    <ArrowRight size={18} className="text-white/50 shrink-0" />
                  </button>
                )}
                {displayPacks.map(p => (
                  <PackCard key={p.id} pack={p} onSelect={handlePackSelect} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Rent Checkout */}
          {stage === 'rent-checkout' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0">
                <button onClick={() => setStage('prompt')} className="cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <span className="text-[18px] font-bold text-white">Checkout</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <div className="rounded-[16px] bg-surface-dark ring-1 ring-white/10 p-4 mb-5">
                  <span className="text-[12px] font-bold text-amber uppercase tracking-wider mb-1 block">Rental</span>
                  <h3 className="text-[20px] font-bold text-white mb-2">{content?.title}</h3>
                  <p className="text-[13px] text-white/70 leading-relaxed">
                    Access to this title for <strong>48 hours</strong>. The rental period starts when you first press play.
                  </p>
                </div>
                
                <h4 className="text-[15px] font-bold text-white mb-3">Select Payment Method</h4>
                <button onClick={() => setStage('payment')} className="w-full flex items-center justify-between rounded-[10px] bg-transparent ring-1 ring-cyan px-4 py-3 mb-6 cursor-pointer">
                  <div className="flex gap-2 items-center">
                    {PAYMENT_PREVIEW.slice(0, 3).map((p, i) => (
                      <div key={i} className="h-[22px] bg-white px-2 rounded-[3px] flex items-center justify-center">
                        <img src={p.logo} alt="" className="h-[12px] object-contain" />
                      </div>
                    ))}
                    <span className="text-[12px] text-white/50 ml-1">...</span>
                  </div>
                  <div className="w-[20px] h-[20px] rounded-full bg-cyan flex items-center justify-center">
                    <Check size={12} className="text-black" strokeWidth={3} />
                  </div>
                </button>
              </div>
              <div className="shrink-0 bg-surface-alt p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[14px] text-white">Amount Payable</span>
                  <span className="text-[18px] font-bold text-white tabular-nums">৳{content?.rentPrice}</span>
                </div>
                <button onClick={() => setStage('payment')} className="w-full h-[48px] bg-white rounded-[12px] flex items-center justify-center gap-2 cursor-pointer">
                  <span className="text-[15px] font-bold text-black">Proceed to Payment</span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>
            </div>
          )}

          {/* 4. Sub Checkout */}
          {stage === 'sub-checkout' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0">
                <button onClick={() => setStage('packs')} className="cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <span className="text-[18px] font-bold text-white">Checkout</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-6 relative">
                
                <AnimatePresence>
                  {toastMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-4 left-4 right-4 bg-pink text-white text-[13px] font-bold px-4 py-2.5 rounded-[8px] shadow-lg z-20 flex justify-between items-center"
                    >
                      {toastMessage}
                      <button onClick={() => setToastMessage(null)}><X size={14} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="rounded-[16px] bg-surface-dark ring-1 ring-white/10 p-4 mb-5">
                  <h3 className="text-[20px] font-bold text-white mb-2">{selectedPack?.title}</h3>
                  <span className="text-[13px] text-white/70 block mb-3">{selectedPack?.duration}</span>
                  <p className="text-[12px] text-white/50 mb-4">{selectedPack?.coverage}</p>
                  
                  {/* Auto-renewal Toggle */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[14px] text-white">Auto renewal</span>
                    <button 
                      onClick={() => setAutoRenew(!autoRenew)}
                      className={`w-[44px] h-[24px] rounded-full relative transition-colors ${autoRenew ? 'bg-cyan' : 'bg-white/20'}`}
                    >
                      <div className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full transition-transform ${autoRenew ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
                
                <PaymentMethodList 
                  value={paymentId} 
                  onChange={setPaymentId} 
                  allowedMethods={allowedMethods}
                  theme="dark"
                />
                
                {/* Discount Expander */}
                <div className="mb-2">
                  <button 
                    onClick={() => setDiscountOpen(!discountOpen)}
                    className="w-full flex items-center justify-between rounded-[10px] bg-surface-dark ring-1 ring-white/10 px-4 py-3 cursor-pointer"
                  >
                    <span className="text-[14px] font-bold text-white">Discount</span>
                    <div className="flex items-center gap-2">
                      {appliedCoupon && (
                        <span className="text-[12px] font-bold text-pink">1 Applied</span>
                      )}
                      <ArrowRight size={16} className={`text-white/50 transition-transform ${discountOpen ? '-rotate-90' : 'rotate-90'}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {discountOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-surface-dark/50 p-4 pt-2 border-x border-b border-white/5 rounded-b-[10px]">
                          
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between bg-black/20 p-3 rounded-[8px] ring-1 ring-pink/30">
                              <div className="flex items-center gap-2">
                                <Check size={16} className="text-pink" />
                                <span className="text-[13px] font-bold text-white uppercase">{appliedCoupon.code}</span>
                                <span className="text-[13px] text-white/70">-৳{appliedCoupon.discount}</span>
                              </div>
                              <button onClick={handleRemoveCoupon} className="text-[12px] text-pink font-bold hover:underline cursor-pointer">Remove</button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Enter Coupon Code" 
                                  value={couponInput}
                                  onChange={(e) => setCouponInput(e.target.value)}
                                  className="flex-1 h-[40px] bg-black/20 border border-white/10 rounded-[8px] px-3 text-[14px] text-white outline-none focus:border-pink"
                                />
                                <button 
                                  onClick={handleApplyCoupon}
                                  disabled={!couponInput.trim()}
                                  className="h-[40px] px-4 bg-white text-black font-bold text-[13px] rounded-[8px] disabled:opacity-50 cursor-pointer"
                                >
                                  Apply
                                </button>
                              </div>
                              {couponError && <p className="text-[11px] text-pink mt-2">{couponError}</p>}
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-[11px] text-white/50 text-center mb-6">By continuing you are agreeing to Bioscope+'s Terms of Use and Refund Policy</p>
              </div>
              <div className="shrink-0 bg-surface-alt p-4">
                {activeDiscountLabel ? (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[13px] text-white/70">Subtotal</span>
                      <span className="text-[13px] text-white tabular-nums">৳{basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/10">
                      <span className="text-[13px] text-pink">{activeDiscountLabel}</span>
                      <span className="text-[13px] text-pink tabular-nums">-৳{discountAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] font-bold text-white">Amount Payable</span>
                      <span className="text-[20px] font-bold text-white tabular-nums leading-none">৳{finalPrice}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[14px] text-white">Amount Payable</span>
                    <div className="flex items-end gap-2">
                      {selectedPack?.originalPrice && (
                        <span className="text-[14px] text-white/50 line-through tabular-nums mb-[2px]">৳{selectedPack.originalPrice}</span>
                      )}
                      <span className="text-[20px] font-bold text-white tabular-nums leading-none">৳{finalPrice}</span>
                    </div>
                  </div>
                )}
                
                <button onClick={handlePay} className="w-full h-[48px] bg-white rounded-[12px] flex items-center justify-center gap-2 cursor-pointer">
                  <span className="text-[15px] font-bold text-black">Continue to Payment</span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>
            </div>
          )}

          {/* 5. Payment Methods List */}
          {stage === 'payment' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0 bg-dark">
                <button onClick={() => setStage(isRentFlow ? 'rent-checkout' : 'sub-checkout')} className="cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6">
                <PaymentMethodList value={paymentId} onChange={setPaymentId} />
              </div>
              <div className="shrink-0 bg-white p-4 border-t border-black/5">
                <button onClick={handlePay} className="w-full h-[48px] bg-white ring-1 ring-black/20 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer">
                  <span className="text-[15px] font-bold text-black">
                    Pay ৳{isRentFlow ? content?.rentPrice : selectedPack?.price}
                  </span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>
            </div>
          )}

          {/* 5a. Carrier Stage 1 (Number) */}
          {stage === 'carrier-1' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-[32px] h-[32px] rounded-full bg-gp-blue flex items-center justify-center">
                    <span className="text-[14px] font-bold text-white leading-none">gp</span>
                  </div>
                  <span className="text-[18px] font-bold text-black">Checkout</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-[60px] h-[60px] bg-black rounded-[8px] flex items-center justify-center shrink-0">
                    <Crown size={28} className="text-cyan" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-black mb-1">{selectedPack?.title}</h3>
                    <span className="text-[14px] text-black/60">{selectedPack?.duration}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-[14px] font-bold text-black mb-2 block">Mobile Number:</label>
                  <div className="flex items-center border border-black/20 rounded-[8px] overflow-hidden focus-within:border-gp-blue focus-within:ring-1 focus-within:ring-gp-blue">
                    <div className="px-3 bg-black/5 h-[48px] flex items-center text-[15px] font-medium border-r border-black/10">
                      +880
                    </div>
                    <input 
                      type="tel"
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      placeholder="17XXXXXXXX"
                      className="flex-1 h-[48px] px-3 text-[15px] font-medium outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-8">
                  <div className="w-[20px] h-[20px] rounded-[4px] bg-gp-blue flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <p className="text-[12px] text-black/60 leading-tight">
                    I acknowledge and accept that charges for {selectedPack?.duration} will be made to my mobile balance.
                  </p>
                </div>

                {mobileNumber.length > 0 && !isValidNumber && (
                  <p className="text-[12px] text-red-600 mb-3 -mt-2">
                    Enter a valid 11-digit Bangladeshi mobile number, e.g. 01711092617
                  </p>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStage('sub-checkout')} className="flex-1 h-[48px] rounded-[8px] border border-black/20 text-black font-bold text-[15px]">
                    Cancel
                  </button>
                  <button 
                    onClick={handleCarrierOtpRequest}
                    disabled={!isValidNumber}
                    className={`flex-1 h-[48px] rounded-[8px] font-bold text-[15px] text-white transition-colors ${isValidNumber ? 'bg-gp-blue' : 'bg-black/20'}`}
                  >
                    Get OTP
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5b. Carrier Stage 2 (OTP & Limit) */}
          {stage === 'carrier-2' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-[32px] h-[32px] rounded-full bg-gp-blue flex items-center justify-center">
                    <span className="text-[14px] font-bold text-white leading-none">gp</span>
                  </div>
                  <span className="text-[18px] font-bold text-black">Checkout</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px] bg-black rounded-[8px] flex items-center justify-center shrink-0">
                      <Crown size={28} className="text-cyan" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-black mb-1">{selectedPack?.title}</h3>
                      <span className="text-[14px] text-black/60">{selectedPack?.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[18px] font-bold text-black block">{selectedPack?.price} BDT</span>
                    <span className="text-[11px] text-black/50">(15% VAT included)</span>
                  </div>
                </div>

                <div className="bg-black/5 rounded-[8px] p-4 mb-8 font-mono text-[12px] text-black/80 space-y-1">
                  <div className="flex justify-between"><span className="text-black/50">Mobile Number:</span><span>+880 {mobileNumber}</span></div>
                  <div className="flex justify-between"><span className="text-black/50">Monthly Limit Used:</span><span>BDT 260</span></div>
                  <div className="flex justify-between"><span className="text-black/50">Yearly Limit Used:</span><span>BDT 2680</span></div>
                  <div className="h-px bg-black/10 my-2" />
                  <div className="flex justify-between"><span className="text-black/50">Monthly Limit will Remain:</span><span>BDT 21441</span></div>
                  <div className="flex justify-between"><span className="text-black/50">Yearly Limit will Remain:</span><span>BDT 9021</span></div>
                </div>

                <div className="mb-8">
                  <label className="text-[14px] font-bold text-black mb-2 block">Please Enter OTP:</label>
                  <input 
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="XXXX"
                    className="w-full h-[48px] px-4 border border-black/20 rounded-[8px] text-[15px] font-bold outline-none focus:border-gp-blue focus:ring-1 focus:ring-gp-blue"
                  />
                  {carrierError && (
                    <p className="text-[12px] text-red-500 mt-2">{carrierError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStage('carrier-1')} className="flex-1 h-[48px] rounded-[8px] border border-black/20 text-black font-bold text-[15px]">
                    Cancel
                  </button>
                  <button 
                    onClick={handleCarrierConfirm}
                    disabled={otp.length < 4}
                    className={`flex-1 h-[48px] rounded-[8px] font-bold text-[15px] text-white transition-colors ${otp.length >= 4 ? 'bg-gp-blue' : 'bg-black/20'}`}
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5c. Carrier Stage Failed (MB9) */}
          {stage === 'carrier-failed' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-[32px] h-[32px] rounded-full bg-gp-blue flex items-center justify-center">
                    <span className="text-[14px] font-bold text-white leading-none">gp</span>
                  </div>
                  <span className="text-[18px] font-bold text-black">Checkout</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-[64px] h-[64px] rounded-full bg-red-100 flex items-center justify-center mb-6">
                  <X size={32} className="text-red-500" strokeWidth={3} />
                </div>
                <h2 className="text-[20px] font-bold text-black mb-2">
                  {failureKind === 'limit' ? 'Spending limit reached' : 'Payment declined'}
                </h2>
                <p className="text-[14px] text-black/60 mb-8 max-w-[260px]">
                  {failureKind === 'limit'
                    ? 'You have used your monthly mobile balance limit. It resets next month — until then, please pay another way.'
                    : 'Your operator could not complete this charge. You can try again, or pay another way.'}
                </p>
                <div className="w-full flex flex-col gap-2">
                  {failureKind === 'declined' && (
                    <button onClick={() => { setFailureKind(null); setStage('carrier-1'); }} className="w-full h-[48px] bg-gp-blue rounded-[12px] text-white font-bold text-[15px] cursor-pointer">
                      Try again
                    </button>
                  )}
                  <button onClick={() => { setFailureKind(null); setStage('sub-checkout'); }} className={`w-full h-[48px] rounded-[12px] font-bold text-[15px] cursor-pointer ${failureKind === 'declined' ? 'border border-black/20 text-black' : 'bg-gp-blue text-white'}`}>
                    Choose another method
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. Processing */}
          {stage === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-cyan/20 border-t-cyan animate-spin mb-6" />
              <p className="text-[16px] font-bold text-white">Processing Payment...</p>
            </div>
          )}

          {/* 7. Success */}
          {stage === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-[64px] h-[64px] rounded-full bg-gradient-to-tr from-cyan to-cyan-light flex items-center justify-center mb-6">
                <Check size={32} className="text-black" strokeWidth={3} />
              </div>
              <h2 className="text-[24px] font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-[14px] text-white/60 mb-8 max-w-[240px]">
                {isRentFlow 
                  ? `You have rented ${content?.title}. Your 48 hour window begins when you press play.`
                  : `Payment successful. It may take a moment to reflect on your account. please be patient.`}
              </p>
              <button onClick={handleSuccessClose} className="w-full h-[48px] bg-white rounded-[12px] text-black font-bold text-[15px] cursor-pointer">
                {origin === 'generic' ? 'Browse Home' : 'Start Watching'}
              </button>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

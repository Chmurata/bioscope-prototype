import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Copy, ExternalLink, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { vouchers } from '../data/vouchers';
import VoucherBrandMark from './VoucherBrandMark';
import PaymentMethodList from './PaymentMethodList';

export default function VoucherPurchaseSheet({ voucherId, onClose }) {
  const { ownedVouchers, setOwnedVouchers } = useApp();
  const [stage, setStage] = useState('detail'); // detail, disclosure, checkout, processing, success
  const [paymentId, setPaymentId] = useState('bkash');
  const [agreed, setAgreed] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const voucher = vouchers.find(v => v.id === voucherId);

  useEffect(() => {
    if (voucherId) {
      setStage('detail');
      setPaymentId(voucher?.payWith?.[0] || 'bkash');
      setAgreed(false);
    }
  }, [voucherId, voucher]);

  if (!voucherId || !voucher) return null;

  const handlePay = () => {
    setStage('processing');
    setTimeout(() => {
      const code = `${voucher.brand.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-VCHR`;
      setGeneratedCode(code);
      
      const newOwned = {
        instanceId: `v_new_${Date.now()}`,
        productId: voucher.id,
        code: code,
        state: 'unredeemed',
        purchasedAt: Date.now(),
        codeExpiresAt: Date.now() + (voucher.codeValidDays * 24 * 60 * 60 * 1000)
      };
      
      setOwnedVouchers([newOwned, ...ownedVouchers]);
      setStage('success');
    }, 1500);
  };

  const handleCopy = () => {
    // mock copy
    alert('Code copied to clipboard!');
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
          className="absolute bottom-0 left-0 right-0 bg-dark rounded-t-[20px] ring-1 ring-white/5 overflow-hidden flex flex-col h-[90%]"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 320 }}
        >
          
          {/* V3: Product Detail */}
          {stage === 'detail' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0 border-b border-white/10">
                <button onClick={onClose} className="p-1 cursor-pointer">
                  <X size={24} className="text-white" />
                </button>
                <span className="text-[16px] font-bold text-white">Purchase Digital Code</span>
                <div className="w-[32px]" />
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 text-center">
                <VoucherBrandMark brand={voucher.brand} logo={voucher.logo} size={80} radius={16} className="mx-auto mb-4 shadow-lg" />
                <h2 className="text-[24px] font-bold text-white mb-1">{voucher.product}</h2>
                <p className="text-[14px] text-white/60 mb-8">Grants access to {voucher.brand} for {voucher.grants}</p>
                
                <div className="bg-surface-dark ring-1 ring-white/10 rounded-[12px] p-4 text-left space-y-4 mb-6">
                  <div>
                    <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-wider mb-1">Code Validity</h4>
                    <p className="text-[14px] text-white">Must be redeemed within <span className="font-bold text-amber">{voucher.codeValidDays} days</span> of purchase.</p>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-wider mb-1">Redemption</h4>
                    <p className="text-[14px] text-white">Redeemable only on the {voucher.brand} app or website.</p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 bg-surface-alt p-4 flex items-center justify-between">
                <div>
                  <span className="text-[13px] text-white/60 block mb-0.5">Price</span>
                  <span className="text-[22px] font-bold text-white tabular-nums leading-none">৳{voucher.price}</span>
                </div>
                <button 
                  onClick={() => setStage('disclosure')} 
                  className="h-[48px] px-6 bg-white rounded-[12px] flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[15px] font-bold text-black">Buy Now</span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>
            </div>
          )}

          {/* V4: Disclosure */}
          {stage === 'disclosure' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0 border-b border-white/10">
                <button onClick={() => setStage('detail')} className="cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <span className="text-[16px] font-bold text-white">Important Terms</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
                <div className="w-[48px] h-[48px] rounded-full bg-amber/20 flex items-center justify-center mb-6">
                  <AlertCircle size={24} className="text-amber" />
                </div>
                <h3 className="text-[20px] font-bold text-white mb-6">Before you purchase</h3>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-3">
                    <Check size={20} className="text-cyan shrink-0" />
                    <p className="text-[14px] text-white/80 leading-relaxed">This is a digital code. It will be revealed immediately after payment.</p>
                  </li>
                  <li className="flex gap-3">
                    <Check size={20} className="text-cyan shrink-0" />
                    <p className="text-[14px] text-white/80 leading-relaxed">It is <strong className="text-white">non-refundable</strong> once the code is revealed, even if you do not use it.</p>
                  </li>
                  <li className="flex gap-3">
                    <Check size={20} className="text-cyan shrink-0" />
                    <p className="text-[14px] text-white/80 leading-relaxed">You must redeem it on the partner's service within {voucher.codeValidDays} days.</p>
                  </li>
                </ul>

                <button 
                  onClick={() => setAgreed(!agreed)}
                  className="flex items-start gap-3 p-4 bg-surface-dark ring-1 ring-white/10 rounded-[12px] cursor-pointer"
                >
                  <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center shrink-0 mt-0.5 ${agreed ? 'bg-cyan border-cyan' : 'border-white/30'}`}>
                    {agreed && <Check size={14} className="text-black" strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] text-white text-left leading-relaxed">I understand and accept these terms, and acknowledge this purchase cannot be refunded.</span>
                </button>
              </div>
              <div className="shrink-0 bg-surface-alt p-4">
                <button 
                  onClick={() => setStage('checkout')} 
                  disabled={!agreed}
                  className="w-full h-[48px] bg-white rounded-[12px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 transition-opacity"
                >
                  <span className="text-[15px] font-bold text-black">Agree and Continue</span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>
            </div>
          )}

          {/* V5: Checkout */}
          {stage === 'checkout' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0 bg-dark">
                <button onClick={() => setStage('disclosure')} className="cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <span className="text-[16px] font-bold text-white">Select Payment</span>
              </div>
              <div className="bg-surface-dark p-4 border-b border-white/10">
                <div className="flex justify-between items-center gap-3">
                  <VoucherBrandMark brand={voucher.brand} logo={voucher.logo} size={40} radius={10} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-bold text-white block">{voucher.brand}</span>
                    <span className="text-[12px] text-white/60">{voucher.product}</span>
                  </div>
                  <span className="text-[18px] font-bold text-white tabular-nums">৳{voucher.price}</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6">
                <PaymentMethodList 
                  value={paymentId} 
                  onChange={setPaymentId} 
                  allowedMethods={voucher.payWith || ['bkash', 'nagad', 'card']}
                />
              </div>
              <div className="shrink-0 bg-white p-4 border-t border-black/5">
                <button onClick={handlePay} className="w-full h-[48px] bg-white ring-1 ring-black/20 rounded-[12px] flex items-center justify-center gap-2 cursor-pointer hover:bg-black/5">
                  <span className="text-[15px] font-bold text-black">Pay ৳{voucher.price}</span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>
            </div>
          )}

          {/* Processing */}
          {stage === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-cyan/20 border-t-cyan animate-spin mb-6" />
              <p className="text-[16px] font-bold text-white">Generating Code...</p>
            </div>
          )}

          {/* V6: Code Reveal */}
          {stage === 'success' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0">
                <div className="w-[24px]" />
                <span className="text-[16px] font-bold text-white">Payment Successful</span>
                <button onClick={onClose} className="p-1 cursor-pointer">
                  <X size={24} className="text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 text-center">
                <div className="w-[64px] h-[64px] rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-cyan" strokeWidth={3} />
                </div>
                <h2 className="text-[20px] font-bold text-white mb-2">Here is your code!</h2>
                <p className="text-[14px] text-white/60 mb-8 max-w-[280px] mx-auto">
                  Your purchase is complete. You must redeem this code within {voucher.codeValidDays} days.
                </p>

                <div className="bg-white/5 border border-white/20 rounded-[12px] p-6 mb-8 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[12px] font-bold text-white/40 uppercase tracking-wider block mb-3">Digital Code</span>
                  <span className="text-[28px] font-mono font-bold text-white tracking-widest break-all">
                    {generatedCode}
                  </span>
                  
                  <button 
                    onClick={handleCopy}
                    className="mt-6 mx-auto h-[36px] px-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Copy size={14} className="text-white" />
                    <span className="text-[13px] font-bold text-white">Copy Code</span>
                  </button>
                </div>
              </div>
              
              <div className="shrink-0 bg-surface-alt p-4 space-y-3">
                <button 
                  onClick={() => alert(`Redirecting to ${voucher.brand}...`)}
                  className="w-full h-[48px] bg-white rounded-[12px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink size={18} className="text-black" />
                  <span className="text-[15px] font-bold text-black">Redeem Now</span>
                </button>
                <button 
                  onClick={onClose}
                  className="w-full h-[48px] bg-transparent text-white text-[14px] font-bold hover:underline cursor-pointer"
                >
                  I'll do it later (Save to Locker)
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

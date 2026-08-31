import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, ExternalLink, ShieldAlert, Timer, X } from 'lucide-react';
import { vouchers } from '../data/vouchers';

export default function OwnedVoucherDetailSheet({ voucherInstance, onClose }) {
  const [stage, setStage] = useState('detail'); // detail, handoff

  useEffect(() => {
    if (voucherInstance) {
      setStage('detail');
    }
  }, [voucherInstance]);

  if (!voucherInstance) return null;

  const product = vouchers.find(v => v.id === voucherInstance.productId);
  if (!product) return null;

  const isUnredeemed = voucherInstance.state === 'unredeemed';
  const isRedeemed = voucherInstance.state === 'redeemed';
  const isExpired = voucherInstance.state === 'expired';

  const calculateDaysLeft = (targetDate) => {
    const diff = targetDate - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleCopy = () => {
    alert('Code copied to clipboard!');
  };

  const handleRedeem = () => {
    setStage('handoff');
  };

  const executeHandoff = () => {
    alert(`Redirecting to ${product.brand}...`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-[110]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-dark rounded-t-[20px] ring-1 ring-white/5 overflow-hidden flex flex-col h-[85%]"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 320 }}
        >
          {/* Detail State */}
          {stage === 'detail' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0 border-b border-white/10">
                <button onClick={onClose} className="cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <span className="text-[16px] font-bold text-white">Voucher Details</span>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
                
                {/* Header Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-[64px] h-[64px] bg-white rounded-[12px] flex items-center justify-center shrink-0 shadow-lg">
                    <span className="text-[13px] font-bold text-black">{product.brand}</span>
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-white mb-1">{product.product}</h2>
                    <span className="text-[13px] text-white/60">Bought {new Date(voucherInstance.purchasedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* State-specific Content */}

                {/* V8: Unredeemed */}
                {isUnredeemed && (
                  <>
                    <div className="bg-surface-dark ring-1 ring-cyan/30 rounded-[12px] p-5 mb-6 text-center">
                      <span className="text-[11px] font-bold text-cyan uppercase tracking-wider block mb-1">Code Valid For</span>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Timer size={18} className="text-white" />
                        <span className="text-[20px] font-bold text-white">{calculateDaysLeft(voucherInstance.codeExpiresAt)} days</span>
                      </div>
                      
                      <div className="bg-black/20 rounded-[8px] py-3 px-4 flex items-center justify-between mb-4 ring-1 ring-white/10">
                        <span className="font-mono text-[18px] font-bold text-white tracking-widest">{voucherInstance.code}</span>
                        <button onClick={handleCopy} className="text-cyan cursor-pointer"><Copy size={20} /></button>
                      </div>
                      <p className="text-[12px] text-white/60">Grants {product.grants} once redeemed.</p>
                    </div>

                    <button 
                      onClick={handleRedeem}
                      className="w-full h-[48px] bg-cyan text-black font-bold text-[15px] rounded-[12px] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan/20"
                    >
                      <ExternalLink size={18} /> Redeem Now
                    </button>
                  </>
                )}

                {/* V9: Redeemed */}
                {isRedeemed && (
                  <div className="bg-surface-dark ring-1 ring-white/10 rounded-[12px] p-5 mb-6 text-center">
                    <div className="w-[48px] h-[48px] rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <Check size={24} className="text-white" />
                    </div>
                    <span className="text-[14px] font-bold text-white block mb-2">Redeemed Successfully</span>
                    <p className="text-[13px] text-white/60 mb-6">
                      You redeemed this code on {new Date(voucherInstance.redeemedAt).toLocaleDateString()}.
                    </p>
                    
                    <div className="bg-black/20 rounded-[8px] p-4 text-left">
                      <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1">Package Validity</span>
                      <span className="text-[16px] font-bold text-cyan block mb-1">{calculateDaysLeft(voucherInstance.packageExpiresAt)} days remaining</span>
                      <span className="text-[13px] text-white/60">Ends {new Date(voucherInstance.packageExpiresAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4 text-left">
                      <span className="text-[11px] text-white/40 block mb-1">Spent Code</span>
                      <span className="font-mono text-[14px] text-white/30 line-through tracking-wider">{voucherInstance.code}</span>
                    </div>
                  </div>
                )}

                {/* V10: Expired Unredeemed */}
                {isExpired && (
                  <div className="bg-error-surface ring-1 ring-red-500/30 rounded-[12px] p-5 mb-6 text-center">
                    <div className="w-[48px] h-[48px] rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <ShieldAlert size={24} className="text-red-500" />
                    </div>
                    <span className="text-[16px] font-bold text-white block mb-2">Voucher Expired</span>
                    <p className="text-[13px] text-white/70 leading-relaxed mb-6">
                      This digital code was not redeemed within its {product.codeValidDays}-day validity window. It has expired and can no longer be used or refunded.
                    </p>

                    <div className="mt-6 border-t border-red-500/20 pt-4 text-left">
                      <span className="text-[11px] text-white/40 block mb-1">Dead Code</span>
                      <span className="font-mono text-[14px] text-white/30 line-through tracking-wider">{voucherInstance.code}</span>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* V11: Redirection Handoff */}
          {stage === 'handoff' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0 border-b border-white/10">
                <button onClick={() => setStage('detail')} className="cursor-pointer">
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <span className="text-[16px] font-bold text-white">Redeem Code</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="flex items-center justify-center gap-4 mb-8 w-full max-w-[200px]">
                  <div className="w-[48px] h-[48px] rounded-full bg-cyan flex items-center justify-center">
                    <span className="text-[20px] font-bold text-black">B+</span>
                  </div>
                  <div className="flex-1 h-px bg-white/20 relative">
                    <div className="absolute right-0 -top-[4px] w-[8px] h-[8px] border-t border-r border-white/20 rotate-45" />
                  </div>
                  <div className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-black">{product.brand}</span>
                  </div>
                </div>

                <h3 className="text-[20px] font-bold text-white mb-4">Leaving Bioscope+</h3>
                <p className="text-[14px] text-white/60 mb-8 max-w-[260px] leading-relaxed">
                  You will now be redirected to {product.brand}'s website to redeem your code. Please ensure you are logged into your {product.brand} account.
                </p>

                <div className="w-full space-y-3">
                  <button 
                    onClick={executeHandoff}
                    className="w-full h-[48px] bg-white text-black font-bold text-[15px] rounded-[12px] cursor-pointer"
                  >
                    Continue to {product.brand}
                  </button>
                  <button 
                    onClick={() => setStage('detail')}
                    className="w-full h-[48px] bg-transparent text-white font-bold text-[14px] cursor-pointer hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

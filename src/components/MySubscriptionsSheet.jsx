import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Check, Timer, X, Ticket, ChevronRight, ShieldAlert } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { packs } from '../data/packs';
import { vouchers } from '../data/vouchers';
import { formatUsd } from '../utils/currency';
import OwnedVoucherDetailSheet from './OwnedVoucherDetailSheet';
import VoucherBrandMark from './VoucherBrandMark';
import OTTLogoStrip from './OTTLogoStrip';

export default function MySubscriptionsSheet({ open, onClose }) {
  const { subscription, setSubscription, setScreen, SCREENS, ownedVouchers } = useApp();
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  if (!open) return null;

  const pack = subscription ? packs.find(p => p.id === subscription.packId) : null;

  return (
    <>
      <AnimatePresence>
        <motion.div
        className="absolute inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-dark rounded-t-[20px] ring-1 ring-white/5 overflow-hidden flex flex-col h-[70%]"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 320 }}
        >
          <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0">
            <button onClick={onClose} className="cursor-pointer">
              <ArrowLeft size={24} className="text-white" />
            </button>
            <span className="text-[18px] font-bold text-white">My Subscriptions</span>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-8">
            {pack ? (
              <div className="rounded-[16px] bg-surface-dark ring-1 ring-white/10 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[20px] font-bold text-amber">{pack.title}</h3>
                  <div className="w-[32px] h-[32px] rounded-full bg-black flex items-center justify-center">
                    <Crown size={16} className="text-amber" />
                  </div>
                </div>
                
                <span className="text-[13px] text-white/70 block mb-4">{subscription.expiresLabel || 'Active'}</span>
                
                <div className="bg-black/20 rounded-[12px] p-3 mb-6">
                  <span className="text-[12px] text-white/50 block mb-2">Included Platforms</span>
                  <OTTLogoStrip providers={pack.providers} />
                </div>
                
                {/* Auto-renewal Toggle */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <span className="text-[15px] font-bold text-white block mb-0.5">Auto renewal</span>
                    <span className="text-[12px] text-white/50">Next charge ৳{pack.price}</span>
                  </div>
                  <button 
                    onClick={() => setSubscription({ ...subscription, autoRenew: !subscription.autoRenew })}
                    className={`w-[44px] h-[24px] rounded-full relative transition-colors cursor-pointer ${subscription.autoRenew ? 'bg-cyan' : 'bg-white/20'}`}
                  >
                    <div className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full transition-transform ${subscription.autoRenew ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-[64px] h-[64px] rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Crown size={28} className="text-white/30" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">No Active Subscriptions</h3>
                <p className="text-[14px] text-white/50 max-w-[240px]">You don't have any active packs at the moment.</p>
              </div>
            )}

            {/* Digital Vouchers Section */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-[16px] font-bold text-white mb-4">Digital Vouchers</h3>
              
              {ownedVouchers && ownedVouchers.length > 0 ? (
                <div className="space-y-3">
                  {ownedVouchers.map(v => {
                    const product = vouchers.find(p => p.id === v.productId);
                    if (!product) return null;

                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVoucher(v)}
                        className="w-full bg-surface-dark ring-1 ring-white/10 rounded-[12px] p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <VoucherBrandMark brand={product.brand} logo={product.logo} size={40} radius={8} />
                          <div>
                            <span className="text-[14px] font-bold text-white block">{product.brand} {formatUsd(product.faceValue)} Voucher</span>
                            {v.state === 'unredeemed' && (
                              <span className="text-[12px] text-cyan font-bold block">Ready to redeem</span>
                            )}
                            {v.state === 'redeemed' && (
                              <span className="text-[12px] text-white/50 block">Redeemed</span>
                            )}
                            {v.state === 'expired' && (
                              <span className="text-[12px] text-red-500 block">Expired</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-white/30" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-surface-dark ring-1 ring-white/10 rounded-[12px] p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-[48px] h-[48px] rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Ticket size={24} className="text-white/30" />
                  </div>
                  <span className="text-[14px] font-bold text-white mb-1">Your Locker is Empty</span>
                  <p className="text-[13px] text-white/50 mb-4">You have no digital vouchers. Buy subscriptions for other apps in the store.</p>
                  <button 
                    onClick={() => {
                      onClose();
                      setScreen(SCREENS.VOUCHER_STORE);
                    }}
                    className="h-[36px] px-6 bg-white/10 hover:bg-white/20 text-white text-[13px] font-bold rounded-full cursor-pointer transition-colors"
                  >
                    Visit Voucher Store
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>

    <OwnedVoucherDetailSheet 
      voucherInstance={selectedVoucher} 
      onClose={() => setSelectedVoucher(null)} 
    />
    </>
  );
}

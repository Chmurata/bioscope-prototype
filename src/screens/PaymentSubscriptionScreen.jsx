import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { packs } from '../data/packs';

export default function PaymentSubscriptionScreen() {
  const {
    goBack, setScreen, SCREENS, subscription, setSubscription,
    ownedVouchers, setVoucherTab,
  } = useApp();

  const pack = subscription ? packs.find(p => p.id === subscription.packId) : null;
  const liveVouchers = (ownedVouchers || []).filter(v => v.state !== 'expired').length;

  // Vouchers are third-party goods, not a Bioscope subscription, so this page
  // only points at them — the locker itself lives on the Vouchers page.
  const rows = [
    {
      label: 'Vouchers & codes',
      hint: liveVouchers > 0 ? `${liveVouchers} active` : null,
      onClick: () => { setVoucherTab('mine'); setScreen(SCREENS.VOUCHER_STORE); },
    },
    { label: 'Redeem Code' },
    { label: 'View Payment History' },
    { label: 'Saved Payment Method' },
  ];

  return (
    <div className="absolute inset-0 bg-dark flex flex-col overflow-hidden z-40">
      <div className="shrink-0 px-5 pt-[max(env(safe-area-inset-top),var(--spacing-topsafe))] pb-2">
        <button onClick={goBack} className="cursor-pointer">
          <ArrowLeft size={24} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-[100px]">
        <h1 className="text-[20px] font-bold text-white tracking-tight mt-4 mb-4">Payment &amp; Subscription</h1>

        <button
          onClick={() => setScreen(SCREENS.PACK_CATALOGUE)}
          className="w-full h-[48px] rounded-[10px] bg-cyan flex items-center justify-center cursor-pointer active:scale-[0.99] transition-transform mb-6"
        >
          <span className="text-[15px] font-bold text-black">Subscribe</span>
        </button>

        {/* Current plan */}
        <div className="rounded-[10px] bg-surface-dark ring-1 ring-white/[0.08] p-4 mb-2">
          {pack ? (
            <>
              <span className="block text-[15px] font-bold text-white">{pack.title}</span>
              <span className="block text-[12px] text-white/60 mt-0.5">
                {subscription.expiresLabel || 'Active'}
              </span>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] text-white/80">Auto-renewal</span>
                <button
                  onClick={() => setSubscription({ ...subscription, autoRenew: !subscription.autoRenew })}
                  className={`w-[44px] h-[24px] rounded-full relative transition-colors cursor-pointer ${subscription.autoRenew ? 'bg-cyan' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full transition-transform ${subscription.autoRenew ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="block text-[15px] font-bold text-white">No Active Subscription</span>
              <span className="block text-[12px] text-white/60 mt-0.5">You don&apos;t have a subscription yet</span>
            </>
          )}
        </div>

        <div className="space-y-2">
          {rows.map(row => (
            <button
              key={row.label}
              onClick={row.onClick}
              className="w-full h-[56px] px-4 rounded-[10px] bg-surface-dark ring-1 ring-white/[0.08] flex items-center gap-3 cursor-pointer transition-colors hover:bg-white/[0.06]"
            >
              <span className="flex-1 text-left text-[15px] text-white">{row.label}</span>
              {row.hint && <span className="text-[12px] text-cyan font-semibold">{row.hint}</span>}
              <ChevronRight size={18} className="text-white/40" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
